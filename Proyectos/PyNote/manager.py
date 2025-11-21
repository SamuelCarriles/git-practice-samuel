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

def update_note(id : str, title = None, body = None) -> bool :
  for n in notes:
    if n["id"] == id:
      
      if title is not None:
        n["title"] = title
        
      if body is not None:
        n["body"] = body
        
      n["date"] = str(date.today())
      return True
  return False

def search_notes(title : str) -> list :
  if not title :
    return []
  title = title.lower().strip()
  return [n for n in notes if title in n["title"].lower()]