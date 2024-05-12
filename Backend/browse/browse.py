from typing import Optional
from fastapi import APIRouter, HTTPException, status, FastAPI, Form
from Database.db import connection
from Database.browsedb import getFilters as getFiltersDB, getSavedFilters, getMyFilters, getTop4Liked
from Models.browse import BrowseFilter
from auth.auth import auth_token
from config import SECRET_KEY, ALGORITHM

router = APIRouter()

@router.post("/")
async def browse(filters: BrowseFilter):
    try: 
        conn = connection()
        filters = getFiltersDB(conn.cursor(), filters)
        conn.close()
        return [filter[0] for filter in filters]
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/my")
async def my(token: str = Form(...)):
    try:
        conn = connection()
        res = auth_token(token, SECRET_KEY, ALGORITHM, conn)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try: 
        filters = getMyFilters(conn.cursor(), res["username"])
        conn.close()
        return [filter[0] for filter in filters]
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/saved")
async def saved(token: str = Form(...)):
    try:
        conn = connection()
        res = auth_token(token, SECRET_KEY, ALGORITHM, conn)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try: 
        filters = getSavedFilters(conn.cursor(), res["username"])
        conn.close()
        return [filter[0] for filter in filters]
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/top")
async def top():
    try: 
        conn = connection()
        filters = getTop4Liked(conn.cursor())
        conn.close()
        return [filter[0] for filter in filters]
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))