import mysql.connector

from dbtables import create_tables, tables_metadata


def connect(host, user, password):
    return mysql.connector.connect(
        host=host,
        user=user,
        password=password
    )

def create_user(connection, username, email, hash_password):
    cursor = connection.cursor()
    cursor.execute("INSERT INTO users (username, email, disabled, hash_password) VALUES (%s, %s, %s, %s)", (username, email, False, hash_password))
    connection.commit()
    cursor.close()

def get_user(connection, username):
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.close()
    return user

def user_exists(connection, username):
    return get_user(connection, username) is not None

def create_db(connection):
    cursor = connection.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS FilterTroy")
    cursor.execute("USE FilterTroy")
    create_tables(cursor)
    print("Database created / connected to FilterTroy")
    cursor.close()

def show_db(connection):
    cursor = connection.cursor()
    tables_metadata(cursor)
    cursor.close()

def drop_db(connection):
    cursor = connection.cursor()
    cursor.execute("DROP DATABASE IF EXISTS FilterTroy")
    cursor.close()