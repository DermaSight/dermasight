import streamlit as st

from utils.styles import load_css
from utils.data_loader import load_encoded
from utils.charts import (
    donut_chart,
    bar_chart,
    histogram
)

load_css()
 
# LOAD DATA
 

df = load_encoded()

 
# PAGE HEADER
 

st.title("Dataset Overview")

st.markdown("""
Halaman ini menampilkan gambaran umum **Dataset Analisis (dataset_encoded.csv)** yang digunakan pada tahap Exploratory Data Analysis (EDA) dan Feature Engineering.

Visualisasi pada halaman ini belum menggunakan dataset train, validation, maupun test karena fokus utama masih berada pada tahap eksplorasi data dan pemahaman karakteristik dataset.
""")

st.info(
    "Sumber data: dataset_encoded.csv (Dataset Analisis)"
)

 
# SUMMARY
 

st.subheader("Ringkasan Dataset Analisis")

col1, col2, col3, col4 = st.columns(4)

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

col4.metric(
    "Lokasi Anatomi",
    df["anatom_site_general"].nunique()
)

st.divider()

 
# TABS
 

tab1, tab2, tab3 = st.tabs([
    "Distribusi Kelas",
    "Karakteristik Pasien",
    "Lokasi Lesi"
])

 
# TAB 1
 

with tab1:

    st.subheader("Distribusi Kelas Target")

    col1, col2 = st.columns(2)

    with col1:

        st.plotly_chart(
            donut_chart(
                df,
                "target",
                "Distribusi Kelas"
            ),
            use_container_width=True
        )

    with col2:

        class_summary = (
            df["target"]
            .value_counts()
            .reset_index()
        )

        class_summary.columns = [
            "Class",
            "Count"
        ]

        st.dataframe(
            class_summary,
            use_container_width=True,
            hide_index=True
        )

    st.caption(
        "Visualisasi ini menunjukkan proporsi masing-masing kelas pada dataset analisis."
    )

 
# TAB 2
 

with tab2:

    st.subheader("Karakteristik Pasien")

    col1, col2 = st.columns(2)

    with col1:

        st.plotly_chart(
            histogram(
                df,
                "age_approx",
                "Distribusi Usia"
            ),
            use_container_width=True
        )

    with col2:

        st.plotly_chart(
            donut_chart(
                df,
                "sex",
                "Distribusi Gender"
            ),
            use_container_width=True
        )

    st.caption(
        "Analisis usia dan gender membantu memahami karakteristik pasien pada dataset."
    )

 
# TAB 3
 

with tab3:

    st.subheader("Distribusi Lokasi Lesi")

    st.plotly_chart(
        bar_chart(
            df,
            "anatom_site_general",
            "Distribusi Anatomical Site"
        ),
        use_container_width=True
    )

    site_summary = (
        df["anatom_site_general"]
        .value_counts()
        .reset_index()
    )

    site_summary.columns = [
        "Anatomical Site",
        "Count"
    ]

    st.dataframe(
        site_summary,
        use_container_width=True,
        hide_index=True
    )

    st.caption(
        "Distribusi lokasi lesi digunakan untuk memahami area tubuh yang paling sering muncul pada dataset."
    )

st.divider()

st.success(
    "Halaman ini menggunakan dataset_encoded.csv sebagai sumber utama karena berfokus pada analisis dan eksplorasi data sebelum tahap pemodelan."
)