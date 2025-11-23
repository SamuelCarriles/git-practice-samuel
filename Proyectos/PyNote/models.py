from dataclasses import dataclass
from typing import Dict

@dataclass
class Note:
  id : str
  title : str
  date : str
  body : str
  
  def to_dict(self)-> Dict[str,str]:
    return {
      'id' : self.id,
      'title' : self.title,
      'date' : self.date,
      'body' : self.body
    }