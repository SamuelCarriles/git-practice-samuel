from dataclasses import dataclass
from typing import Dict

@dataclass
class Note:
  note_id : str
  title : str
  date : str
  body : str
  
  def to_dict(self)-> Dict[str,str]:
    return {
      'note_id' : self.note_id,
      'title' : self.title,
      'date' : self.date,
      'body' : self.body
    }