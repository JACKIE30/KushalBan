import os
import numpy as np
import random
from PIL import Image
import json
from collections import defaultdict, Counter
import shutil
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
from tqdm import tqdm
import glob

class OpenEarthMapCityWiseSampler:
    def __init__(self, dataset_path, output_path):
        """
        Initialize the dataset sampler for Open Earth Map (City-wise structure)
        
        Args:
            dataset_path: Path to the Open Earth Map dataset root 
                         (e.g., "D:\SIH\OpenEarthMap\OpenEarthMap_wo_xBD")
            output_path: Path where the sampled dataset will be saved
        """
        self.dataset_path = dataset_path
        self.output_path = output_path
        
        # Open Earth Map class definitions (8 classes + background)
        self.class_names = {
            0: 'background',
            1: 'bareland', 
            2: 'rangeland',
            3: 'developed_space',
            4: 'road',
            5: 'tree',
            6: 'water',
            7: 'agriculture_land',
            8: 'building'
        }
        
        self.num_classes = len(self.class_names)
        
    def discover_city_structure(self):
        """Discover all cities and their image/label folder structure"""
        print("Discovering dataset structure...")
        
        city_data = {}
        
        # Look for all subdirectories (cities) in the dataset path
        city_dirs = [d for d in os.listdir(self.dataset_path) 
                    if os.path.isdir(os.path.join(self.dataset_path, d))]
        
        print(f"Found {len(city_dirs)} cities/regions:")
        
        for city_dir in city_dirs:
            city_path = os.path.join(self.dataset_path, city_dir)
            
            # Look for images and labels folders within each city
            images_path = None
            labels_path = None
            
            # Check common folder structures
            possible_img_folders = ['images', 'image', 'img', 'Images']
            possible_label_folders = ['labels', 'label', 'masks', 'Labels', 'gt']
            
            for folder in os.listdir(city_path):
                folder_path = os.path.join(city_path, folder)
                if os.path.isdir(folder_path):
                    if folder in possible_img_folders:
                        images_path = folder_path
                    elif folder in possible_label_folders:
                        labels_path = folder_path
            
            # If direct structure not found, look deeper
            if not images_path or not labels_path:
                for root, dirs, files in os.walk(city_path):
                    for dir_name in dirs:
                        if dir_name in possible_img_folders and not images_path:
                            images_path = os.path.join(root, dir_name)
                        elif dir_name in possible_label_folders and not labels_path:
                            labels_path = os.path.join(root, dir_name)
            
            if images_path and labels_path:
                # Count images in this city
                img_files = [f for f in os.listdir(images_path) 
                           if f.lower().endswith(('.png', '.jpg', '.jpeg', '.tif', '.tiff'))]
                
                city_data[city_dir] = {
                    'images_path': images_path,
                    'labels_path': labels_path,
                    'image_count': len(img_files),
                    'image_files': img_files
                }
                
                print(f"  - {city_dir}: {len(img_files)} images")
            else:
                print(f"  - {city_dir}: ⚠️ Could not find images/labels folders")
        
        total_images = sum(data['image_count'] for data in city_data.values())
        print(f"\nTotal images across all cities: {total_images}")
        
        return city_data
    
    def analyze_dataset_citywise(self, city_data):
        """Analyze the dataset to understand class distribution across cities"""
        print("\nAnalyzing dataset across all cities...")
        
        global_class_counts = defaultdict(int)
        global_pixel_counts = defaultdict(int)
        city_class_info = {}
        valid_images_per_city = {}
        
        for city_name, city_info in city_data.items():
            print(f"\nAnalyzing {city_name}...")
            
            images_path = city_info['images_path']
            labels_path = city_info['labels_path']
            image_files = city_info['image_files']
            
            city_class_counts = defaultdict(int)
            city_pixel_counts = defaultdict(int)
            valid_images = []
            
            for img_file in tqdm(image_files, desc=f"Processing {city_name}"):
                # Find corresponding label file
                label_file = self._find_corresponding_label(img_file, labels_path)
                
                if label_file:
                    label_path = os.path.join(labels_path, label_file)
                    
                    try:
                        label = np.array(Image.open(label_path))
                        unique_classes = np.unique(label)
                        
                        # Count images containing each class
                        for class_id in unique_classes:
                            if class_id < self.num_classes:
                                city_class_counts[class_id] += 1
                                global_class_counts[class_id] += 1
                        
                        # Count pixels for each class
                        for class_id in range(self.num_classes):
                            pixel_count = np.sum(label == class_id)
                            city_pixel_counts[class_id] += pixel_count
                            global_pixel_counts[class_id] += pixel_count
                        
                        valid_images.append({
                            'image_file': img_file,
                            'label_file': label_file,
                            'city': city_name,
                            'images_path': images_path,
                            'labels_path': labels_path,
                            'classes': unique_classes
                        })
                        
                    except Exception as e:
                        print(f"Error processing {img_file} in {city_name}: {e}")
                        continue
            
            city_class_info[city_name] = {
                'class_counts': dict(city_class_counts),
                'pixel_counts': dict(city_pixel_counts),
                'valid_images': len(valid_images)
            }
            
            valid_images_per_city[city_name] = valid_images
            
            print(f"  Valid images: {len(valid_images)}")
            print(f"  Classes found: {sorted(city_class_counts.keys())}")
        
        # Print global analysis
        print(f"\n" + "="*60)
        print("GLOBAL DATASET ANALYSIS")
        print("="*60)
        
        total_valid = sum(len(imgs) for imgs in valid_images_per_city.values())
        print(f"Total valid images: {total_valid}")
        
        print(f"\nGlobal class distribution (images containing each class):")
        for class_id in range(self.num_classes):
            count = global_class_counts.get(class_id, 0)
            print(f"  {self.class_names[class_id]}: {count} images")
        
        print(f"\nGlobal class distribution (pixel counts):")
        total_pixels = sum(global_pixel_counts.values())
        for class_id in range(self.num_classes):
            count = global_pixel_counts.get(class_id, 0)
            percentage = (count / total_pixels) * 100 if total_pixels > 0 else 0
            print(f"  {self.class_names[class_id]}: {count} pixels ({percentage:.2f}%)")
        
        return valid_images_per_city, global_class_counts, global_pixel_counts, city_class_info
    
    def _find_corresponding_label(self, img_file, labels_path):
        """Find corresponding label file for an image"""
        # Common label file extensions and naming patterns
        base_name = os.path.splitext(img_file)[0]
        
        possible_extensions = ['.png', '.jpg', '.jpeg', '.tif', '.tiff']
        possible_names = [
            f"{base_name}.png",  # Most common
            f"{base_name}.jpg",
            f"{base_name}.jpeg",
            f"{base_name}.tif",
            f"{base_name}.tiff",
            f"{base_name}_label.png",
            f"{base_name}_mask.png",
            f"{base_name}_gt.png"
        ]
        
        for name in possible_names:
            if os.path.exists(os.path.join(labels_path, name)):
                return name
        
        return None
    
    def stratified_sample_citywise(self, valid_images_per_city, global_class_counts, 
                                  train_size=10000, val_size=2000, test_size=3000):
        """
        Create a stratified sample across cities ensuring all classes are represented
        """
        print(f"\nCreating city-wise stratified sample...")
        print(f"Target sizes - Train: {train_size}, Val: {val_size}, Test: {test_size}")
        
        # Flatten all valid images from all cities
        all_valid_images = []
        for city_images in valid_images_per_city.values():
            all_valid_images.extend(city_images)
        
        print(f"Total images available: {len(all_valid_images)}")
        
        # Ensure we have enough images
        total_needed = train_size + val_size + test_size
        if len(all_valid_images) < total_needed:
            print(f"Warning: Only {len(all_valid_images)} images available, but {total_needed} requested")
            # Adjust sizes proportionally
            ratio = len(all_valid_images) / total_needed
            train_size = int(train_size * ratio)
            val_size = int(val_size * ratio)
            test_size = len(all_valid_images) - train_size - val_size
            print(f"Adjusted sizes - Train: {train_size}, Val: {val_size}, Test: {test_size}")
        
        # Strategy: Ensure all classes and cities are represented
        selected_images = []
        
        # Step 1: Ensure each class has minimum representation from different cities
        min_samples_per_class = 50
        
        for class_id in range(self.num_classes):
            class_images = [img for img in all_valid_images 
                          if class_id in img['classes']]
            
            if len(class_images) >= min_samples_per_class:
                # Try to sample from different cities for diversity
                city_groups = defaultdict(list)
                for img in class_images:
                    city_groups[img['city']].append(img)
                
                selected_from_class = []
                remaining_needed = min_samples_per_class
                
                # Sample evenly from cities that have this class
                cities_with_class = list(city_groups.keys())
                random.shuffle(cities_with_class)
                
                for city in cities_with_class:
                    if remaining_needed <= 0:
                        break
                    
                    city_images_for_class = city_groups[city]
                    samples_from_city = min(len(city_images_for_class), 
                                          max(1, remaining_needed // len(cities_with_class)))
                    
                    selected_from_city = random.sample(city_images_for_class, samples_from_city)
                    selected_from_class.extend(selected_from_city)
                    remaining_needed -= len(selected_from_city)
                
                # If we still need more samples, randomly select from remaining
                if remaining_needed > 0:
                    remaining_class_images = [img for img in class_images 
                                            if img not in selected_from_class]
                    if remaining_class_images:
                        additional = random.sample(remaining_class_images, 
                                                 min(remaining_needed, len(remaining_class_images)))
                        selected_from_class.extend(additional)
                
                selected_images.extend(selected_from_class)
            else:
                selected_images.extend(class_images)
                print(f"Warning: Only {len(class_images)} images available for class {self.class_names[class_id]}")
        
        # Remove duplicates while preserving order
        seen = set()
        unique_selected = []
        for img in selected_images:
            img_id = (img['city'], img['image_file'])
            if img_id not in seen:
                seen.add(img_id)
                unique_selected.append(img)
        
        selected_images = unique_selected
        
        # Step 2: Random sample remaining images to reach target size
        remaining_images = [img for img in all_valid_images 
                          if (img['city'], img['image_file']) not in seen]
        remaining_needed = total_needed - len(selected_images)
        
        if remaining_needed > 0 and len(remaining_images) >= remaining_needed:
            additional_images = random.sample(remaining_images, remaining_needed)
            selected_images.extend(additional_images)
        else:
            selected_images.extend(remaining_images)
        
        # Shuffle and split
        random.shuffle(selected_images)
        
        # Split into train/val/test
        train_images, temp_images = train_test_split(
            selected_images[:train_size + val_size + test_size], 
            test_size=(val_size + test_size), 
            random_state=42
        )
        
        val_images, test_images = train_test_split(
            temp_images,
            test_size=test_size,
            random_state=42
        )
        
        print(f"Final split sizes:")
        print(f"  Train: {len(train_images)}")
        print(f"  Val: {len(val_images)}")
        print(f"  Test: {len(test_images)}")
        
        # Show city distribution
        for split_name, split_images in [('Train', train_images), ('Val', val_images), ('Test', test_images)]:
            city_dist = defaultdict(int)
            for img in split_images:
                city_dist[img['city']] += 1
            print(f"  {split_name} city distribution: {dict(city_dist)}")
        
        return train_images, val_images, test_images
    
    def copy_citywise_dataset_split(self, train_images, val_images, test_images):
        """Copy the selected images from various cities to the output directory"""
        
        splits = {
            'train': train_images,
            'val': val_images, 
            'test': test_images
        }
        
        for split_name, image_list in splits.items():
            # Create directories
            split_img_dir = os.path.join(self.output_path, split_name, 'images')
            split_label_dir = os.path.join(self.output_path, split_name, 'labels')
            
            os.makedirs(split_img_dir, exist_ok=True)
            os.makedirs(split_label_dir, exist_ok=True)
            
            print(f"\nCopying {split_name} split ({len(image_list)} images)...")
            
            for i, img_info in enumerate(tqdm(image_list, desc=f"Copying {split_name}")):
                try:
                    # Create unique filename to avoid conflicts between cities
                    city_name = img_info['city']
                    img_file = img_info['image_file']
                    label_file = img_info['label_file']
                    
                    # Create unique names: city_originalname.ext
                    base_name = os.path.splitext(img_file)[0]
                    img_ext = os.path.splitext(img_file)[1]
                    label_ext = os.path.splitext(label_file)[1]
                    
                    unique_img_name = f"{city_name}_{base_name}{img_ext}"
                    unique_label_name = f"{city_name}_{base_name}{label_ext}"
                    
                    # Source paths
                    src_img = os.path.join(img_info['images_path'], img_file)
                    src_label = os.path.join(img_info['labels_path'], label_file)
                    
                    # Destination paths
                    dst_img = os.path.join(split_img_dir, unique_img_name)
                    dst_label = os.path.join(split_label_dir, unique_label_name)
                    
                    # Copy files
                    shutil.copy2(src_img, dst_img)
                    shutil.copy2(src_label, dst_label)
                    
                except Exception as e:
                    print(f"Error copying {img_info['image_file']} from {img_info['city']}: {e}")
    
    def verify_citywise_split_quality(self, train_images, val_images, test_images):
        """Verify that all classes and cities are represented in each split"""
        
        splits = {
            'train': train_images,
            'val': val_images,
            'test': test_images
        }
        
        print("\n" + "="*60)
        print("CITY-WISE SPLIT QUALITY VERIFICATION")
        print("="*60)
        
        for split_name, image_list in splits.items():
            print(f"\n{split_name.upper()} SPLIT:")
            split_class_counts = defaultdict(int)
            split_city_counts = defaultdict(int)
            
            for img_info in image_list:
                # Count cities
                split_city_counts[img_info['city']] += 1
                
                # Count classes
                for class_id in img_info['classes']:
                    if class_id < self.num_classes:
                        split_class_counts[class_id] += 1
            
            print(f"  Images: {len(image_list)}")
            print(f"  Cities represented: {len(split_city_counts)}")
            for city, count in sorted(split_city_counts.items()):
                print(f"    {city}: {count} images")
            
            print(f"  Classes represented:")
            for class_id in range(self.num_classes):
                count = split_class_counts.get(class_id, 0)
                print(f"    {self.class_names[class_id]}: {count} images")
                
            # Check if any class is missing
            missing_classes = [self.class_names[i] for i in range(self.num_classes) 
                             if i not in split_class_counts]
            if missing_classes:
                print(f"  ⚠️  WARNING: Missing classes: {missing_classes}")
            else:
                print(f"  ✅ All classes represented!")
    
    def save_citywise_dataset_info(self, train_images, val_images, test_images, city_class_info):
        """Save dataset information including city-wise details"""
        
        # Process split information
        splits_info = {}
        for split_name, image_list in [('train', train_images), ('val', val_images), ('test', test_images)]:
            city_counts = defaultdict(int)
            class_counts = defaultdict(int)
            
            for img_info in image_list:
                city_counts[img_info['city']] += 1
                for class_id in img_info['classes']:
                    if class_id < self.num_classes:
                        class_counts[class_id] += 1
            
            splits_info[split_name] = {
                'total_images': len(image_list),
                'cities': dict(city_counts),
                'classes': dict(class_counts),
                'files': [f"{img['city']}_{os.path.splitext(img['image_file'])[0]}" 
                         for img in image_list]
            }
        
        dataset_info = {
            'dataset_structure': 'city_wise',
            'class_names': self.class_names,
            'num_classes': self.num_classes,
            'city_class_analysis': city_class_info,
            'splits': {
                'train': splits_info['train']['total_images'],
                'val': splits_info['val']['total_images'],
                'test': splits_info['test']['total_images']
            },
            'detailed_splits': splits_info
        }
        
        # Save dataset info
        with open(os.path.join(self.output_path, 'dataset_info.json'), 'w') as f:
            json.dump(dataset_info, f, indent=2)
        
        print(f"\nDataset info saved to {os.path.join(self.output_path, 'dataset_info.json')}")
    
    def create_sampled_dataset(self, train_size=10000, val_size=2000, test_size=3000, random_seed=42):
        """Main method to create the sampled dataset from city-wise structure"""
        
        # Set random seed for reproducibility
        random.seed(random_seed)
        np.random.seed(random_seed)
        
        print("="*70)
        print("OPEN EARTH MAP CITY-WISE DATASET SAMPLER")
        print("="*70)
        
        # Step 1: Discover city structure
        city_data = self.discover_city_structure()
        
        if not city_data:
            print("❌ No valid city data found! Please check your dataset path.")
            return
        
        # Step 2: Analyze dataset across cities
        valid_images_per_city, global_class_counts, global_pixel_counts, city_class_info = self.analyze_dataset_citywise(city_data)
        
        # Step 3: Create stratified sample
        train_images, val_images, test_images = self.stratified_sample_citywise(
            valid_images_per_city, global_class_counts, train_size, val_size, test_size
        )
        
        # Step 4: Verify split quality
        self.verify_citywise_split_quality(train_images, val_images, test_images)
        
        # Step 5: Copy files with unique naming
        self.copy_citywise_dataset_split(train_images, val_images, test_images)
        
        # Step 6: Save dataset info
        self.save_citywise_dataset_info(train_images, val_images, test_images, city_class_info)
        
        print("\n" + "="*70)
        print("CITY-WISE DATASET SAMPLING COMPLETED!")
        print("="*70)
        print(f"Sampled dataset saved to: {self.output_path}")
        print(f"Files from multiple cities combined with unique naming: city_filename.ext")
        print(f"Ready for U-NET training!")

# Usage Example
if __name__ == "__main__":
    # Configure paths
    DATASET_PATH = r"D:\SIH\OpenEarthMap\OpenEarthMap_wo_xBD"  # Your actual path
    OUTPUT_PATH = r"D:\SIH\sampled_open_earth_map"  # Output path
    
    # Create sampler instance
    sampler = OpenEarthMapCityWiseSampler(DATASET_PATH, OUTPUT_PATH)
    
    # Create sampled dataset
    sampler.create_sampled_dataset(
        train_size=10000,  # 10k training samples
        val_size=2000,     # 2k validation samples  
        test_size=3000,    # 3k test samples
        random_seed=42     # For reproducibility
    )
    
    print("\n" + "="*50)
    print("NEXT STEPS FOR U-NET TRAINING:")
    print("="*50)
    print("1. ✅ Dataset sampling completed")
    print("2. 📊 Check dataset_info.json for detailed statistics")
    print("3. 🔧 Use the sampled dataset for U-NET training")
    print("4. 🗺️ Classes include: agriculture_land, water, tree, building")
    print("   (Perfect for FRA asset mapping!)")
    print("5. 📁 Images from different cities combined with unique naming")