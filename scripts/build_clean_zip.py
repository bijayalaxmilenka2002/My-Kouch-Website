import os
import zipfile

dist_dir = os.path.abspath('client/dist')
zip_path = os.path.abspath('mykouch_frontend_build.zip')

if os.path.exists(zip_path):
    os.remove(zip_path)

print(f"Creating zip from {dist_dir} to {zip_path}")

with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(dist_dir):
        for f in files:
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, dist_dir)
            # CRITICAL: Always use POSIX forward slashes for Linux web hosting
            posix_path = rel_path.replace('\\', '/')
            zf.write(full_path, posix_path)
            print(f"Added: {posix_path}")

print("Zip created successfully!")

# Verify entry names
with zipfile.ZipFile(zip_path, 'r') as zf:
    sample_entries = [entry.filename for entry in zf.infolist()[:15]]
    print("Sample entries in zip:")
    for entry in sample_entries:
        print(" -", entry)
