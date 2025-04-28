from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import users, resumes, interviews, evaluations
from app.core.config import settings

app = FastAPI(title="Interview Assistant API")


# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600, 
)

# 라우터 등록
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(resumes.router, prefix="/api/resumes", tags=["resumes"])
app.include_router(interviews.router, prefix="/api/interviews", tags=["interviews"])
app.include_router(evaluations.router, prefix="/api/evaluations", tags=["evaluations"])

@app.get("/")
async def root():
    return {"message": "Welcome to Interview Assistant API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

