import sqlite3
con = sqlite3.connect('database.db')

con.execute("DROP TABLE IF EXISTS Products;")
# Users table
con.execute("DROP TABLE IF EXISTS Users;")
con.execute("CREATE TABLE Users (username TEXT UNIQUE, password TEXT, user_group TEXT);")

con.commit()
con.close()
