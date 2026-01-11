from pydantic import BaseModel

class PredictionOutput(BaseModel):
    prediction: str
    explanation_technical: str
    explanation_sentiment: str
