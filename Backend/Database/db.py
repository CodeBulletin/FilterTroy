import mysql.connector

from Database.dbtables import create_tables, tables_metadata
from Database.dbviews import create_views, views_metadata

from config import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME

def connection():
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
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

def create_db():
    connection = mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD
    )
    cursor = connection.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS FilterTroy")
    cursor.execute("USE FilterTroy")
    create_tables(cursor)
    create_views(cursor)
    
    print("Database created / connected to FilterTroy")
    cursor.close()
    connection.close()

def show_db(connection):
    cursor = connection.cursor()
    # tables_metadata(cursor)
    views_metadata(cursor)
    cursor.close()

def drop_db(connection):
    cursor = connection.cursor()
    cursor.execute("DROP DATABASE IF EXISTS FilterTroy")
    cursor.close()

def truncate_table(connection, table_name):
    cursor = connection.cursor()
    cursor.execute(f"TRUNCATE TABLE {table_name}")
    cursor.close()