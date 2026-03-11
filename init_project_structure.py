import os

directories = [
    "assets/css",
    "assets/js",
    "assets/images",
    "data",
    ".github/workflows"
]

for directory in directories:
    try:
        os.makedirs(directory, exist_ok=True)
        print(f"Created: {directory}")
    except Exception as e:
        print(f"Error creating {directory}: {e}")

print("\nVerifying directories:")
for directory in directories:
    if os.path.exists(directory):
        print(f"[OK] {directory} exists")
    else:
        print(f"[FAIL] {directory} does not exist")
