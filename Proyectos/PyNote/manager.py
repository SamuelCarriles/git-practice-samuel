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

def new_id()-> uuid.UUID :
  return uuid.uuid4()

def create_note(title : str, body :str, date_str : str = None) :
  if date_str == None :
    date_str = str(date.today())
  notes.append(
    {"id" : new_id(),
     "title" : title,
     "date" : date_str,
     "body" : body})
