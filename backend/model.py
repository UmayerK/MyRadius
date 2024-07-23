import torch
from pymongo import MongoClient
import torch.nn as nn
import torch.nn.functional as Fpip 


#Settings for the model that include batch size how much and how fast it learns 
settings = {
    "batch_size": 32,                                          # How many cases are ran in parallel
    "device": 'cuda' if torch.cuda.is_available() else 'cpu',  # Device used
    "epochs": 1000,                                           # Number of training epochs
    "learning_rate": 0.001,                                   # Learning rate
}
#Taking the data and putting it into an array since the model takes in an array
def fetch_data_and_convert_to_tensor():
    # MongoDB connection parameters
    client = MongoClient('mongodb+srv://umayer:umayer@cluster0.cs4vu4j.mongodb.net/')
    db = client['NEW_DATABASE_NAME']
    collection = db['Actual_collection']

    documents = collection.find().limit(32)
    output = []
    

    # Fetch data from MongoDB
    data = []
    for doc in documents:
        data_point = [
            doc['price'],
            doc['quantity'],
            doc['weight'],
            doc['urgency'],
            doc['pallet_fullness'],
        ]
        data.append(data_point)
        output.append(doc['verdict'])

        
    data_tensor = torch.tensor(data, dtype=torch.float32).to(settings['device'])
    output = torch.tensor(output, dtype=torch.float32).to(settings['device'])
    return data_tensor , output

# Model hyperparameters


# {
#   "_id": {
#     "$oid": "66771f06c7856f1c8f3965f2"
#   },
#   "name": "Order 1",
#   "price": 100,
#   "quantity": 10,
#   "weight": 50,
#   "urgency": 5,
#   "pallet_fullness": 50,
#   "verdict": 0
# }

def preprocess(batches):
    """Scale ordinal input features and invert binary features to make 0 'good' and 1 'bad' """
    for batch in batches:
        batch[0] = batch[0] / 300
        batch[1] = batch[1] / 20
        batch[2] = batch[2] / 70
        batch[3] = batch[3] / 10
        batch[4] = batch[4] / 100
    return batches

    


class WorkAcceptanceModel(nn.Module):
    def __init__(self):
        """Model definition"""
        super(model, self).__init__() #### Error here 
        self.fc1 = nn.Linear(5, 16)            # Input layer
        self.batchnorm1 = nn.BatchNorm1d(16)    # Batch normalization layer
        self.dropout1 = nn.Dropout(0.2)         # Dropout layer to prevent overfitting
        self.fc2 = nn.Linear(16, 32)           # Hidden layer
        self.batchnorm2 = nn.BatchNorm1d(32)   # Batch normalization layer
        self.dropout2 = nn.Dropout(0.2)         # Dropout layer to mitigate overfitting
        self.fc3 = nn.Linear(32, 3)            # Output layer
        self.Softmax = nn.Softmax()             # Sigmoid activation function

    def forward(self, x):
        """Forward pass"""
        x = F.relu(self.fc1(x))
        x = self.dropout1(x)
        x = self.batchnorm1(x)
        x = F.relu(self.fc2(x))
        x = self.dropout2(x)
        x = self.batchnorm2(x)
        x = self.fc3(x)
        x = self.Softmax(x)
        return x.squeeze() # Return a vector of length batch size
    
      