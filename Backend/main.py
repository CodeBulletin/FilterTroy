from fastapi import FastAPI, HTTPException, status, File, UploadFile, Form
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import FileResponse
from jose import JWTError, jwt
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional
import bcrypt
from db import connect, create_user, get_user, create_db, user_exists
from fastapi.middleware.cors import CORSMiddleware
import cv2
from ee import evaluate_filter
import json

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# connection = connect("localhost", "root", "1234")

# create_db(connection)

# # to get a string like this run:
# # openssl rand -hex 32
# SECRET_KEY = "123456789"
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 30

# class Token(BaseModel):
#     access_token: str
#     token_type: str

# class TokenData(BaseModel):
#     username: Optional[str] = None

class User(BaseModel):
    username: str
    email: str
    disabled: Optional[bool] = None

# class UserLogin(BaseModel):
#     username: str
#     password: str

# class UserCreate(BaseModel):
#     username: str
#     email: str
#     password: str

# class UserInDB(User):
#     hashed_password: str

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# def dict_to_userinDB(user_dict):
#     return UserInDB(username=user_dict["username"], email=user_dict["email"], disabled=user_dict["disabled"], hashed_password=user_dict["hashed_password"])

# def get_password_hash(password):
#     return bcrypt.hashpw(password.encode('utf8'), bcrypt.gensalt()).decode('utf8')

# def verify_password(plain_password, hashed_password):
#     return bcrypt.checkpw(plain_password.encode('utf8'), hashed_password.encode('utf8'))

# def get_user(connection, username: str):
#     user_dict = get_user(connection, username)
#     if user_dict is not None:
#         return dict_to_userinDB(user_dict)
#     return None

# def authenticate_user(fake_db, username: str, password: str):
#     user_dict = get_user(fake_db, username)
#     if not user_dict:
#         return False
#     user = dict_to_userinDB(user_dict)
#     if not verify_password(password, user.hashed_password):
#         return False
#     return user

# def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
#     to_encode = data.copy()
#     if expires_delta:
#         expire = datetime.utcnow() + expires_delta
#     else:
#         expire = datetime.utcnow() + timedelta(minutes=15)
#     to_encode.update({"exp": expire})
#     encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
#     return encoded_jwt

# @app.post("/token", response_model=Token)
# async def login_for_access_token(UserLogin: UserLogin):
#     user = authenticate_user(connection, UserLogin.username, UserLogin.password)
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect username or password",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
#     return {"access_token": access_token, "token_type": "bearer"}

# @app.get("/users/me", response_model=User)
# async def read_users_me(token: str):
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     try:
#         ttype, token = token.split()
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         username: str = payload.get("sub")
#         if username is None:
#             raise credentials_exception
#         token_data = TokenData(username=username)
#     except JWTError:
#         raise credentials_exception
#     except Exception:
#         raise credentials_exception
#     user = get_user(connection, username=token_data.username)
#     if user is None:
#         raise credentials_exception
#     return user

# @app.post("/signup", response_model=User)
# def create_user(user: UserCreate):
#     if user_exists(user.username):
#         raise HTTPException(status_code=400, detail="Username already registered")
#     hashed_password = get_password_hash(user.password)
#     new_user = UserInDB(username=user.username, hashed_password=hashed_password, disabled=False, email=user.email)
#     create_user(connection, new_user.username, new_user.email, new_user.hashed_password)
#     return new_user


@app.post("/filter", response_class=FileResponse)
async def apply_filter(code: str = Form(...), vars: str = Form(...), image: UploadFile = File(...)):
    content = await image.read()
    # write the content to a file
    with open("data.jpg", "wb") as f:
        f.write(content)

    # read the image
    img = cv2.imread("data.jpg")

    #convert the vars to a dict
    variables = json.loads(vars)

    evaluated = evaluate_filter(code, img, variables)

    print(variables)


    # print(evaluated)
    # Save the image
    cv2.imwrite("data.jpg", evaluated)

    return FileResponse("data.jpg", media_type="image/jpeg")
