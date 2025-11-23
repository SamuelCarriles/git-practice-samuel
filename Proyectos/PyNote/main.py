from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from repository import (
	create_note,
	save_note,
	
)
app = FastAPI(
	title = 'PyNote API',
	description='API REST completa desarrollada con FastAPI + SQLite.',
	version='0.1.0',
	contact={"name": "Samuel"},
	license_info={"name": "MIT"},
)

# Modelos de Pydantic

class NoteCreate(BaseModel):
	title : str
	body : str
	date : Optional[str] = None

class NoteResponse(NoteCreate):
    note_id : str
    date : str

# Endpoints

@app.post('/notes/', response_model=NoteResponse,status_code=201)
def create(payload : NoteCreate):
  return create_note(
        title=payload.title,
        body=payload.body,
        date_str=payload.date
    )