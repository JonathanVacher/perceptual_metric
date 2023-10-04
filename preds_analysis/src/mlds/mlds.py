'''
Maximum Likelihood Dimensional Scaling

Jonathan Vacher & Pierre Lelievre
'''

import numpy as np
from scipy.optimize import minimize
from scipy.special import logit, expit, erf, erfinv, xlogy, xlog1py
from itertools import combinations

ALPHA = 1e-3
EPSILON = 1e-16


def _phi(x):
    return 0.5*(1.0-erf(x/np.sqrt(2.0)))


def _phi_inv(x):
    return erfinv(1.0-2.0*x)*np.sqrt(2.0)


class MLDS:
    def __init__(self, n_step, comb_thresh_low=None, comb_thresh_up=None,
                 comb_max_delta=None, n_iter=10000, seed=100):
        self.n_step = n_step
        self.x = np.linspace(0.0, 1.0, self.n_step)
        self.comb = None
        self._compute_comb(comb_thresh_low, comb_thresh_up, comb_max_delta)
        self.n_comb = self.comb.shape[0]
        self.comb_mat = None
        self._compute_comb_mat()
        self.n_iter = n_iter
        self.seed = seed
        self.rng = np.random.default_rng(self.seed)
        self.res = None

    def _compute_comb(self, comb_thresh_low, comb_thresh_up, comb_max_delta):
        if comb_thresh_low is None:
            comb_thresh_low = 1
        if comb_thresh_up is None:
            comb_thresh_up = self.n_step
        if comb_max_delta is None:
            comb_max_delta = comb_thresh_up
        self.comb = np.array(list(combinations(np.arange(self.n_step), 3)))
        selec = np.prod(
            np.diff(self.comb)>=comb_thresh_low, axis=-1).astype(bool)
        selec *= np.prod(
            np.diff(self.comb)<=comb_thresh_up, axis=-1).astype(bool)
        selec *= np.prod(np.fabs(
            np.diff(self.comb, 2))<=comb_max_delta, axis=-1).astype(bool)
        self.comb = self.comb[selec]

    def _compute_comb_mat(self):
        self.comb_mat = np.zeros((self.n_comb, self.n_step), dtype=np.float64)
        for i in range(self.n_comb):
            self.comb_mat[i, self.comb[i, 0]] += 1.0
            self.comb_mat[i, self.comb[i, 1]] -= 2.0
            self.comb_mat[i, self.comb[i, 2]] += 1.0

    def simulate(self, sig_noise, n_rep=1, mu=0.0, tau=1.0, func=None):
        if func is None:
            self.x = np.clip(self.x, EPSILON, 1.0-EPSILON)
            func = lambda x: expit((logit(x)-mu)/tau)
        resp = sig_noise * self.rng.standard_normal(size=(self.n_comb, n_rep))
        resp += np.dot(self.comb_mat, func(self.x))[:, None]
        resp = resp < 0
        # S1/S2/S3 => S3-S2 < S2-S1 => S3-2*S2+S1<0
        # resp = 1 if S3-S2 < S2-S1
        # resp = 0 otherwise
        return func, resp

    def _loss_prior(self, f, prior_param):
        return (prior_param+1.0)*np.log(f[-1]) + self.n_step/f[-1]

    def _loss(self, f, A, b, prior, prior_param):
        y = np.linalg.norm(A@f-b)**2
        if prior:
            y += self._loss_prior(f, prior_param)
        return y

    def fit(self, resp, prior=False, prior_param=0.0):
        # Compute A and b
        b = _phi_inv(np.clip(resp.mean(axis=1), ALPHA, 1.0-ALPHA))
        A = self.comb_mat[:,1:]
        # Compute minimization
        f0 = self.x[1:]*self.n_step/2.0
        constraints = (
            {'type': 'ineq', 'fun': lambda f: f},
            {'type': 'ineq', 'fun': np.diff})
        options = {'maxiter': self.n_iter}
        self.res = minimize(
            self._loss, x0=f0, args=(A, b, prior, prior_param), method='SLSQP',
            constraints=constraints, options=options)
        # Results
        f = self.res.x
        f = np.insert(f, 0, 0)
        sigma = 1.0 / f[-1]
        f *= sigma
        return f, sigma

    def _loss_ml_prior(self, f, prior_param):
        return -(prior_param-1.0)*np.log(np.fabs(f[-1])) + self.n_step*f[-1]

    def _loss_ml(self, f, resp, prior, prior_param):
        y = np.dot(self.comb_mat[:, 1:], np.concatenate((f[:-1], [1.0])))
        y = _phi(y/f[-1])
        r = resp.mean(axis=1)
        y = xlogy(r, y)+xlog1py(1.0-r, -y)
        y = -np.sum(y)
        if prior:
            y += self._loss_ml_prior(f, prior_param)
        return y

    def fit_ml(self, resp, prior=False, prior_param=2.0):
        f0 = np.concatenate((self.x[1:-1], [2.0/self.n_step]))
        constraints = (
            {'type': 'ineq', 'fun': lambda f: f},
            {'type': 'ineq', 'fun': lambda f: 1.0-f[:-1]},
            {'type': 'ineq', 'fun': lambda f: np.diff(f[:-1])})
        options = {'maxiter': self.n_iter}
        self.res = minimize(
            self._loss_ml, x0=f0, args=(resp, prior, prior_param),
            method='SLSQP', constraints=constraints, options=options)
        return np.concatenate(([0.0], self.res.x[:-1], [1.0])), self.res.x[-1]


class MLDS4(MLDS):
    def _compute_comb(self, comb_thresh_low, comb_thresh_up, comb_max_delta):
        if comb_thresh_low is None:
            comb_thresh_low = 1
        if comb_thresh_up is None:
            comb_thresh_up = self.n_step
        if comb_max_delta is None:
            comb_max_delta = comb_thresh_up
        self.comb = np.array(list(combinations(np.arange(self.n_step), 4)))
        selec = np.prod(
            np.diff(self.comb)[:,::2]>=comb_thresh_low, axis=-1).astype(bool)
        selec *= np.prod(
            np.diff(self.comb)[:,::2]<=comb_thresh_up, axis=-1).astype(bool)
        selec *= (np.fabs(
                    np.diff(self.comb)[:,1])<=comb_max_delta).astype(bool)
        self.comb = self.comb[selec]

    def _compute_comb_mat(self):
        self.comb_mat = np.zeros((self.n_comb, self.n_step), dtype=np.float64)
        for i in range(self.n_comb):
            self.comb_mat[i, self.comb[i, 0]] += 1.0
            self.comb_mat[i, self.comb[i, 1]] -= 1.0
            self.comb_mat[i, self.comb[i, 2]] -= 1.0
            self.comb_mat[i, self.comb[i, 3]] += 1.0


class CMLDS(MLDS):
    def __init__(self, n_step, comb_thresh_low=None, comb_thresh_up=None,
                 comb_max_delta=None, n_iter=10000, seed=100):
        self.cycle = None
        super().__init__(n_step, comb_thresh_low, comb_thresh_up,
                         comb_max_delta, n_iter, seed)

    def _compute_comb(self, comb_thresh_low, comb_thresh_up, comb_max_delta):
        if comb_thresh_low is None:
            comb_thresh_low = 1
        if comb_thresh_up is None:
            comb_thresh_up = (self.n_step - 1)//3
        assert comb_thresh_up <= (self.n_step - 1)//3,\
            'comb_thresh_up <= (n_step - 1)//3'
        if comb_max_delta is None:
            comb_max_delta = comb_thresh_up
        self.comb = np.array(list(combinations(np.arange(
            self.n_step - 1 + 2*comb_thresh_up), 3)))
        selec = self.comb[:, 0] < self.n_step - 1
        selec *= np.prod(
            np.diff(self.comb)>=comb_thresh_low, axis=-1).astype(bool)
        selec *= np.prod(
            np.diff(self.comb)<=comb_thresh_up, axis=-1).astype(bool)
        selec *= np.prod(np.fabs(
            np.diff(self.comb, 2))<=comb_max_delta, axis=-1).astype(bool)
        self.comb = self.comb[selec]
        self.cycle = np.diff((self.comb >= self.n_step - 1) * 1.0, 2)[:, 0]
        self.comb %= self.n_step - 1

    def _compute_comb_mat(self):
        self.comb_mat = np.zeros(
            (self.n_comb, self.n_step - 1), dtype=np.float64)
        for i in range(self.n_comb):
            self.comb_mat[i, self.comb[i, 0]] += 1.0
            self.comb_mat[i, self.comb[i, 1]] -= 2.0
            self.comb_mat[i, self.comb[i, 2]] += 1.0

    def simulate(self, sig_noise, n_rep=1, mu=0.0, tau=1.0, func=None):
        if func is None:
            self.x = np.clip(self.x, EPSILON, 1.0-EPSILON)
            func = lambda x: expit((logit(x)-mu)/tau)
        resp = sig_noise * self.rng.standard_normal(size=(self.n_comb, n_rep))
        resp += np.dot(self.comb_mat, func(self.x)[:-1])[:, None]
        resp += self.cycle[:, None]
        resp = resp < 0
        # S1/S2/S3 => S3-S2 < S2-S1 => S3-2*S2+S1<0
        # resp = 1 if S3-S2 < S2-S1
        # resp = 0 otherwise
        return func, resp

    def _loss(self, f, A, b, prior, prior_param):
        y = np.linalg.norm(A@f[:-1]+self.cycle*f[-1]-b)**2
        if prior:
            y += self._loss_prior(f, prior_param)
        return y

    def _loss_ml(self, f, resp, prior, prior_param):
        y = np.dot(self.comb_mat[:, 1:], f[:-1])
        y += self.cycle
        y = _phi(y/f[-1])
        r = resp.mean(axis=1)
        y = xlogy(r, y)+xlog1py(1.0-r, -y)
        y = -np.sum(y)
        if prior:
            y += self._loss_ml_prior(f, prior_param)
        return y
