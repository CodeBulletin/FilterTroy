from Database.db import connection, drop_db
import os

drop_db(connection)

print("Database dropped")

# Remove the data from following folders /Images/InputImages, /Images/OutputImages, /Images/ProfilePics, /Images/Temps

folders = ["./Images/InputImages", "./Images/OutputImages", "./Images/ProfilePics", "./Images/Temps"]
for folder in folders:
    for file in os.listdir(folder):
        os.remove(f"{folder}/{file}")