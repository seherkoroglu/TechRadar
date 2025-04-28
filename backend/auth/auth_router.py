from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from jose import jwt, JWTError
from passlib.hash import bcrypt
from fastapi.security import OAuth2PasswordBearer
from database.mongo import users_collection
from typing import List  # bu mutlaka en üstte olmalı


SECRET_KEY = "secret123"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
router = APIRouter()

# MODELLER
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    company: str
    sector: str
    subfields: List[str]
    website: str = ""       # 👈 EKLENDİ
    description: str = ""   # 👈 EKLENDİ
    is_admin: bool = False

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# YARDIMCI FONK
def hash_password(password: str):
    return bcrypt.hash(password)

def verify_password(plain_password, hashed):
    return bcrypt.verify(plain_password, hashed)

def create_access_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Token geçersiz")

        user = users_collection.find_one({"email": email}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=404, detail="Kullanıcı yok")

        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Token hatalı")


# ENDPOINTLER
@router.post("/register")
def register(user: UserCreate):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Kullanıcı zaten var")

    user_dict = user.dict()
    user_dict["password_hash"] = hash_password(user.password)
    del user_dict["password"]  # 🔥 password alanını SIL!
    user_dict["is_admin"] = user.email == "admin@techradar.com"

    users_collection.insert_one(user_dict)
    return {"msg": "Kayıt başarılı"}


@router.post("/login")
def login(user: UserLogin):
    db_user = users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password_hash"]):
        raise HTTPException(status_code=401, detail="Giriş hatalı")

    token = create_access_token({"sub": user.email})

    # Kullanıcı bilgilerini döndür
    user_data = {
        "email": db_user["email"],
        "company": db_user.get("company", ""),
        "sector": db_user.get("sector", ""),
        "subfields": db_user.get("subfields", []),
    "is_admin": db_user.get("is_admin", False)

    }

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user_data  # 👈 bu eksikti!
    }


@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return current_user
