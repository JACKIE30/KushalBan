#INFERENCE WITH FILE UPLOAD DIALOG
#INFERENCE WITH FILE UPLOAD DIALOG
#INFERENCE WITH FILE UPLOAD DIALOG
#INFERENCE WITH FILE UPLOAD DIALOG

import os
import torch
import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path
import rasterio
import cv2
import sys
import tkinter as tk
from tkinter import filedialog

sys.path.append(r"D:\SIH\open_earth_map") # path to your local folder 
import open_earth_map as oem

PREDS_DIR = "predictions"
os.makedirs(PREDS_DIR, exist_ok=True)
N_CLASSES = 9

root = tk.Tk()
root.withdraw()

# Open the file dialog and store the selected path
print("Opening file dialog to select an image...")
image_path = filedialog.askopenfilename(
    title="Select a .tif image file",
    filetypes=[("TIF files", "*.tif"), ("TIFF files", "*.tiff"), ("All files", "*.*")]
)

if not image_path:
    print("No file selected. Exiting script.")
    sys.exit()

print(f"File selected: {image_path}")

test_fns = [image_path]

# Load dataset using the user-provided file path.
test_data = oem.dataset.OpenEarthMapDataset(test_fns, n_classes=N_CLASSES, augm=None, testing=True)

img, fn = test_data[0][0], test_data[0][2]


# --- Define class names ---
CLASS_NAMES = [
    "Background",
    "Bareland",
    "Rangeland",
    "Developed_Space",
    "Road",
    "Tree",
    "Water",
    "Agriculture land",
    "Building"
]

# Load trained model network
network = oem.networks.UNet(in_channels=3, n_classes=N_CLASSES)
network = oem.utils.load_checkpoint(
    network,
    model_name="best_model.pth",
    model_dir=r"D:\SIH\models\outputs"
)

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
network = network.to(DEVICE)
img = img.to(DEVICE)

# Run prediction
with torch.no_grad():
    prd_tensor = network(img.unsqueeze(0)).squeeze(0).cpu()

class_map = np.argmax(prd_tensor.numpy(), axis=0)

# Calculate class percentages
total_pixels = class_map.size
class_counts = np.bincount(class_map.flatten(), minlength=N_CLASSES)
class_percentages = (class_counts / total_pixels) * 100

print("\n--- Class distribution in the image ---")
for i, pct in enumerate(class_percentages):
    print(f"{CLASS_NAMES[i]}: {pct:.2f}%")
print("-------------------------------------\n")

prd_rgb = oem.utils.make_rgb(class_map)

fout = os.path.join(PREDS_DIR, os.path.basename(fn))
with rasterio.open(fn, "r") as src:
    profile = src.profile
    prd_resized = cv2.resize(
        prd_rgb,
        (profile["width"], profile["height"]),
        interpolation=cv2.INTER_NEAREST,
    )
    profile.update(dtype=rasterio.uint8, count=3)
    with rasterio.open(fout, "w", **profile) as dst:
        for i in range(3):
            dst.write(prd_resized[:, :, i], i + 1)
print(f"Prediction saved to: {fout}")

fig, axs = plt.subplots(2, 1, figsize=(6, 8))

img_np = np.moveaxis(img.cpu().numpy(), 0, -1)
img_np = img_np / img_np.max()
axs[0].imshow(img_np)
axs[0].set_title(f"Original: {os.path.basename(fn)}")
axs[0].axis("off")

axs[1].imshow(prd_rgb)
axs[1].set_title("Predicted Segmentation")
axs[1].axis("off")

plt.tight_layout()
plt.show()

# Pie chart with class names
plt.figure(figsize=(6, 6))
plt.pie(class_percentages, labels=CLASS_NAMES,
        autopct="%1.1f%%", startangle=90)
plt.title("Class Distribution in Image")
plt.show()