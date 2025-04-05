import joblib
import pandas as pd
import serial
import requests
import re
from datetime import datetime

# Load trained model
model = joblib.load("weather_model.pkl")

# Initialize Serial Port (Ensure it's correct)
ser = serial.Serial('COM9', 9600, timeout=2)

# Function to generate timestamp for updated time
def get_current_time():
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')

# Initialize variables for previous data
prev_temp = None
prev_humidity = None

while True:
    try:
        # Read data from the serial port
        line = ser.readline().decode(errors='ignore').strip()

        # Use regex to filter only valid numeric values (e.g., "23.5,65.0")
        match = re.match(r"^(\d+(\.\d+)?),(\d+(\.\d+)?)$", line)
        if not match:
            print(f"⚠️ Skipping invalid data: {line}")
            continue  # Ignore invalid lines

        temp, hum = float(match.group(1)), float(match.group(3))  # Extract valid numbers

        # Prepare input for ML model
        input_data = pd.DataFrame([[temp, hum]], columns=["Temperature", "Humidity"])

        # Make prediction and round it to 2 decimal places
        prediction = round(model.predict(input_data)[0], 2)

        print(f"🌡️ Predicted Temp: {prediction:.2f}°C")

        # Simulate other weather fields
        feels_like = round(temp - 0.5, 2)
        dew_point = round(temp - (100 - hum) / 5, 2)
        condition = "Clear"  # Static value
        alert = "None"  # Static value

        # Prepare payload with updated timestamp
        payload = {
            "temperature": round(temp, 2),
            "humidity": round(hum, 2),
            "predicted_temp": prediction,
            "feels_like": feels_like,
            "dew_point": dew_point,
            "condition": condition,
            "alert": alert,
            "time": get_current_time()  # Update timestamp on data reception
        }

        # Send data to Flask server
        try:
            response = requests.post("http://127.0.0.1:5000/update_data", json=payload, timeout=5)
            if response.status_code == 200:
                print(f"✅ Data successfully sent to server: {payload}")
            else:
                print(f"❌ Error sending data to server. Status code: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print("❌ Failed to send data:", e)

        # Update previous data
        prev_temp = temp
        prev_humidity = hum

    except ValueError:
        print("⚠️ Invalid numeric data received, skipping...")
    except Exception as e:
        print("❌ Error:", e)
