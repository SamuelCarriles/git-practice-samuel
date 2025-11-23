from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
from repository import (
	create_note,
	get_all_notes,
 get_note_by_id,
 update_note,
 delete_note,
 search_notes,
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

class NoteUpdate(BaseModel):
  title : Optional[str] = None
  body : Optional[str] = None
  
  
# Endpoints

# Crear una nota
@app.post('/notes', response_model=NoteResponse,status_code=201)
def create_note_endpoint(payload : NoteCreate):
  return create_note(
        title=payload.title,
        body=payload.body,
        date_str=payload.date
    )

