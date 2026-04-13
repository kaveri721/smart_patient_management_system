import pickle
import numpy as np
from sklearn.ensemble import RandomForestRegressor

model = RandomForestRegressor()


def train():

    X = np.array([[5, 10, 1], [10, 15, 2], [15, 20, 3]])
    y = np.array([10, 20, 30])

    model.fit(X, y)

    with open("model.pkl", "wb") as f:
        pickle.dump(model, f)

    print("Model trained and saved as model.pkl ✅")


def predict(queue_len, duration, load):

    with open("model.pkl", "rb") as f:
        model_loaded = pickle.load(f)

    return int(model_loaded.predict([[queue_len, duration, load]])[0])


# THIS PART EXECUTES TRAINING WHEN FILE RUNS
if __name__ == "__main__":
    train()