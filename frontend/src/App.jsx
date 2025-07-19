import { useState } from "react";
import axios from "axios";
import "./index.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a valid city name.");
      setWeather(null);
      return;
    }

    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const res = await axios.get(`${apiUrl}/weather?city=${city}`);
      if (res.data.error) {
        setError(res.data.error);
        setWeather(null);
      } else {
        setWeather(res.data);
        setError("");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      setWeather(null);
      console.error("Error fetching weather:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🌦️ Weather App</h1>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeather} disabled={loading}>
          {loading ? "Loading..." : "Get Weather"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="card">
          <h2>{weather.location}</h2>
          <p>🌡️ Temperature: {weather.temperature}°C</p>
          <p>💧 Humidity: {weather.humidity}%</p>
          <p>☁️ Conditions: {weather.conditions}</p>
        </div>
      )}
    </div>
  );
}

export default App;

