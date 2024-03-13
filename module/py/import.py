import sys
import openpyxl
import sqlite3
from openpyxl import load_workbook
from openpyxl_image_loader import SheetImageLoader
import io
import pandas as pd

filepath = "sample.xlsx"
dbpath = "database.db"

wb = openpyxl.load_workbook(filepath)
ws = wb[wb.sheetnames[0]]
image_loader = SheetImageLoader(ws)
img_locs = []
for image_loc in image_loader._images:
    img_locs.append(image_loc)

# clean the image_locs and sort
img_locs_filtered = [item for item in img_locs if item.startswith('A')]
img_locs_ft = sorted(img_locs_filtered, key=lambda x: int(x[1:]))

# Extract images to BLOB
imgs_blob = []
for cell in img_locs_ft:
    img = image_loader.get(cell)
    stream = io.BytesIO()
    img.save(stream, format="PNG")
    imgs_blob.append(stream.getvalue())

# Extract Product Labels
img_labels = []
for label, img_blob in zip(img_locs_ft, imgs_blob):
    img_labels.append((ws[label.replace("A", "B")].value.split("-")[0].split(".")[0], img_blob))

# import image table to sqlite3 database
con = sqlite3.connect(dbpath)
cur = con.cursor()
cur.executemany("INSERT INTO Image VALUES (?, ?)", img_labels)
con.commit()

# import product data
df = pd.read_excel(filepath, engine="openpyxl")
df_clean = df.dropna(axis=1, how='all').dropna(how='all')
df_clean = df_clean.rename(columns={"Book Price (Ex. GST)": "Price", "Qty/Box": "Qty", "Color Finish": "Color", "WELS LIC.": "WELS", "REG. Number": "REG", "STAR Rating": "Rating", "Water Cconsump.": "WaterCon"})
df_clean = df_clean.round({"Price": 2})
df_clean.insert(0, "product_id", [code.split("-")[0].split(".")[0] for code in df_clean["Code"]])
df_clean.to_sql("Products", con, index=False)
con.commit()
con.close()
print("finish")
sys.stdout.flush()
