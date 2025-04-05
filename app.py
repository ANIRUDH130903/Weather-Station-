from flask import Flask, render_template, request, jsonify
from datetime import datetime

app = Flask(__name__)

# Store latest weather data
data = {
    "time": None,
    "temperature": 29.3,
    "humidity": 37.0,
    "feels_like": 29.0,
    "dew_point": 29.0,
    "condition": "Clear",
    "alert": "None",
    "pred_1hr": None,
    "pred_24hr": None,
    "predicted_temp": 29.3
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/update_data', methods=['POST'])
def update_data():
    global data
    new_data = request.get_json()
    
    # Update the data dictionary with new data
    data.update(new_data)

    # Set the current time for when data is updated
    data["time"] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    return jsonify({"status": "success"})

@app.route('/get_data', methods=['GET'])
def get_data():
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
