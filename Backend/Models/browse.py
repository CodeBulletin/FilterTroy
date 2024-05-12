from pydantic import BaseModel
from typing import Optional

class BrowseFilter (BaseModel):
    id: Optional[str] = ""
    nameLike: Optional[str] = ""
    byUser: Optional[str] = ""
    forkedFrom: Optional[str] = ""
    sortBy: Optional[str] = ""
    sortOrder: Optional[str] = ""