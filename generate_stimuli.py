import numpy as np
import imageio as imio
import argparse
import os

# pixel per centimeter of your screen
PIXEL_PER_CM = 65

# mask for complex filter
def mask(t,t0):
    return np.complex64(2.0*(np.abs(np.mod(t-t0,2*np.pi)-np.pi)<np.pi/2) \
    + 1.0*(np.abs(np.mod(t-t0,2*np.pi)-np.pi)==np.pi/2))

# mc spatial kernel
def mc_spatial_kernel(N, fM, fS, th, thS, std_contrast,
                      octave=1, ppcm=PIXEL_PER_CM, cplx=0):
    theta = (90-th)*np.pi/180 
    thetaSpread= thS*np.pi/180
    fMode = N/ppcm*fM 
    if octave == 1:
        fSpread = fS 
        u = np.sqrt(np.exp((fSpread/np.sqrt(8)*np.sqrt(np.log(2)))**2)-1)
    elif octave == 0:
        fSpread = N/ppcm*fS 
        u=np.roots([1,0,3,0, 3,0,1,0,-fSpread**2/fMode**2])
        u=u[np.where(np.isreal(u))]
        u=np.real(u[np.where(u>0)])
        u=u[0]

    rho=fMode*(1.0+u**2)
    srho= u 
    
    if np.mod(N,2)==0:
        Lx=np.concatenate((np.linspace(0,N//2-1,N//2),
                           np.linspace(-N//2,-1,N//2)))
    else:
        Lx=np.concatenate((np.linspace(0,(N-1)//2,(N+1)//2),
                           np.linspace((-N+1)//2,-1,(N-1)//2)))

    x,y=np.meshgrid(Lx,Lx)
    R=np.sqrt(x**2+y**2)
    R[0,0]=10**(-6)
    Theta=np.arctan2(y,x)
    
    # Spatial kernel
    angular=np.exp(np.cos(2*(Theta-theta))/(4*thetaSpread**2))
    radial=np.exp(-(np.log(R/rho)**2/np.log(1+srho**2))/2 )*(1.0/R)*(R<0.5*N)
    spatialKernel=angular*radial
    if cplx==1:
        spatialKernel = spatialKernel.astype(np.complex128)
        spatialKernel *= mask(Theta,theta).real
    
    # Compute normalization constant
    spatialKernel /= np.mean(spatialKernel) 
    spatialKernel = std_contrast*np.sqrt(spatialKernel)
    
    return spatialKernel

def band_pass_ori(N, sf, sf_bdw, th, th_bdw, m, std_contrast, seed=1): 
    if seed!=None:
        np.random.seed(seed)
    im = mc_spatial_kernel(N, sf, sf_bdw, th, th_bdw, std_contrast)
    #im /= im.mean()
    im = np.fft.ifft2(np.sqrt(im)*np.fft.fft2(np.random.randn(N,N))).real
    im -= im.mean()
    im /= im.std()
    return std_contrast*im+m


if __name__=='__main__':
    formatter = lambda prog: argparse.HelpFormatter(
                                prog,max_help_position=52)  
    parser = argparse.ArgumentParser(formatter_class=formatter)
    parser.add_argument('--exp', type=str, default='sf',\
                help='Experimental conditions : sf, sf_bdw, ori_bdw')    
    opt = parser.parse_args()

    n_stim = 13
    N = 512
    sf = 2.5
    sf_bdw = 1.1
    th = 90
    th_bdw = 5.0

    ave_lum = 127.0
    std_constrast = 35.0

    dirname = 'stim_'+opt.exp+'/'
    filename = 'stim_'+opt.exp+'_'
    os.makedirs(dirname, exist_ok=True)
    
    img = np.zeros((n_stim,N,N))

    if opt.exp=='sf':
        sf_list = np.linspace(1.0,5.0,n_stim)
        for i in range(n_stim):
            sf_ = sf_list[i]
            img[i] = (band_pass_ori(N, sf_, sf_bdw, th, th_bdw,
                                    ave_lum, std_constrast))
    elif opt.exp=='sf_bdw':
        sf_bdw_list = np.linspace(0.25,3.25,n_stim)
        for i in range(n_stim):
            sf_bdw_ = sf_bdw_list[i]
            img[i] = (band_pass_ori(N, sf, sf_bdw_, th, th_bdw,
                                    ave_lum, std_constrast))
    elif opt.exp=='ori_bdw':
        th_bdw_list = np.linspace(1.5,13.5,n_stim)
        for i in range(n_stim):
            th_bdw_ = th_bdw_list[i]
            img[i] = (band_pass_ori(N, sf, sf_bdw, th, th_bdw_,
                                    ave_lum, std_constrast))
            
    for i in range(n_stim):
        imio.imsave(dirname+filename+'%02i.png'%(i),
                    np.uint8(np.clip(img[i],0,255)))
            






