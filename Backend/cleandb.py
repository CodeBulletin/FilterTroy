from Database.db import connection, drop_db, truncate_table
import os

drop_db(conn := connection())
conn.close()

print("Database dropped")

# Remove the data from following folders /Images/InputImages, /Images/OutputImages, /Images/ProfilePics, /Images/Temps

folders = ["./Images/InputImages", "./Images/OutputImages", "./Images/ProfilePics", "./Images/Temps"]
for folder in folders:
    for file in os.listdir(folder):
        os.remove(f"{folder}/{file}")

# tablename = "Users"
# truncate_table(connection, tablename)
