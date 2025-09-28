from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# Define the request body model
class Message(BaseModel):
    text: str

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/")
async def echo(msg: Message):
    return {"you_said": msg.text}
