
#%%
import matplotlib.pyplot as plt
import numpy as np
#%%

x = np.linspace(0,10, 10)
y = np.array([10,15,25,30,40,45,47,53,60,64])

plt.plot(x, y)
plt.title('Evolution de votre progression')
plt.xlabel('numéro de séance')
plt.ylabel('précision du mouvement')
plt.ylim(0, 100)