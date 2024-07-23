import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
from model import WorkAcceptanceModel, fetch_data_and_convert_to_tensor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler


# Initialize the model and optimizer
model = WorkAcceptanceModel().to(settings["device"])
optimizer = torch.optim.Adam(model.parameters(), lr=settings["learning_rate"])
loss_fn = torch.nn.CrossEntropyLoss()

# Train the model
average_loss = 0
for i in range(settings["epochs"]):

    # Evaluate loss every 100 steps
    if i % 100 == 0:
        print(f"Epoch {i}: loss={average_loss}")
        average_loss = 0

    # Get a batch of data
    src, tgt = fetch_data_and_convert_to_tensor(train_data)

    # Train model based on loss
    logits = model(src)
    loss = loss_fn(logits, tgt)
    average_loss += loss.item()

    # Backpropagate
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

# Evaluate the model on validation batches (x100)
# average_loss = 0
# for i in range(100):
#     src, tgt = get_batch(test_data)
#     logits = model(src)
#     loss = loss_fn(logits, tgt)
#     print(loss.item())
#     average_loss += loss.item()
# print(f"Validation loss: {average_loss / 100}")

# Save the model
torch.save(model.state_dict(), "./model.pt")