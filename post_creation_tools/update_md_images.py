#run using python update_md_images.py "Hello DuckDB.md"
import fileinput,re
for f in fileinput.input(inplace=True):
    print(re.sub(r'^(!.*]\()(\w+_files/)', r'\1/images/\2', f), end='')