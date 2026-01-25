import os
import re
import sys

# Define base directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def check_file_exists(relative_path):
    full_path = os.path.join(BASE_DIR, relative_path.replace('/', os.sep))
    if os.path.exists(full_path):
        print(f"   [OK] Found: {relative_path}")
        return True
    else:
        print(f"   [FAIL] MISSING: {relative_path} (Expected at: {full_path})")
        return False

def parse_js_data(file_path):
    """
    Rudimentary parser to extract image and link paths from the JS object.
    We don't need full JS parsing, just regex to find keys.
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract objects between { }
    # This is a simple heuristic and might fail on complex nested structures, but fine for this config
    matches = re.findall(r'\{(.*?)\}', content, re.DOTALL)
    
    entries = []
    for match in matches:
        if "image:" in match and "link:" in match:
            # Extract image
            img_match = re.search(r'image:\s*["\'](.*?)["\']', match)
            link_match = re.search(r'link:\s*["\'](.*?)["\']', match)
            
            if img_match and link_match:
                entries.append({
                    'image': img_match.group(1),
                    'link': link_match.group(1)
                })
    return entries

print("Starting Verification...")
errors = 0

# 1. Verify Data Config Integrity
data_js_path = os.path.join(BASE_DIR, 'js', 'data.js')
if not os.path.exists(data_js_path):
    print(f"CRITICAL: js/data.js not found at {data_js_path}")
    sys.exit(1)

team_members = parse_js_data(data_js_path)
print(f"Found {len(team_members)} team configurations.")

for i, member in enumerate(team_members):
    print(f"\nChecking Member #{i+1}")
    if not check_file_exists(member['image']):
        errors += 1
    if not check_file_exists(member['link']):
        errors += 1

# 2. Verify Core Assets
core_assets = [
    'css/main.css',
    'css/landing.css',
    'css/responsive.css',
    'js/app.js',
    'index.html',
    'team/template.html',
    'assets/documents/resume.pdf'
]

print("\nChecking Core Assets...")
for asset in core_assets:
    if not check_file_exists(asset):
        errors += 1

print("\n-------------------")
if errors == 0:
    print("SUCCESS: All checks passed.")
    sys.exit(0)
else:
    print(f"FAILURE: {errors} errors found.")
    sys.exit(1)
