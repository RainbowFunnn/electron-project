import sqlite3
con = sqlite3.connect('database.db')

con.execute("DROP TABLE IF EXISTS Quotes")
con.execute("DROP TABLE IF EXISTS Products;")
con.execute("DROP TABLE IF EXISTS Users;")
# Users table
con.execute("CREATE TABLE Users (username TEXT UNIQUE, password TEXT, user_group TEXT);")

# User Quote Recording
con.execute("""CREATE TABLE Quotes (username TEXT,
                                    product TEXT,
                                    price REAL,
                                    quantity INTEGER,
                                    quote_group INTEGER,
                                    FOREIGN KEY (username) REFERENCES Users (username)
                                    );""")

con.commit()
con.close()
