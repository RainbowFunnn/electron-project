import sqlite3
con = sqlite3.connect('database.db')

con.execute("DROP TABLE IF EXISTS Products;")
con.commit()
con.close()
