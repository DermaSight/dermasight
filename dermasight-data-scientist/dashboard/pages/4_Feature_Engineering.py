import streamlit as st
import pandas as pd
import plotly.express as px

from utils.styles import load_css
from utils.data_loader import load_encoded
from utils.charts import (
    donut_chart,
    box_plot
)

load_css()

 
# LOAD DATA
 

df = load_encoded()

 
# PAGE HEADER
 

st.title("Feature Engineering")

st.markdown("""

Seluruh analisis menggunakan **dataset_encoded.csv** karena fitur-fitur berikut merupakan hasil transformasi data yang dilakukan sebelum proses Data Preparation dan pembentukan dataset pemodelan.
""")

st.info(
    "Sumber data: dataset_encoded.csv (Dataset Analisis)"
)

tab1, tab2, tab3 = st.tabs([
    "Age Group",
    "Risk Category",
    "Site Risk Score"
])

 
# AGE GROUP
 

with tab1:

    st.subheader("Age Group")

    st.markdown("""
    **Tujuan Feature Engineering**

    Fitur **Age Group** dibentuk dari variabel usia (`age_approx`) untuk menyederhanakan analisis distribusi pasien berdasarkan kelompok umur serta memudahkan identifikasi pola pada setiap rentang usia.
    """)

    age_reference = pd.DataFrame({
        "Age Group": [
            "Child",
            "Young Adult",
            "Adult",
            "Senior"
        ],
        "Rentang Usia": [
            "< 18 tahun",
            "18 - 39 tahun",
            "40 - 59 tahun",
            "≥ 60 tahun"
        ]
    })

    st.subheader("Definisi Kelompok Usia")

    st.dataframe(
        age_reference,
        use_container_width=True,
        hide_index=True
    )

    st.divider()

    st.subheader("Distribusi Age Group")

    st.plotly_chart(
        donut_chart(
            df,
            "age_group",
            "Distribusi Age Group"
        ),
        use_container_width=True
    )

    summary = (
        df["age_group"]
        .value_counts()
        .reset_index()
    )

    summary.columns = [
        "Age Group",
        "Count"
    ]

    st.dataframe(
        summary,
        use_container_width=True,
        hide_index=True
    )

 
# RISK CATEGORY
 

with tab2:

    st.subheader("Risk Category")

    st.markdown("""
    **Tujuan Feature Engineering**

    Fitur **Risk Category** dibuat untuk mengelompokkan lokasi lesi ke dalam kategori risiko yang lebih mudah dianalisis.

    Pengelompokan ini membantu proses eksplorasi data dan identifikasi area tubuh yang memiliki tingkat risiko relatif lebih tinggi.
    """)

    risk_reference = pd.DataFrame({
        "Risk Category": [
            "High Risk",
            "Low Risk"
        ],
        "Deskripsi": [
            "Lokasi dengan tingkat risiko relatif lebih tinggi",
            "Lokasi dengan tingkat risiko relatif lebih rendah"
        ]
    })

    st.subheader("Definisi Risk Category")

    st.dataframe(
        risk_reference,
        use_container_width=True,
        hide_index=True
    )

    st.divider()

    st.subheader("Distribusi Risk Category")

    st.plotly_chart(
        donut_chart(
            df,
            "risk_category",
            "Distribusi Risk Category"
        ),
        use_container_width=True
    )

    st.subheader("Risk Category vs Diagnosis")

    risk_table = pd.crosstab(
        df["risk_category"],
        df["target"]
    )

    st.dataframe(
        risk_table,
        use_container_width=True
    )

 
# SITE RISK SCORE
 

with tab3:

    st.subheader("Site Risk Score")

    st.markdown("""
    **Tujuan Feature Engineering**

    Fitur **Site Risk Score** merupakan representasi numerik dari tingkat risiko lokasi anatomi lesi.

    Semakin tinggi skor, semakin tinggi tingkat risiko relatif lokasi tersebut berdasarkan pendekatan yang digunakan dalam proyek ini.
    """)

    score_reference = pd.DataFrame({
        "Anatomical Site": [
            "palms/soles",
            "oral/genital",
            "head/neck",
            "anterior torso",
            "posterior torso",
            "lateral torso",
            "unknown",
            "upper extremity",
            "lower extremity"
        ],
        "Risk Score": [
            0.90,
            0.85,
            0.80,
            0.70,
            0.70,
            0.60,
            0.60,
            0.50,
            0.50
        ]
    })

    st.subheader("Mapping Site Risk Score")

    st.dataframe(
        score_reference,
        use_container_width=True,
        hide_index=True
    )

    st.divider()

    st.subheader("Distribusi Site Risk Score")

    fig = px.histogram(
        df,
        x="site_risk_score",
        color="target",
        title="Distribusi Site Risk Score"
    )

    st.plotly_chart(
        fig,
        use_container_width=True
    )

    st.subheader("Site Risk Score berdasarkan Diagnosis")

    st.plotly_chart(
        box_plot(
            df,
            "target",
            "site_risk_score",
            "Site Risk Score by Disease Type"
        ),
        use_container_width=True
    )

    st.subheader("Ringkasan Statistik")

    score_summary = (
        df.groupby("target")["site_risk_score"]
        .agg([
            "mean",
            "median",
            "min",
            "max"
        ])
        .round(3)
    )

    st.dataframe(
        score_summary,
        use_container_width=True
    )

st.divider()

st.success(
    "Feature engineering menghasilkan fitur age_group, risk_category, dan site_risk_score yang digunakan untuk memperkaya analisis karakteristik dataset sebelum tahap Data Preparation."
)