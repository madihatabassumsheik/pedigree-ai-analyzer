from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {
        "message": "Pedigree AI Backend Running"
    }