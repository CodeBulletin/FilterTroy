import mysql.connector

from Database.dbtables import create_tables, tables_metadata
from Database.dbviews import create_views, views_metadata

def connect(host, user, password):
    return mysql.connector.connect(
        host=host,
        user=user,
        password=password
    )

def create_user(connection, username, email, profilepicpath, hash_password):
    cursor = connection.cursor()
    cursor.execute("INSERT INTO Users (UserName, Email, ProfilePicPath, Hashed_Password) VALUES (%s, %s, %s, %s)", (username, email, profilepicpath, hash_password))
    connection.commit()
    cursor.close()

def get_user(connection, username):
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Users WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.close()
    return user

def user_exists(connection, username):
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM Users WHERE LOWER(UserName) = LOWER(%s)", (username,))
    user = cursor.fetchone()
    cursor.close()
    return user is not None

def create_db(connection):
    cursor = connection.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS FilterTroy")
    cursor.execute("USE FilterTroy")
    create_tables(cursor)
    create_views(cursor)
    
    print("Database created / connected to FilterTroy")
    cursor.close()

def show_db(connection):
    cursor = connection.cursor()
    # tables_metadata(cursor)
    views_metadata(cursor)
    cursor.close()

def drop_db(connection):
    cursor = connection.cursor()
    cursor.execute("DROP DATABASE IF EXISTS FilterTroy")
    cursor.close()


connection = connect("localhost", "root", "1234")