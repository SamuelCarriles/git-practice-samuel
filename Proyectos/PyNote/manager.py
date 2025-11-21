'''
Notes structure:

{"id" : "current id",
"title" : "title example",
"date" : "last modified date",
"body" : "full text"}
'''
import uuid
from datetime import date

notes : list = []

def new_id()-> str :
  return str(uuid.uuid4())

def create_note(title : str, body :str, date_str : str = None) :
  if date_str is None :
    date_str = str(date.today())
  notes.append(
    {"id" : new_id(),
     "title" : title,
     "date" : date_str,
     "body" : body})

def get_all_notes() -> list:
  return notes
    
def get_note_by_title(title : str) -> list :
  return list(filter(lambda n: n["title"] == title, notes))

def delete_note(id : str) -> bool :
  for n in notes:
    if n["id"] == id:
      notes.remove(n)
      return True
  return False
  