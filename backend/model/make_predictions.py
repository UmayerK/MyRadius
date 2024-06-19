import pymongo
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split

print("Starting prediction script...")

# Load the trained model
model = joblib.load('model.pkl')
print("Model loaded successfully.")

# Example new data for making predictions
new_data = pd.DataFrame([
    {"price": 150, "quantity": 10, "weight": 55, "urgency": 5},
    {"price": 220, "quantity": 6, "weight": 40, "urgency": 8},
    {"price": 130, "quantity": 11, "weight": 50, "urgency": 5}
])

# Make predictions
predictions = model.predict(new_data)
print("Predictions for new data:", predictions)

# Connect to MongoDB
print("Connecting to MongoDB...")
CONNECTION_STRING = "mongodb+srv://umayer:umayer@cluster0.cs4vu4j.mongodb.net/"
client = pymongo.MongoClient(CONNECTION_STRING)
db = client["NEW_DATABASE_NAME"]
collection = db["RadiusDB"]
print("Connected to MongoDB.")

# Retrieve data from MongoDB
print("Retrieving data from MongoDB...")
data = pd.DataFrame(list(collection.find()))
print("Data retrieved:", data.head())

# Ensure the data has the necessary fields
required_fields = ['price', 'quantity', 'weight', 'urgency', 'outcome']
if not all(field in data.columns for field in required_fields):
    raise ValueError("Missing required fields in the data")

# Selecting relevant features and target
features = ['price', 'quantity', 'weight', 'urgency']
target = 'outcome'

X = data[features]
y = data[target]

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print("Data split into training and testing sets.")

# Make predictions on the test set
test_predictions = model.predict(X_test)
print("Predictions for test data:", test_predictions)
print("Actual outcomes:", y_test.values)

print("Prediction script finished.")
