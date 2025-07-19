from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv
from flask_cors import CORS  # Optional if frontend runs separately

# Load .env file securely
basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# Load API key
HARDCODED_API_KEY = "ec4ca8d9c5ecbfc95a7df74942ce1b68"  # Dev fallback
API_KEY = os.getenv("API_KEY") or HARDCODED_API_KEY
print(f"🔑 Loaded API_KEY: {'***' + API_KEY[-4:] if API_KEY else 'None'}")

BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

@app.route("/weather", methods=["GET"])
def get_weather():
    print("📡 Received request for /weather")
    city = request.args.get("city")
    if not city:
        return jsonify({"error": "City name is required"}), 400

    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }

    try:
        response = requests.get(BASE_URL, params=params)
        if response.status_code != 200:
            print(f"⚠️ Weather API Error: {response.status_code} → {response.text}")
            return jsonify({
                "error": response.json().get("message", "City not found")
            }), response.status_code

        data = response.json()
        print(f"✅ Weather data for {city} loaded successfully")
        return jsonify({
            "location": data.get("name"),
            "temperature": data["main"]["temp"],
            "humidity": data["main"]["humidity"],
            "conditions": data["weather"][0]["description"].capitalize()
        })
    except Exception as e:
        print(f"🔥 Internal backend error: {str(e)}")
        return jsonify({"error": "Internal server error while fetching weather data."}), 500

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)

