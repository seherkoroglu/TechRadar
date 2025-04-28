from passlib.context import CryptContext
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException
from dotenv import load_dotenv
from database.mongo import users_collection
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
print("📛 AUTH_UTILS YÜKLENDİ")

# .env dosyasını yükle
load_dotenv()

# Şifreleme
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
security = HTTPBearer()
# JWT ayarları
SECRET_KEY = os.getenv("SECRET_KEY", "fallback-key")
ALGORITHM = "HS256"

# Şifre hash fonksiyonları
def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)



def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        print("🧠 get_current_user() ÇAĞRILDI:", email)

        user = users_collection.find_one({"email": email}, {"_id": 0})
        print("📦 Mongo’dan gelen kullanıcı:", user)

        if not user:
            raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")

        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Geçersiz token")


