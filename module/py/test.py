import sqlite3
import io
from PIL import Image
con = sqlite3.connect('database.db')
cur = con.cursor()
cur.execute("SELECT * FROM Image WHERE product_id = 'BK1601'")
res = cur.fetchall()
testone = res[0][1]
stream = io.BytesIO(testone)
print(stream)
# Image.open(stream).show()
