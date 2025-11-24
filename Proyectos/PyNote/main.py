from fastapi import FastAPI, HTTPException, Depends, Header, status
from pydantic import BaseModel
from typing import Optional, List
from config import env
from repository import (
	create_note,
	get_all_notes,
 get_note_by_id,
 update_note,
 delete_note,
 search_notes,
)

API_KEY = env['api_key']

app = FastAPI(
	title = 'PyNote API',
	description='API REST completa desarrollada con FastAPI + SQLite.',
	version='0.1.0',
	contact={"name": "Samuel"},
	license_info={"name": "MIT"},
)

def verify_api_key(key : str = Header(...)) -> bool:
  if key != API_KEY:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail='API KEY required'
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
@app.post('/notes', response_model=NoteResponse,status_code=201, dependencies=[Depends(verify_api_key)])
def create(payload : NoteCreate):
  return create_note(
        title=payload.title,
        body=payload.body,
        date_str=payload.date
    )

# Obtener todas las notas
@app.get('/notes', response_model=List[NoteResponse], dependencies=[Depends(verify_api_key)])
def list_all():
  return get_all_notes()

# Obtener nota específica por id
@app.get('/notes/{note_id}',response_model=NoteResponse, dependencies=[Depends(verify_api_key)])
def get_note(note_id : str):
  note = get_note_by_id(note_id)
  
  if not note:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail='Note not found'
    )
  return note

@app.put('/notes/{note_id}',response_model=NoteResponse, dependencies=[Depends(verify_api_key)])
def update(note_id : str, payload : NoteUpdate):
  success = update_note(note_id, payload.title, payload.body)
  
  if not success:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail='Note not found'
    )
  return get_note_by_id(note_id)

@app.delete('/notes/{note_id}', status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(verify_api_key)])
def delete(note_id : str):
  success = delete_note(note_id)
  
  if not success:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail='Note not found'
    )
  return None

@app.get('/search',response_model=List[NoteResponse], dependencies=[Depends(verify_api_key)])
def search(q : str):
  if not q.strip():
    return []
  return search_notes(q)

from database import init_db
init_db()

import uvicorn
import os

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080)) 
    uvicorn.run("main:app", host="0.0.0.0", port=port)