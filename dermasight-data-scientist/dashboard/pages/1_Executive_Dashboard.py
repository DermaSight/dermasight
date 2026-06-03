import streamlit as st
import pandas as pd
import plotly.express as px

from utils.styles import load_css

from utils.data_loader import (
    load_encoded,
    load_final
)

load_css()
# LOAD DATA

df_encoded = load_encoded()

train_df, val_df, test_df, final_df = load_final()

# PAGE TITLE

st.title("Executive Dashboard")

st.markdown("""
Halaman ini memberikan ringkasan tingkat tinggi mengenai dataset analisis dan dataset pemodelan yang digunakan dalam proyek DermaSight.
""")

# DATASET ANALISIS

st.subheader("Ringkasan Dataset Analisis")

st.caption(
    "Dataset analisis berasal dari dataset_encoded.csv dan digunakan untuk EDA, visualisasi, serta feature engineering."
)

analysis_col1, analysis_col2, analysis_col3, analysis_col4 = st.columns(4)

analysis_col1.metric(
    "Total Data",
    f"{len(df_encoded):,}"
)

analysis_col2.metric(
    "Lesion Unik",
    f"{df_encoded['lesion_id'].nunique():,}"
)

analysis_col3.metric(
    "Jumlah Kelas",
    df_encoded["target"].nunique()
)

analysis_col4.metric(
    "Rata-rata Usia",
    round(
        df_encoded["age_approx"].mean(),
        1
    )
)

st.divider()

 
# DATASET PEMODELAN
 

st.subheader("Ringkasan Dataset Pemodelan")

st.caption(
    "Dataset pemodelan merupakan hasil data preparation yang digunakan pada tahap machine learning."
)

model_col1, model_col2, model_col3, model_col4 = st.columns(4)

model_col1.metric(
    "Train",
    f"{len(train_df):,}"
)

model_col2.metric(
    "Validation",
    f"{len(val_df):,}"
)

model_col3.metric(
    "Test",
    f"{len(test_df):,}"
)

model_col4.metric(
    "Total Modeling Data",
    f"{len(final_df):,}"
)

st.divider()

 
# DATASET FLOW
 

st.subheader("Alur Dataset")

flow_df = pd.DataFrame({
    "Tahap": [
        "Dataset Encoded",
        "Train Dataset",
        "Validation Dataset",
        "Test Dataset"
    ],
    "Jumlah Data": [
        len(df_encoded),
        len(train_df),
        len(val_df),
        len(test_df)
    ]
})

fig = px.bar(
    flow_df,
    x="Tahap",
    y="Jumlah Data",
    text="Jumlah Data",
    title="Perbandingan Dataset Analisis dan Dataset Pemodelan"
)

st.plotly_chart(
    fig,
    use_container_width=True
)

st.divider()

 
# DISTRIBUSI KELAS
 

st.subheader("Distribusi Kelas Dataset Analisis")

class_dist = (
    df_encoded["target"]
    .value_counts()
    .reset_index()
)

class_dist.columns = [
    "Class",
    "Count"
]

fig = px.pie(
    class_dist,
    names="Class",
    values="Count",
    hole=0.55,
    title="Distribusi Kelas"
)

st.plotly_chart(
    fig,
    use_container_width=True
)

st.divider()

 
# MODELING DATASET SUMMARY
 

st.subheader("Ringkasan Dataset Pemodelan")

summary_df = pd.DataFrame({
    "Dataset": [
        "Train",
        "Validation",
        "Test"
    ],
    "Rows": [
        len(train_df),
        len(val_df),
        len(test_df)
    ]
})

st.dataframe(
    summary_df,
    use_container_width=True,
    hide_index=True
)

st.success(
    "Dataset train, validation, dan test telah dipisahkan melalui proses data preparation dan siap digunakan untuk tahap machine learning."
)