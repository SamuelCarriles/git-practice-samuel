from collections import Counter
from typing import Dict

def words_freq(text : str) -> Dict[str,int] :
  words = text.split()
  return dict(Counter(words))

def top_words(text : str, number : int = 3) -> list :
  #Falta hacer la limpieza del texto antes de hallar las freq de cada palabra
  frequencies = words_freq(text.lower())
  return sorted(frequencies.items(), key=lambda x: x[1], reverse=True)[:number]


