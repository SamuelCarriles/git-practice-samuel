import sqlite3
from contextlib import contextmanager
from config import env

DB_PATH = env['db_path']

@contextmanager
def get_db():
  conn = sqlite3.connect(DB_PATH)
  conn.row_factory = sqlite3.Row # Para que devuelva los resultados se puedan manejar como dicts
  try:
    yield conn
    conn.commit()
  except Exception:
    conn.rollback()
    raise 
  finally:
    conn.close()

def init_db():
  conn = sqlite3.connect(DB_PATH)
  
  conn.execute('''
    CREATE TABLE IF NOT EXISTS notes(
      note_id TEXT PRIMARY KEY  NOT NULL,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      body TEXT
      )''')
  
  conn.commit()
  conn.close()

    