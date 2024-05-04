from fastapi import APIRouter, HTTPException, status
from fastapi import UploadFile, Form, File, Depends
from fastapi.responses import Response
from jose import JWTError, jwt
from datetime import datetime, timedelta
from Models.users import User, UserInDB, UserLogin
from Models.token import Token, TokenData
from auth.authUtils import authenticate_user, create_access_token, get_user, get_password_hash
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from Database.db import connection, create_user as create_userdb, user_exists as user_existsdb, get_user as get_userdb
from utils import getRandAlphaStr, validate_email, validate_username, low_res
import os
import json

router = APIRouter()

@router.post("/token")
async def login_for_access_token(UserLogin: UserLogin):
    try:
        user = authenticate_user(connection, UserLogin.username, UserLogin.password)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    access_token = create_access_token(
        data={
            "username": user.username,
            "email": user.email
        }, 
        SECRET_KEY=SECRET_KEY,
        ALGORITHM=ALGORITHM,
        expires_delta=access_token_expires
    )

    user_info_dict = {
        "username": user.username,
        "email": user.email,
        "disabled": user.disabled,
        "created_on": user.created_on.strftime("%m/%d/%Y, %H:%M:%S")
    }

    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-user-info": json.dumps(user_info_dict)
    }

    # Read the profile pic
    try:
        with open(f"./Images/ProfilePics/{user.profile_pic}", "rb") as f:
            profile_pic = f.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return Response(content=profile_pic, media_type="image/jpeg", headers=headers)

@router.post("/user/me", response_model=str)
async def read_users_me(token: str= Form(...)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        ttype, token = token.split()
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        exp = payload.get("exp")
        
        if exp is None:
            raise credentials_exception
        
        exp = datetime.fromtimestamp(exp)
        if datetime.utcnow() > exp:
            raise credentials_exception
        
        username = payload.get("username")
        email = payload.get("email")

        if username is None:
            raise credentials_exception
        
        if email is None:
            raise credentials_exception
        
        # Check if the user exists
        user = get_userdb(connection, username)
        if user is None:
            raise credentials_exception
        
        if user["Email"] != email:
            raise credentials_exception
        
        return "User authenticated successfully"
        
    except JWTError:
        raise credentials_exception

@router.post("/signup", response_model=str)
async def create_user(file: UploadFile = File(...), username: str = Form(...), email: str = Form(...), password: str = Form(...)):
        
    # Validate the username
    if not validate_username(username):
        raise HTTPException(status_code=400, detail="Invalid username")
    
    # Validate the email
    if not validate_email(email):
        raise HTTPException(status_code=400, detail="Invalid email")
    
    # validate the password
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")
    
    # Check if the username already exists
    try:
        exists = user_existsdb(connection, username)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    if exists:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # download the profile pic
    filename = file.filename
    file_extension = filename.split(".")[-1]
    if file_extension not in ["jpg", "jpeg", "png"]:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    profile_pic = f"{getRandAlphaStr(10)}.{file_extension}"
    with open(f"./Images/ProfilePics/{profile_pic}", "wb") as f:
        try:
            f.write(await file.read())
        except Exception as e:
            # Delete the profile pic if an error occurs
            os.remove(f"./Images/ProfilePics/{profile_pic}")
            raise HTTPException(status_code=400, detail=str(e))
        
    # Low resolution the profile pic to 200x200
    low_res(f"./Images/ProfilePics/{profile_pic}", (200, 200))

    # Create the user
    new_user = UserInDB(username=username, email=email, hashed_password=get_password_hash(password), profile_pic=profile_pic)

    # Insert the user into the database
    try:
        create_userdb(connection, new_user.username, new_user.email, profile_pic, new_user.hashed_password)
    except Exception as e:
        # Delete the profile pic if an error occurs
        os.remove(f"./Images/ProfilePics/{profile_pic}")
        raise HTTPException(status_code=400, detail=str(e))
    
    return "User created successfully"