from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import Text

from .database import Base


class Analysis(Base):

    __tablename__ = "analysis"

    id = Column(Integer, primary_key=True, index=True)

    family_id = Column(String)

    prediction = Column(String)

    confidence = Column(Float)

    reason = Column(Text)

    ai_explanation = Column(Text)