from datetime import datetime, timedelta
from typing import Optional
import bcrypt
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from Models.users import UserInDB
from db import get_user as get_userdb

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def dict_to_userinDB(user_dict):
    print(user_dict)
    return UserInDB(username=user_dict["UserName"], email=user_dict["Email"], disabled=user_dict["Disabled"], hashed_password=user_dict["Hashed_Password"], profile_pic=user_dict["ProfilePicPath"], created_on=user_dict["CreatedOn"])

def get_password_hash(password):
    return bcrypt.hashpw(password.encode('utf8'), bcrypt.gensalt()).decode('utf8')

def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf8'), hashed_password.encode('utf8'))

def get_user(connection, username: str):
    user_dict = get_userdb(connection, username)
    if user_dict is not None:
        return dict_to_userinDB(user_dict)
    return None

def authenticate_user(fake_db, username: str, password: str):
    user_dict = get_userdb(fake_db, username)
    if not user_dict:
        return False
    user = dict_to_userinDB(user_dict)
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, SECRET_KEY: str, ALGORITHM: str, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt