import json
from pathlib import Path
from typing import List, Dict, Any

NOTES_FILE = Path("notes.json")

def save(notes : list[Dict[str, str]]) :
  with NOTES_FILE.open("w",encoding="utf-8") as file:
    json.dump(notes, file, ensure_ascii=False, indent=2)
  print("Notes saved!")


def load() -> list[Dict[str,str]] :
  if not NOTES_FILE.exists():
    return []
  
  try:
    with NOTES_FILE.open("r",encoding="utf-8") as file:
      return json.load(file)
  except json.JSONDecodeError:
    print("Error! Corrupt file!")
    return []
  except Exception as e:
    print(f"Unknown error: {e}")
    return []

def export_note(note : Dict[str, str], folder : str = ".") -> bool:
    date_str = note["date"]
    title_words = note["title"].split()[:3]
    safe_words = [w.replace("/", "-").replace("\\", "-") for w in title_words]
    filename = f"{date_str}_{'_'.join(safe_words)}.md"
    filepath = Path(folder) / filename

    try:
      with open(filepath, "w", encoding="utf-8") as f:
        f.write(
          f"# {note['title']}\n\n"
          f"*{note['date']}*\n\n"
          f"{note['body']}"
        )
      return True
    except Exception:
      return False
    