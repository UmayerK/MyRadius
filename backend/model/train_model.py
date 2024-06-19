from pymongo import MongoClient
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Connection details
connection_string = "mongodb+srv://umayer:umayer@cluster0.cs4vu4j.mongodb.net/"
database_name = "NEW_DATABASE_NAME"
collection_name = "RadiusDB"

# Connect to MongoDB
client = MongoClient(connection_string)
db = client[database_name]
collection = db[collection_name]

# Fetch data
data = pd.DataFrame(list(collection.find()))

# Print column names for debugging
print("Column Names:", data.columns)

# Drop the MongoDB ID column
data = data.drop(['_id'], axis=1)

# Handle missing values using forward fill
data = data.ffill()

# Print first few rows for debugging
print("Data Preview:\n", data.head())

# Verify the target column exists
target_column = 'urgency'  # Replace with your actual target column name
if target_column not in data.columns:
    raise ValueError(f"Target column '{target_column}' does not exist in the data")

# Encode categorical variables (e.g., 'name' if needed)
label_encoders = {}
for column in data.select_dtypes(include=['object']).columns:
    label_encoders[column] = LabelEncoder()
    data[column] = label_encoders[column].fit_transform(data[column])

# Separate features and target
X = data.drop(target_column, axis=1)
y = data[target_column]

# Scale numerical features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Initialize and train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred)

print("Accuracy:", accuracy)
print("Classification Report:\n", report)

# Save the model
joblib.dump(model, 'model.pkl')
joblib.dump(scaler, 'scaler.pkl')
for column, encoder in label_encoders.items():
    joblib.dump(encoder, f'label_encoder_{column}.pkl')
