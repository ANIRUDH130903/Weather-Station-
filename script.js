const ctx = document.getElementById('temperatureChart').getContext('2d');
const temperatureChart = new Chart(ctx, {
    type: 'bar', // Change to 'bar' to display a bar chart instead of line chart
    data: {
        labels: [], // Time labels for X-axis (will be populated dynamically)
        datasets: [
            {
                label: 'Temperature (°C)',
                data: [], // Temperature data (will be populated dynamically)
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)', // Red color bars
                fill: true,
                tension: 0.4
            },
            {
                label: 'Humidity (%)',
                data: [], // Humidity data (will be populated dynamically)
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)', // Blue color bars
                fill: true,
                tension: 0.4
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 14
                    }
                }
            }
        },
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: 'Time (in minutes)',
                    color: '#333'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Value',
                    color: '#333'
                },
                beginAtZero: false,
                grid: {
                    color: '#ddd'  // Light grid color for better visibility
                }
            }
        }
    }
});



// Function to fetch weather data from Flask server
function fetchWeatherData() {
    fetch("http://127.0.0.1:5000/get_data")
        .then(response => response.json())
        .then(data => {
            // Update weather information on the page
            const temperature = data.temperature;
            const humidity = data.humidity;
            const predictedTemp = data.predicted_temp;
            const feelsLike = data.feels_like || "Data not available";
            const dewPoint = data.dew_point || "Data not available";
            const condition = data.condition || "Data not available";
            const alert = data.alert || "Data not available";
            const time = data.time || "Data not available";

            document.getElementById("temperature").innerText = `Temperature: ${temperature} °C`;
            document.getElementById("humidity").innerText = `Humidity: ${humidity} %`;
            document.getElementById("predicted_temp").innerText = `Predicted Temp: ${predictedTemp} °C`;
            document.getElementById("feels_like").innerText = `Feels Like: ${feelsLike} °C`;
            document.getElementById("dew_point").innerText = `Dew Point: ${dewPoint} °C`;
            document.getElementById("condition").innerText = `Condition: ${condition}`;
            document.getElementById("alert").innerText = `Alert: ${alert}`;
            document.getElementById("time").innerText = `Updated at: ${time}`;

            // Get the current time for the X-axis label
            const currentTime = (new Date()).toLocaleTimeString(); // Get current time
            const minutesSinceStart = (new Date() - new Date(data.time)) / 60000; // Get time difference in minutes

            // Add new data to chart
            temperatureChart.data.labels.push(minutesSinceStart); // Time on X-axis (in minutes)
            temperatureChart.data.datasets[0].data.push(temperature); // Temperature data on Y-axis
            temperatureChart.data.datasets[1].data.push(humidity); // Humidity data on Y-axis

            // Update the chart (redraw it)
            temperatureChart.update();

            // Make Text-to-Speech of the predicted temperature
            document.getElementById("speak-button").onclick = function() {
                speak(`The predicted temperature is ${predictedTemp} degrees Celsius.`);
            };
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
        });
}

// Function to convert text to speech
function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";  // Language set to English
    speech.volume = 1;      // Full volume
    speech.rate = 1;        // Normal speed
    speech.pitch = 1;       // Normal pitch
    window.speechSynthesis.speak(speech); // Speak the text
}

// Call fetchWeatherData to get data from the server
fetchWeatherData();

// Optional: Update weather data at regular intervals (e.g., every 60 seconds)
setInterval(fetchWeatherData, 60000); // Update every minute
