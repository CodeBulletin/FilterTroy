from fastapi import FastAPI, Form, HTTPException
from Database.db import create_db
from fastapi.middleware.cors import CORSMiddleware
from evaluate_filter import evaluate_filter
from auth.auth import router as auth_router
from filter.filter import router as filter_router
from browse.browse import router as browse_router
from comment.comment import router as comment_router
import os
import cv2
import base64
import json
import numpy as np
from config import ORIGINS, EXPOSE_HEADERS
from utils import base64_to_image_png

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=EXPOSE_HEADERS
)

create_db()

# Create the following Folders if they don't exist already /Images/InputImages, /Images/OutputImages, /Images/ProfilePics, /Images/Temps
folders = ["./Images/InputImages", "./Images/OutputImages", "./Images/ProfilePics", "./Images/Temps"]
for folder in folders:
    if not os.path.exists(folder):
        os.makedirs(folder)

print("Folders created / already exist")

app.include_router(auth_router, prefix="/auth")
app.include_router(filter_router, prefix="/filter")
app.include_router(browse_router, prefix="/browse")
app.include_router(comment_router, prefix="/comment")

@app.post("/apply")
async def apply_filter(code: str = Form(...), vars: str = Form(...), image: str = Form()):

    print(vars)

    img = base64_to_image_png(image)

    # Conver PIL image to cv2 image
    img = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
 
    # convert the vars to a dict
    variables = json.loads(vars)

    # Evaluate the filter
    evaluated, err = evaluate_filter(code, img, variables)

    if err:
        raise HTTPException(status_code=400, detail=err)

    # Convert the image back to Base64
    _, img_encoded = cv2.imencode(".jpg", evaluated)

    img_base64 = base64.b64encode(img_encoded).decode()
    
    return "data:image/jpeg;base64," + img_base64
