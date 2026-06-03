import streamlit as st
import pandas as pd
import plotly.express as px

from utils.styles import load_css
from utils.data_loader import load_encoded

load_css()

 
# LOAD DATA
 

df = load_encoded()

 
# PAGE HEADER
 

st.title("Correlation & Relationship Analysis")

st.markdown("""
Halaman ini digunakan untuk menganalisis hubungan antar fitur hasil preprocessing dan feature engineering.

Seluruh analisis pada halaman ini menggunakan **dataset_encoded.csv** karena fokus utama masih berada pada tahap eksplorasi data, analisis hubungan fitur, dan evaluasi hasil feature engineering sebelum proses pemodelan machine learning.
""")

st.info(
    "Sumber data: dataset_encoded.csv (Dataset Analisis)"
)

 
# CORRELATION ANALYSIS
 

st.subheader("Analisis Korelasi Antar Fitur")

st.markdown("""
Heatmap korelasi digunakan untuk melihat hubungan linear antar fitur numerik hasil preprocessing dan feature engineering.

Analisis ini membantu mengidentifikasi fitur yang memiliki hubungan kuat terhadap target maupun antar fitur lainnya.
""")

numeric_cols = [
    "age_approx",
    "age_group_encoded",
    "risk_encoded",
    "target_encoded",
    "site_risk_score"
]

available_cols = [
    col for col in numeric_cols
    if col in df.columns
]

corr_df = df[available_cols].corr()

fig = px.imshow(
    corr_df,
    text_auto=".2f",
    aspect="auto",
    color_continuous_scale="RdBu_r",
    title="Heatmap Korelasi Fitur"
)

st.plotly_chart(
    fig,
    use_container_width=True
)

st.divider()

 
# AGE GROUP VS TARGET
 

st.subheader("Hubungan Age Group terhadap Diagnosis")

st.markdown("""
Visualisasi berikut menunjukkan distribusi diagnosis pada setiap kelompok usia hasil feature engineering.

Tujuannya adalah melihat apakah terdapat kecenderungan jenis diagnosis tertentu pada kelompok usia tertentu.
""")

if "age_group" in df.columns:

    fig = px.histogram(
        df,
        x="age_group",
        color="target",
        barmode="group",
        title="Distribusi Diagnosis Berdasarkan Age Group"
    )

    st.plotly_chart(
        fig,
        use_container_width=True
    )

st.divider()

 
# RISK CATEGORY VS TARGET
 

st.subheader("Hubungan Risk Category terhadap Diagnosis")

st.markdown("""
Fitur Risk Category dibentuk pada tahap feature engineering untuk mengelompokkan lokasi lesi berdasarkan tingkat risiko relatif.

Analisis ini bertujuan melihat distribusi diagnosis pada setiap kategori risiko.
""")

if "risk_category" in df.columns:

    risk_target = pd.crosstab(
        df["risk_category"],
        df["target"]
    )

    st.dataframe(
        risk_target,
        use_container_width=True
    )

    fig = px.histogram(
        df,
        x="risk_category",
        color="target",
        barmode="group",
        title="Distribusi Diagnosis Berdasarkan Risk Category"
    )

    st.plotly_chart(
        fig,
        use_container_width=True
    )

st.divider()

 
# GENDER VS TARGET
 

st.subheader("Hubungan Gender terhadap Diagnosis")

st.markdown("""
Analisis ini digunakan untuk melihat distribusi diagnosis berdasarkan jenis kelamin pasien.

Informasi ini dapat membantu memahami karakteristik demografis pada masing-masing kelas diagnosis.
""")

if "sex" in df.columns:

    gender_target = pd.crosstab(
        df["sex"],
        df["target"]
    )

    st.dataframe(
        gender_target,
        use_container_width=True
    )

    fig = px.histogram(
        df,
        x="sex",
        color="target",
        barmode="group",
        title="Distribusi Diagnosis Berdasarkan Gender"
    )

    st.plotly_chart(
        fig,
        use_container_width=True
    )

st.divider()

 
# ANATOMICAL SITE VS TARGET
 

st.subheader("Hubungan Lokasi Anatomi terhadap Diagnosis")

st.markdown("""
Lokasi anatomi merupakan salah satu metadata penting pada dataset kanker kulit.

Analisis ini digunakan untuk melihat distribusi diagnosis pada berbagai lokasi lesi yang terdapat pada dataset.
""")

if "anatom_site_general" in df.columns:

    site_target = pd.crosstab(
        df["anatom_site_general"],
        df["target"]
    )

    st.dataframe(
        site_target,
        use_container_width=True
    )

    fig = px.histogram(
        df,
        x="anatom_site_general",
        color="target",
        barmode="group",
        title="Distribusi Diagnosis Berdasarkan Lokasi Anatomi"
    )

    fig.update_layout(
        xaxis_title="Lokasi Anatomi",
        yaxis_title="Jumlah Data"
    )

    st.plotly_chart(
        fig,
        use_container_width=True
    )

st.divider()

st.success(
    "Analisis hubungan fitur menunjukkan bagaimana metadata pasien dan fitur hasil feature engineering berinteraksi dengan diagnosis pada dataset sebelum tahap pemodelan machine learning."
)