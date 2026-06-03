import pandas as pd
import streamlit as st
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

ENCODE_PATH = BASE_DIR / "data" / "encode" / "dataset_encoded.csv"
TRAIN_PATH = BASE_DIR / "data" / "final" / "train.csv"
VAL_PATH = BASE_DIR / "data" / "final" / "val.csv"
TEST_PATH = BASE_DIR / "data" / "final" / "test.csv"


@st.cache_data
def load_encoded():

    return pd.read_csv(ENCODE_PATH)


@st.cache_data
def load_final():

    train = pd.read_csv(TRAIN_PATH)
    val = pd.read_csv(VAL_PATH)
    test = pd.read_csv(TEST_PATH)

    train["Subset"] = "Train"
    val["Subset"] = "Validation"
    test["Subset"] = "Test"

    final_df = pd.concat(
        [train, val, test],
        ignore_index=True
    )

    return train, val, test, final_df