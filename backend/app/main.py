from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.database.database import Base
from app.database.database import engine
from app.database.database import SessionLocal
from app.database.models import Analysis
from app.genetics.inheritance import predict_inheritance



# ----------------------------------------------------
# Create database automatically on startup
# ----------------------------------------------------

Base.metadata.create_all(bind=engine)


# ----------------------------------------------------
# Models
# ----------------------------------------------------

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


# ----------------------------------------------------
# FastAPI App
# ----------------------------------------------------

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------------------------------------------
# Routes
# ----------------------------------------------------

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

    result = predict_inheritance(
        family.model_dump()
    )

    db = SessionLocal()

    analysis = Analysis(
        family_id=family.family_id,
        prediction=result["prediction"],
        confidence=result["confidence"],
        reason=result["reason"],
        ai_explanation=result.get("ai_explanation", "")
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    db.close()

    return result