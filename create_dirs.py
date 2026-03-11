#!/usr/bin/env python3
import os
from pathlib import Path

# Directories to create
directories = [
    "assets/css",
    "assets/js",
    "assets/images",
    "data",
    ".github/workflows"
]

# Create directories
print("Creating directories...\n")
for dir_path in directories:
    Path(dir_path).mkdir(parents=True, exist_ok=True)
    print(f"✓ Created: {dir_path}")

# Verify by listing
print("\n" + "="*50)
print("Verifying directories exist:\n")

for dir_path in directories:
    path_obj = Path(dir_path)
    if path_obj.exists() and path_obj.is_dir():
        print(f"✓ {dir_path} exists")
    else:
        print(f"✗ {dir_path} MISSING")

# Show directory tree
print("\n" + "="*50)
print("Directory structure:\n")

def show_tree(path, prefix="", max_depth=3, current_depth=0):
    if current_depth >= max_depth:
        return
    try:
        items = sorted(Path(path).iterdir(), key=lambda x: (not x.is_dir(), x.name))
        for i, item in enumerate(items):
            is_last = i == len(items) - 1
            current_prefix = "└── " if is_last else "├── "
            print(f"{prefix}{current_prefix}{item.name}")
            if item.is_dir() and current_depth < max_depth - 1:
                try:
                    next_prefix = prefix + ("    " if is_last else "│   ")
                    show_tree(item, next_prefix, max_depth, current_depth + 1)
                except:
                    pass
    except:
        pass

show_tree(".")
