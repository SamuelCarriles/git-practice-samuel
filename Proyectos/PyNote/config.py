from dotenv import load_dotenv
import os

load_dotenv()

env = {
        'api_key': os.getenv('API_KEY'),
        'db_path': os.getenv('DB_PATH')
}