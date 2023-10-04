import matplotlib.pyplot as plt

# display image
def disp(im_list, shape=(1,1), scale=1):
    fig, ax = plt.subplots(nrows=shape[0], ncols=shape[1], squeeze=False)
    fig.set_size_inches(5*scale*shape[1]/2.54,5*scale*shape[0]/2.54)
    
    if shape[0]==shape[1]==1:
        im_list = [im_list]
    if len(im_list)>shape[0]*shape[1]:
        raise ValueError('The product of figure shape must be'+
                         ' lower than im_list length')
    
    k = 0
    for i in range(shape[0]):
        for j in range(shape[1]):
            ax[i,j].imshow(im_list[k], cmap='gray');
            ax[i,j].xaxis.set_visible(False)
            ax[i,j].yaxis.set_visible(False)
            k += 1
    return fig, ax
