import sqlite3
con = sqlite3.connect('database.db')
# Table image to store images
con.execute("DROP TABLE IF EXISTS Image;")
con.execute("CREATE TABLE Image (product_id TEXT NOT NULL, img BLOB NOT NULL)")
con.commit()

con.execute("DROP TABLE IF EXISTS Products;")
con.commit()
con.close()
