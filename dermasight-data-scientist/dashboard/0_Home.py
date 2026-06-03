import streamlit as st
import pandas as pd
import plotly.express as px

from pathlib import Path

from utils.styles import load_css
from utils.data_loader import (
    load_encoded,
    load_final
)

st.set_page_config(
    page_title="DermaSight Analytics Dashboard",
    page_icon="🩺",
    layout="wide",
    initial_sidebar_state="expanded"
)

load_css()

 
# LOAD DATA
 

df_encoded = load_encoded()

train_df, val_df, test_df, final_df = load_final()

 
# LOGO PATH (STREAMLIT CLOUD SAFE)
 

BASE_DIR = Path(__file__).resolve().parent
LOGO_PATH = BASE_DIR / "assets" / "LOGO.png"

 
# HEADER
 

header_col1, header_col2 = st.columns([1, 7])

with header_col1:

    if LOGO_PATH.exists():
        st.image(
            str(LOGO_PATH),
            width=120
        )

with header_col2:
    st.markdown("""
    # DermaSight
    ### Dashboard Analisis dan Persiapan Dataset Kanker Kulit
    """)

st.divider()

 
# INTRODUCTION
 

st.markdown("""
## Selamat Datang di Dashboard DermaSight

Dashboard ini dikembangkan untuk menganalisis dataset kanker kulit ISIC 2019 yang telah melalui proses data wrangling, exploratory data analysis (EDA), feature engineering, dan data preparation.

Dashboard dibagi menjadi dua fokus utama:

1. Dataset Analisis (dataset_encoded) untuk eksplorasi dan visualisasi data.
2. Dataset Pemodelan (train, validation, test) yang digunakan pada tahap machine learning.
""")

st.info(
    "Gunakan menu navigasi pada sidebar untuk menjelajahi setiap tahapan analisis dan persiapan data."
)

 
# DATASET ANALISIS
 

st.subheader("Dataset Analisis")

st.caption(
    "Bersumber dari dataset_encoded.csv dan digunakan untuk EDA, visualisasi, serta feature engineering."
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
    round(df_encoded["age_approx"].mean(), 1)
)

st.divider()

 
# DATASET PEMODELAN
 

st.subheader("Dataset Pemodelan")

st.caption(
    "Dataset final yang digunakan pada tahap machine learning setelah proses data preparation."
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

 
# PROJECT SCOPE
 

st.subheader("Tentang Dashboard")

scope_col1, scope_col2 = st.columns(2)

with scope_col1:

    st.markdown("""
    ### Dataset yang Dianalisis

    - Basal Cell Carcinoma (BCC)
    - Melanoma (MEL)
    - Melanocytic Nevi (NV)

    Dataset berasal dari ISIC 2019 dan telah melalui proses filtering sehingga hanya berfokus pada tiga jenis lesi utama.
    """)

with scope_col2:

    st.markdown("""
    ### Cakupan Dashboard

    - Dataset Overview
    - Business Question Analysis
    - Feature Engineering
    - Correlation Analysis
    - Data Preparation
    - Dataset Documentation

    Seluruh analisis dilakukan untuk mendukung proses persiapan data sebelum tahap machine learning.
    """)

st.divider()

 
# VISUALISASI DATASET ANALISIS
 

st.subheader("Gambaran Dataset Analisis")

col1, col2 = st.columns(2)

with col1:

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

with col2:

    gender_dist = (
        df_encoded["sex"]
        .value_counts()
        .reset_index()
    )

    gender_dist.columns = [
        "Gender",
        "Count"
    ]

    fig = px.bar(
        gender_dist,
        x="Gender",
        y="Count",
        text_auto=True,
        title="Distribusi Gender"
    )

    st.plotly_chart(
        fig,
        use_container_width=True
    )

st.divider()

 
# AGE GROUP
 

st.subheader("Distribusi Kelompok Usia")

st.caption(
    "Visualisasi ini berasal dari dataset_encoded.csv karena age_group merupakan hasil feature engineering."
)

age_reference = pd.DataFrame({
    "Kelompok Usia": [
        "Child",
        "Young Adult",
        "Adult",
        "Senior"
    ],
    "Rentang Umur": [
        "< 18 tahun",
        "18 – 39 tahun",
        "40 – 59 tahun",
        "≥ 60 tahun"
    ]
})

st.dataframe(
    age_reference,
    use_container_width=True,
    hide_index=True
)

age_group = (
    df_encoded["age_group"]
    .value_counts()
    .reset_index()
)

age_group.columns = [
    "Age Group",
    "Count"
]

order = [
    "child",
    "young_adult",
    "adult",
    "senior"
]

age_group["Age Group"] = pd.Categorical(
    age_group["Age Group"],
    categories=order,
    ordered=True
)

age_group = age_group.sort_values(
    "Age Group"
)

fig = px.bar(
    age_group,
    x="Age Group",
    y="Count",
    text_auto=True,
    title="Distribusi Kelompok Usia"
)

st.plotly_chart(
    fig,
    use_container_width=True
)

st.success(
    "Dataset final train, validation, dan test telah berhasil dibentuk dan siap digunakan pada tahap pemodelan machine learning."
)