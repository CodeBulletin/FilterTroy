from fastapi import FastAPI, HTTPException, status, File, UploadFile, Form
from fastapi.responses import FileResponse
from db import connect, create_user, get_user, create_db, user_exists, show_db, connection
from fastapi.middleware.cors import CORSMiddleware
import cv2
from ee import evaluate_filter
import json
from auth import router as auth_router
import os

app = FastAPI()

# origins = [
#     "http://localhost:5173",
# ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-User-Info", "Authorization"]
)

create_db(connection)
show_db(connection)

# Create the following Folders if they don't exist already /Images/InputImages, /Images/OutputImages, /Images/ProfilePics, /Images/Temps
folders = ["./Images/InputImages", "./Images/OutputImages", "./Images/ProfilePics", "./Images/Temps"]
for folder in folders:
    if not os.path.exists(folder):
        os.makedirs(folder)

print("Folders created / already exist")

app.include_router(auth_router, prefix="/auth")


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

    print(evaluated, vars)


    # print(evaluated)
    # Save the image
    cv2.imwrite("data.jpg", evaluated)

    return FileResponse("data.jpg", media_type="image/jpeg")
