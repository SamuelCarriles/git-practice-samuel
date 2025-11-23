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

# Obtener todas las notas
@app.get('/notes', response_model=List[NoteResponse])
def list_notes_endpoint():
  return get_all_notes()

# Obtener nota específica por id
@app.get('/notes/{note_id}',response_model=NoteResponse)
def get_note_endpoint(note_id : str):
  note = get_note_by_id(note_id)
  
  if not note:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail='Note not found'
    )
  return note

@app.put('/notes/{note_id}',response_model=NoteResponse)
def update_note_endpoint(note_id : str, payload : NoteUpdate):
  success = update_note(note_id, payload.title, payload.body)
  
  if not success:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail='Note not found'
    )
  return get_note_by_id(note_id)

@app.delete('/notes/{note_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_note_endpoint(note_id : str):
  success = delete_note(note_id)
  
  if not success:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail='Note not found'
    )
  return None

@app.get('/search',response_model=List[NoteResponse])
def search_endpoint(q : str):
  if not q.strip():
    return []
  return search_notes(q)