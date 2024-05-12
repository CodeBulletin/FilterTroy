from typing import Optional
from fastapi import APIRouter, HTTPException, status, FastAPI
from fastapi import UploadFile, Form, File, Depends
from fastapi.responses import Response, FileResponse
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from auth.authUtils import auth_token
from Database.db import connection
from Database.filterdb import create_filter as create_filterdb, doesFilterExist, get_filter_by_id as get_filter_by_iddb, get_likecount as get_likecountdb, get_savecount as get_savecountdb, get_forkcount as get_forkcountdb
from Database.filterdb import isLiked as isLikeddb, isSaved as isSaveddb, togglelike_filter as togglelike_filterdb, togglesave_filter as togglesave_filterdb, fork_filter as fork_filterdb, getImages as getImagesdb, does_filter_exist as doesFilterExist
from Database.filterdb import getAllFilterIDs as getAllFilterIDsdb, doesFilterExistAtAll, is_owned_by, edit_filter, isForked as isForkeddb
from utils import generateID, getRandAlphaStr, base64_to_image_png, copy_file_if_exists, load_as_base64
import os

router = APIRouter()

@router.get("/{filter_id}")
def filter_details(filter_id: str):
    conn = connection()
    res = doesFilterExistAtAll(conn, filter_id)
    if not res:
        conn.close()
        raise HTTPException(status_code=404, detail="Filter not found")
    try:
        res = get_filter_by_iddb(conn, filter_id)
        if res.input_image_path != "null":
            res.input_image_path = load_as_base64(f"./Images/InputImages/{res.input_image_path}")
        if res.output_image_path != "null":
            res.output_image_path = load_as_base64(f"./Images/OutputImages/{res.output_image_path}")
        conn.close()
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal server error")
    
    if res is None:
        raise HTTPException(status_code=404, detail="Filter not found")
    
    return res

@router.get("/")
def get_filters():
    try:
        conn = connection()
        res = getAllFilterIDsdb(conn)
        conn.close()
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    
    return res

@router.get("/info/{filter_id}")
def filter_info(filter_id: str, token: Optional[str] = None):
    conn = connection()

    filter_exists = doesFilterExistAtAll(conn, filter_id)
    if not filter_exists:
        conn.close()
        raise HTTPException(status_code=404, detail="Filter not found")


    likes = get_likecountdb(conn, filter_id)
    saves = get_savecountdb(conn, filter_id)
    forks = get_forkcountdb(conn, filter_id)
    isforked, forkname = isForkeddb(conn, filter_id)

    if token is not None:
        try:
            res = auth_token(token, SECRET_KEY, ALGORITHM, conn)
        except Exception as e:
            res = None
    else:
        res = None

    if res == False:
        res = None

    user_name = res["username"] if res is not None else None

    if user_name is None:
        return {
            "likes": likes,
            "saves": saves,
            "forks": forks,
            "is_forked": isforked,
            "forkname": forkname,
            "is_liked": None,
            "is_saved": None
        }
    
    is_liked = isLikeddb(conn, user_name, filter_id)
    is_saved = isSaveddb(conn, user_name, filter_id)

    conn.close()

    return {
        "likes": likes,
        "saves": saves,
        "forks": forks,
        "is_forked": isforked,
        "forkname": forkname,
        "is_liked": is_liked,
        "is_saved": is_saved
    }

@router.patch("/{filter_id}")
def update_filter(filter_id: str, filter_desc: str = Form(...), initial_orientation: int = Form(...), token: str = Form(...), code: str = Form(...), variables: str = Form(...), image_input: Optional[str] = Form(None), image_output: Optional[str] = Form(None)):
    try:
        conn = connection()
        res = auth_token(token, SECRET_KEY, ALGORITHM, conn)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    if not res:
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        response = doesFilterExistAtAll(conn, filter_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

    if not response:
        raise HTTPException(status_code=404, detail="Filter not found")
    
    # Check if filter is owned by user
    try:
        response = is_owned_by(conn, res["username"], filter_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    
    if not response:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    # Delete the old images
    try:
        old_images = getImagesdb(conn, filter_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

    input_image_path = getRandAlphaStr(10) + ".png"
    output_image_path = getRandAlphaStr(10) + ".png"
    
    
    try:
        if image_input is not None:
            base64_to_image_png(image_input, f"./Images/InputImages/{input_image_path}")
        else:
            input_image_path = "null"

        if image_output is not None:
            base64_to_image_png(image_output, f"./Images/OutputImages/{output_image_path}")
        else:
            output_image_path = "null"

    except Exception as e:
        try:
            os.remove(f"./Images/InputImages/{input_image_path}")
            os.remove(f"./Images/OutputImages/{output_image_path}")
        except Exception as e_2:
            print(e_2)
            raise HTTPException(status_code=500, detail="Internal server error")
        raise HTTPException(status_code=500, detail="Internal server error")

    data = {
        "filter_id": filter_id,
        "filter_desc": filter_desc,
        "initial_orientation": initial_orientation,
        "code": code,
        "variables": variables,
        "username": res["username"],
        "image_input": input_image_path,
        "image_output": output_image_path
    }

    try:
        id = edit_filter(data, conn)
        conn.close()
    except Exception as e:
        print(e)
        # Delete the images
        try:
            os.remove(f"./Images/InputImages/{input_image_path}")
            os.remove(f"./Images/OutputImages/{output_image_path}")
        except Exception as e_2:
            print(e_2)
            raise HTTPException(status_code=500, detail="Internal server error")
        raise HTTPException(status_code=500, detail="Internal server error")
    
    if old_images is not None:
        try:
            if old_images[0] != "null":
                if os.path.isfile(f"./Images/InputImages/{old_images[0]}"):
                    os.remove(f"./Images/InputImages/{old_images[0]}")
            if old_images[1] != "null":
                if os.path.isfile(f"./Images/OutputImages/{old_images[1]}"):
                    os.remove(f"./Images/OutputImages/{old_images[1]}")
        except Exception as e:
            print(e)

    return id

@router.post("/")
def create_filter(filter_name: str = Form(...), filter_desc: str = Form(...), initial_orientation: int = Form(...), token: str = Form(...), code: str = Form(...), variables: str = Form(...), image_input: Optional[str] = Form(None), image_output: Optional[str] = Form(None)):
    try:
        conn = connection()
        res = auth_token(token, SECRET_KEY, ALGORITHM, conn)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    if not res:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    input_image_path = getRandAlphaStr(10) + ".png"
    output_image_path = getRandAlphaStr(10) + ".png"

    try:
        response = doesFilterExist(conn, filter_name, res["username"])
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

    if response:
        raise HTTPException(status_code=400, detail="Filter already exists")
    
    
    try:
        if image_input is not None:
            base64_to_image_png(image_input, f"./Images/InputImages/{input_image_path}")
        else:
            input_image_path = "null"

        if image_output is not None:
            base64_to_image_png(image_output, f"./Images/OutputImages/{output_image_path}")
        else:
            output_image_path = "null"

    except Exception as e:
        try:
            os.remove(f"./Images/InputImages/{input_image_path}")
            os.remove(f"./Images/OutputImages/{output_image_path}")
        except Exception as e_2:
            print(e_2)
            raise HTTPException(status_code=500, detail="Internal server error")
        raise HTTPException(status_code=500, detail="Internal server error")

    data = {
        "filter_name": filter_name,
        "filter_desc": filter_desc,
        "initial_orientation": initial_orientation,
        "code": code,
        "variables": variables,
        "username": res["username"],
        "image_input": input_image_path,
        "image_output": output_image_path
    }

    try:
        id = create_filterdb(data, conn)
        conn.close()
    except Exception as e:
        # Delete the images
        try:
            os.remove(f"./Images/InputImages/{input_image_path}")
            os.remove(f"./Images/OutputImages/{output_image_path}")
        except Exception as e_2:
            print(e_2)
            raise HTTPException(status_code=500, detail="Internal server error")
        raise HTTPException(status_code=500, detail="Internal server error")

    return id

@router.post("/like/{filter_id}")
def toggle_like_filter(filter_id: str, token: str = Form(...)):
    try:
        conn = connection()
        res = auth_token(token, SECRET_KEY, ALGORITHM, conn)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    if not res:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    like = togglelike_filterdb(conn, res["username"], filter_id)
    like_count = get_likecountdb(conn, filter_id)
    conn.close()

    return {
        "like": like,
        "like_count": like_count
    }



@router.post("/save/{filter_id}")
def toggle_save_filter(filter_id: str, token: str = Form(...)):
    try:
        conn = connection()
        res = auth_token(token, SECRET_KEY, ALGORITHM, conn)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    if not res:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    save = togglesave_filterdb(conn, res["username"], filter_id)
    save_count = get_savecountdb(conn, filter_id)

    conn.close()

    return {
        "save": save,
        "save_count": save_count
    }

@router.post("/fork/{filter_id}")
def fork_filter(filter_id: str, token: str = Form(...), new_filter_name: str = Form(...)):
    try:
        conn = connection()
        ares = auth_token(token, SECRET_KEY, ALGORITHM, conn)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    if not ares:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    # Check if filter exists
    try:
        fres = doesFilterExist(conn, new_filter_name, ares["username"])
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal server error")
    
    if fres != False:
        print(fres)
        raise HTTPException(status_code=404, detail="Filter with same name already exists")
    
    new_filter_id = generateID(7)
    new_input_image = getRandAlphaStr(10) + ".png"
    new_output_image = getRandAlphaStr(10) + ".png"

    try:
        res = getImagesdb(conn, filter_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    
    if res is None:
        raise HTTPException(status_code=404, detail="Filter not found")
    
    try:
        if res[0] != "null":
            copy_file_if_exists(f"./Images/InputImages/{res[0]}", f"./Images/InputImages/{new_input_image}")
        else:
            new_input_image = "null"
        if res[1] != "null":
            copy_file_if_exists(f"./Images/OutputImages/{res[1]}", f"./Images/OutputImages/{new_output_image}")
        else:
            new_output_image = "null"
    except Exception as e:
        print(e)
        try:
            os.remove(f"./Images/InputImages/{new_input_image}")
            os.remove(f"./Images/OutputImages/{new_output_image}")
        except Exception as e_2:
            print(e_2)
            raise HTTPException(status_code=500, detail="Internal server error")
        raise HTTPException(status_code=500, detail="Internal server error")
    
    try:
        fork_filterdb(conn, ares["username"], filter_id, new_filter_name, new_filter_id, new_input_image, new_output_image)
        conn.close()
    except Exception as e:
        print(e)
        try:
            os.remove(f"./Images/InputImages/{new_input_image}")
            os.remove(f"./Images/OutputImages/{new_output_image}")
        except Exception as e_2:
            print(e_2)
            raise HTTPException(status_code=500, detail="Internal server error")
        raise HTTPException(status_code=500, detail="Internal server error")
    
    return new_filter_id