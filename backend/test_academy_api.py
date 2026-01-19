from app import create_app
import json

app = create_app()

def test_get_courses():
    with app.test_client() as client:
        response = client.get('/api/academy/courses')
        print(f"Status: {response.status_code}")
        print(json.dumps(response.json, indent=2))

if __name__ == "__main__":
    test_get_courses()
