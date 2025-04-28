from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    company: str
    sector: str
    subfields: List[str]
    website: str = ""       # 👈 EKLENDİ
    description: str = ""   # 👈 EKLENDİ
    is_admin: bool = False  # ✅ BURAYI EKLE



class UserLogin(BaseModel):
    email: EmailStr
    password: str

class FavoritesUpdate(BaseModel):
    favorites: List[str]

class User(BaseModel):
        email: EmailStr
        password: str
        company: str
        sector: str
        subfields: List[str]
        website: str = ""  # 👈 EKLENDİ
        description: str = ""  # 👈 EKLENDİ
        is_admin: bool = False  # ✅ BURAYI EKLE
