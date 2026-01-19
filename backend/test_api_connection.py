import requests

try:
    response = requests.get('http://localhost:5000/api/academy/courses')
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Data received: {len(data)} courses")
        for course in data:
            print(f"- {course.get('title')}")
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Connection failed: {e}")
