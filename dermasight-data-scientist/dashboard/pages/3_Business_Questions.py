import streamlit as st
import pandas as pd
import plotly.express as px

from utils.styles import load_css
from utils.data_loader import load_encoded

load_css()
 
# LOAD DATA
 

df = load_encoded()

 
# PAGE HEADER
 

st.title("Business Question Analysis")

st.markdown("""

Seluruh analisis pada halaman ini menggunakan **dataset_encoded.csv** karena fokus utama masih berada pada tahap eksplorasi data dan feature engineering sebelum proses pemodelan machine learning.
""")

st.info(
    "Sumber data: dataset_encoded.csv (Dataset Analisis)"
)

 
# SELECT QUESTION
 

question = st.selectbox(
    "Pilih Pertanyaan Bisnis",
    [
        "1. Karakteristik Penyakit Berdasarkan Metadata Pasien",
        "2. Analisis Ketidakseimbangan Kelas",
        "3. Kualitas dan Karakteristik Dataset",
        "4. Dampak Feature Engineering"
    ]
)

 
# BUSINESS QUESTION 1
 

if question == "1. Karakteristik Penyakit Berdasarkan Metadata Pasien":

    st.subheader("Pertanyaan Bisnis")

    st.markdown("""
    **Bagaimana karakteristik distribusi Melanoma (MEL), Melanocytic Nevi (NV), dan Basal Cell Carcinoma (BCC) berdasarkan metadata pasien seperti usia, jenis kelamin, dan lokasi anatomi lesi?**
    """)

    st.divider()

    st.subheader("Distribusi Jenis Kelamin terhadap Diagnosis")

    gender_target = pd.crosstab(
        df["sex"],
        df["target"]
    )

    col1, col2 = st.columns([1, 2])

    with col1:

        st.dataframe(
            gender_target,
            use_container_width=True
        )

    with col2:

        fig = px.histogram(
            df,
            x="target",
            color="sex",
            barmode="group",
            title="Distribusi Diagnosis Berdasarkan Gender"
        )

        st.plotly_chart(
            fig,
            use_container_width=True
        )

    st.divider()

    st.subheader("Distribusi Usia terhadap Diagnosis")

    fig = px.box(
        df,
        x="target",
        y="age_approx",
        color="target",
        title="Distribusi Usia pada Setiap Diagnosis"
    )

    st.plotly_chart(
        fig,
        use_container_width=True
    )

    st.divider()

    st.subheader("Distribusi Lokasi Anatomi terhadap Diagnosis")

    fig = px.histogram(
        df,
        x="anatom_site_general",
        color="target",
        title="Distribusi Diagnosis Berdasarkan Lokasi Anatomi"
    )

    st.plotly_chart(
        fig,
        use_container_width=True
    )

 
# BUSINESS QUESTION 2
 

elif question == "2. Analisis Ketidakseimbangan Kelas":

    st.subheader("Pertanyaan Bisnis")

    st.markdown("""
    **Apakah terdapat ketidakseimbangan distribusi kelas (class imbalance) pada dataset Melanoma (MEL), Melanocytic Nevi (NV), dan Basal Cell Carcinoma (BCC) yang dapat mempengaruhi performa model klasifikasi AI?**
    """)

    st.divider()

    counts = (
        df["target"]
        .value_counts()
        .reset_index()
    )

    counts.columns = [
        "Class",
        "Count"
    ]

    fig = px.bar(
        counts,
        x="Class",
        y="Count",
        text_auto=True,
        title="Distribusi Kelas Dataset Analisis"
    )

    st.plotly_chart(
        fig,
        use_container_width=True
    )

    st.dataframe(
        counts,
        use_container_width=True,
        hide_index=True
    )

    st.info(
        "Analisis ini dilakukan pada dataset_encoded.csv sebelum proses balancing pada tahap Data Preparation."
    )

 
# BUSINESS QUESTION 3
 

elif question == "3. Kualitas dan Karakteristik Dataset":

    st.subheader("Pertanyaan Bisnis")

    st.markdown("""
    **Bagaimana kualitas dan karakteristik dataset Melanoma (MEL), Melanocytic Nevi (NV), dan Basal Cell Carcinoma (BCC) yang akan digunakan untuk pengembangan model klasifikasi kanker kulit berbasis AI?**
    """)

    st.divider()

    col1, col2, col3 = st.columns(3)

    col1.metric(
        "Total Data",
        f"{len(df):,}"
    )

    col2.metric(
        "Lesion Unik",
        f"{df['lesion_id'].nunique():,}"
    )

    col3.metric(
        "Jumlah Kelas",
        df["target"].nunique()
    )

    st.divider()

    missing = (
        df.isnull()
        .sum()
        .reset_index()
    )

    missing.columns = [
        "Kolom",
        "Missing Value"
    ]

    st.subheader("Missing Value Summary")

    st.dataframe(
        missing,
        use_container_width=True,
        hide_index=True
    )

    st.divider()

    st.subheader("Distribusi Lokasi Anatomi")

    fig = px.bar(
        df["anatom_site_general"]
        .value_counts()
        .reset_index(),
        x="anatom_site_general",
        y="count",
        text_auto=True
    )

    st.plotly_chart(
        fig,
        use_container_width=True
    )

 
# BUSINESS QUESTION 4
 

else:

    st.subheader("Pertanyaan Bisnis")

    st.markdown("""
    **Bagaimana proses preprocessing dan feature engineering membantu meningkatkan kualitas dataset serta mendukung analisis karakteristik Melanoma (MEL), Melanocytic Nevi (NV), dan Basal Cell Carcinoma (BCC)?**
    """)

    st.divider()

    col1, col2 = st.columns(2)

    with col1:

        risk_dist = (
            df["risk_category"]
            .value_counts()
            .reset_index()
        )

        risk_dist.columns = [
            "Risk Category",
            "Count"
        ]

        fig = px.pie(
            risk_dist,
            names="Risk Category",
            values="Count",
            hole=0.55,
            title="Distribusi Risk Category"
        )

        st.plotly_chart(
            fig,
            use_container_width=True
        )

    with col2:

        age_group = (
            df["age_group"]
            .value_counts()
            .reset_index()
        )

        age_group.columns = [
            "Age Group",
            "Count"
        ]

        fig = px.bar(
            age_group,
            x="Age Group",
            y="Count",
            text_auto=True,
            title="Distribusi Age Group"
        )

        st.plotly_chart(
            fig,
            use_container_width=True
        )

    st.divider()

    st.subheader("Site Risk Score")

    fig = px.box(
        df,
        x="target",
        y="site_risk_score",
        color="target",
        title="Site Risk Score berdasarkan Diagnosis"
    )

    st.plotly_chart(
        fig,
        use_container_width=True
    )

    st.success(
        "Feature engineering menghasilkan fitur age_group, risk_category, dan site_risk_score yang digunakan untuk memperkaya analisis karakteristik dataset."
    )