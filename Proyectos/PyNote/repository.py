import uuid
from datetime import date
from database import get_db
from models import Note
from typing import List
def new_id()-> str :
  return str(uuid.uuid4())

def row_to_note(row) -> Note :
  return Note(
    note_id=row['note_id'],
    title=row['title'],
    date=row['date'],
    body=row['body']
    )
 
def save_note(note: Note) -> str:
  with get_db() as conn:
      conn.execute(
          'INSERT INTO notes (note_id, title, date, body) VALUES (?, ?, ?, ?)',
          (note.note_id, note.title, note.date, note.body)
      )
  return note.note_id 
  
def create_note(title : str, body :str, date_str : str = None) -> Note:
  if date_str is None :
    date_str = str(date.today())  
  
  new_note = Note(
    note_id=new_id(),
    title=title,
    date=date_str,
    body=body
    ) 
  save_note(new_note)
  
  return new_note 

def get_all_notes() -> List[Note] :
  with get_db() as conn:
    rows = conn.execute('SELECT * FROM notes').fetchall()
  return [row_to_note(r) for r in rows]
 
def get_note_by_id(note_id : str) -> Note | None :
  with get_db() as conn:
    row = conn.execute(
      'SELECT * FROM notes WHERE note_id = ?', 
      (note_id,)
      ).fetchone()
  
  if row is None:
    return None
  
  return row_to_note(row)
    
def delete_note(note_id : str) -> bool :
  with get_db() as conn:
    cursor = conn.execute('DELETE FROM notes WHERE note_id = ?', (note_id,))
  return cursor.rowcount > 0

def update_note(note_id : str, title : str = None, body : str = None) -> bool :
  with get_db() as conn:
    if title is not None and body is not None:
      cursor = conn.execute(
        'UPDATE notes SET title = ?, body = ?, date = ? WHERE note_id = ?',
        (title, body, str(date.today()), note_id)
        )
    elif title is not None:
      cursor = conn.execute(
        'UPDATE notes SET title = ?, date = ? WHERE note_id = ?',
        (title, str(date.today()), note_id)
        )
    elif body is not None:
      cursor = conn.execute(
        'UPDATE notes SET body = ?, date = ? WHERE note_id = ?',
        (body, str(date.today()), note_id)
      )
    else:
      return False
  return cursor.rowcount > 0

def search_notes(title : str) -> List[Note] :
  with get_db() as conn:
    rows = conn.execute('SELECT * FROM notes WHERE LOWER(title) LIKE ? OR LOWER(body) LIKE ?', (f'%{title}%',f'%{title}%' )).fetchall()
  return [row_to_note(r) for r in rows]