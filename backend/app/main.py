from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.genetics.inheritance import predict_inheritance

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Pedigree AI Backend Running"}

@app.post("/predict")
def predict(family: dict):
    return predict_inheritance(family)