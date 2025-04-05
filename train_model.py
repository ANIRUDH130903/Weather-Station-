import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import joblib

# Load data
df = pd.read_csv("weather_data.csv")

# Feature and target selection
X = df[["Temperature", "Humidity"]]
y = df["Temperature"].shift(-1).fillna(df["Temperature"].mean())  # Predict next temperature

# Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Model
model = LinearRegression()
model.fit(X_train, y_train)

# Save model
joblib.dump(model, "weather_model.pkl")
