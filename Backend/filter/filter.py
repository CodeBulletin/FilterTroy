from fastapi import APIRouter, HTTPException, status
from fastapi import UploadFile, Form, File, Depends
from fastapi.responses import Response

router = APIRouter()

@router.get("/{filter_id}")
def apply_filter(filter_id: int):
    pass

@router.patch("/{filter_id}")
def update_filter(filter_id: int):
    pass

@router.post("/")
def create_filter():
    pass

@router.post("/clone/{filter_id}")
def clone_filter(filter_id: int):
    pass