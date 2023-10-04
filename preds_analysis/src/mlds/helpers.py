'''
Helpers for Maximum Likelihood Dimensional Scaling

Jonathan Vacher & Pierre Lelievre
'''

import numpy as np


def kernel(x_1, x_2, sig=1.0, gain=1.0):
    '''
    Isotropic squared exponential kernel. Computes
    a covariance matrix from points in X1 and X2.

    Args:
        x_1 (np.ndarray): Array of m points (m x d).
        x_2 (np.ndarray): Array of n points (n x d).
        sig (float): sigma
        gain (float): gain

    Returns:
        np.ndarray: Covariance matrix (m x n).
    '''
    sqdist = np.sum(x_1**2, 1).reshape(-1, 1) +\
        np.sum(x_2**2, 1) - 2 * np.dot(x_1, x_2.T)
    return gain**2 * np.exp(-0.5 / sig**2 * sqdist)


def rdm_func(n_steps=10, sig=0.25, shape=(1,)):
    '''
    Sampling of random bijection from [0,1] to [0,1]

    Args:
        n_steps (int): n_steps
        sig (float): sigma, positive float
        shape (tuple of int): tuple of int (m x n x ...)

    Returns:
        np.ndarray: a random bijection or a collection matrix
        (n_steps x m x n x ...).
    '''
    if np.isscalar(shape):
        shape = (shape,)
    X = np.linspace(0, 1, n_steps).reshape(-1, 1)
    # Mean and covariance of the prior
    mu = np.zeros(X.shape[0])
    cov = kernel(X, X, sig=sig, gain=1)
    samples = np.random.multivariate_normal(mean=mu,cov=cov,size=shape)
    samples = np.exp(samples)
    samples = np.cumsum(samples.T, axis=0)
    samples -= samples.min(axis=0,keepdims=True)
    samples /= samples[-1:]
    if len(shape)==1 and shape[0]==1:
        return samples[:,0]
    return samples.reshape((n_steps,)+shape)
