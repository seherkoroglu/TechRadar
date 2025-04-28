from fastapi import APIRouter, HTTPException, Depends
from database.mongo import users_collection
from auth.auth_utils import get_current_user  # ✅ mevcut kullanıcıyı alma fonksiyonun varsa
from pydantic import BaseModel

admin_router = APIRouter()

@admin_router.get("/admin/users")
def get_users():
    users = list(users_collection.find({}, {"_id": 0}))
    return {"users": users}

@admin_router.delete("/admin/delete-user/{email}")
def delete_user(email: str):
    result = users_collection.delete_one({"email": email})
    if result.deleted_count == 1:
        return {"msg": "Kullanıcı silindi"}
    else:
        return {"msg": "Kullanıcı bulunamadı"}

@admin_router.put("/admin/update-user/{email}")
def update_user(email: str, update_data: dict):
    result = users_collection.update_one(
        {"email": email},
        {"$set": update_data}
    )
    if result.modified_count == 1:
        return {"msg": "Kullanıcı güncellendi"}
    else:
        return {"msg": "Kullanıcı güncellenemedi"}
