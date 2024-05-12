from fastapi import APIRouter, HTTPException, status, FastAPI, Form
from Database.db import connection
from Database.commentdb import getComment, addComment
from auth.auth import auth_token
from config import SECRET_KEY, ALGORITHM

router = APIRouter()

@router.post("/{filter_id}")
async def getComment(filter_id: str, token: str = Form(...), comment: str = Form(...)):
    try:
        conn = connection()
        res = auth_token(token, SECRET_KEY, ALGORITHM, conn)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try: 
        addComment(conn.cursor(), comment)
        conn.close()
        return "Comment added"
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/single/{filter_id}/{comment_id}")
async def getComment(filter_id: str, comment_id: int):
    try: 
        conn = connection()
        comments = getComment(conn.cursor())
        conn.close()
        return [comment[0] for comment in comments]
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/all/{filter_id}")
async def getComment(filter_id: str):
    pass