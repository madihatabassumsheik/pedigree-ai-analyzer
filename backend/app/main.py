from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.genetics.inheritance import predict_inheritance


# --------------------------
# Models
# --------------------------

class FamilyMember(BaseModel):
    id: str
    name: str
    gender: str
    affected: bool
    generation: int


class Relationship(BaseModel):
    source: str
    target: str
    relationshipType: str


class FamilyData(BaseModel):
    family_id: str
    members: list[FamilyMember]
    relationships: list[Relationship]


# --------------------------
# App
# --------------------------

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
    return {
        "message": "Pedigree AI Backend Running"
    }


@app.post("/predict")
def predict(family: FamilyData):

    print("\n===== PEDIGREE RECEIVED =====")

    print(family.model_dump())

    print("=============================\n")

    return predict_inheritance(
        family.model_dump()
    )