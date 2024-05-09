ACCESS_TOKEN_EXPIRE_MINUTES = 600
SECRET_KEY = "123456789"
ALGORITHM = "HS256"
ORIGINS = [
    "http://localhost:5173",
]
EXPOSE_HEADERS = ["X-User-Info", "Authorization"]

DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = "1234"
DB_NAME = "FilterTroy"