from app import create_app
from flask import json

app = create_app()

with app.test_client() as client:
    response = client.get('/api/challenge/challenge?email=wiame')
    print(f"Status: {response.status_code}")
    print(f"Data: {json.dumps(response.get_json(), indent=2)}")
