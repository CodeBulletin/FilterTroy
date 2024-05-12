from fastapi import APIRouter, HTTPException, status, FastAPI, Form
from Database.db import connection
from Database.commentdb import getComments, addComment, addReply, getReplies
from auth.auth import auth_token
from config import SECRET_KEY, ALGORITHM
from utils import load_as_base64

router = APIRouter()

@router.post("/{filter_id}")
async def postComment(filter_id: str, token: str = Form(...), comment: str = Form(...)):
    try:
        conn = connection()
        res = auth_token(token, SECRET_KEY, ALGORITHM, conn)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    username = res["username"]
    
    try: 
        addComment(conn, comment, filter_id, username)
        conn.close()
        return "Comment added"
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/reply/{comment_id}")
async def postReply(comment_id: int, token: str = Form(...), reply: str = Form(...)):
    try:
        conn = connection()
        res = auth_token(token, SECRET_KEY, ALGORITHM, conn)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    username = res["username"]
    
    try: 
        addReply(conn, reply, comment_id, username)
        conn.close()
        return "Reply added"
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/all/{filter_id}")
async def getComment(filter_id: str):
    try:
        conn = connection()
        comments = getComments(conn.cursor(dictionary=True), filter_id)
        conn.close()
        for comment in comments:
            Path = "./Images/ProfilePics/" + comment["ProfilePicPath"]
            comment["ProfilePicPath"] = load_as_base64(Path)
            comment["CreatedOn"] = comment["CreatedOn"].strftime("%Y-%m-%d %H:%M:%S")
        return comments
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/reply/all/{comment_id}")
async def getReply(comment_id: int):
    try:
        conn = connection()
        replies = getReplies(conn.cursor(dictionary=True), comment_id)
        conn.close()
        for reply in replies:
            Path = "./Images/ProfilePics/" + reply["ProfilePicPath"]
            reply["ProfilePicPath"] = load_as_base64(Path)
            reply["CreatedOn"] = reply["CreatedOn"].strftime("%Y-%m-%d %H:%M:%S")
        return replies
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))