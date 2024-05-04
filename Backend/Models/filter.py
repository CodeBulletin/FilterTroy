from pydantic import BaseModel
from typing import Optional

class FilterFromDB(BaseModel):
    filter_id: int
    filter_name: str
    filter_desc: str
    created_on: str
    user_name: str
    filter_vars: str
    filter_code: str
    intial_orientation: Optional[int] = None
    input_image_path: Optional[str] = None
    output_image_path: Optional[str] = None

class ClonedFrom(BaseModel):
    filter_id: int
    cloned_filter_id: int

class Filter(BaseModel):
    filter_id: int
    filter_name: str
    filter_desc: str
    initial_orientation: Optional[int] = None
    input_image_path: Optional[str] = None
    output_image_path: Optional[str] = None

class FilterCode(BaseModel):
    filter_id: int
    filter_code: str
    filter_vars: str

class UserFilter(BaseModel):
    filter_id: int
    user_name: str
    created_on: str

class UserLikedFilter(BaseModel):
    filter_id: int
    user_name: str
    liked_on: str

class UserSavedFilter(BaseModel):
    filter_id: int
    user_name: str
    saved_on: str