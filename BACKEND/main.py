from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from markitdown import MarkItDown
import os

app = FastAPI()

# Интернетте жұмыс істеуі үшін барлық жерден рұқсат береміз
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

md = MarkItDown()

@app.post("/convert")
async def convert_file(file: UploadFile = File(...)):
    # Уақытша файлды сақтау
    file_path = f"temp_{file.filename}"
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    
    try:
        # Маркдаунға айналдыру
        result = md.convert(file_path)
        return {"markdown": result.text_content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Файлды өшіру
        if os.path.exists(file_path):
            os.remove(file_path)

@app.get("/")
async def root():
    return {"message": "Backend is running!"}
