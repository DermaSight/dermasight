import streamlit as st
import pandas as pd

from utils.styles import load_css
from utils.data_loader import (
    load_encoded,
    load_final
)

load_css()

 
# LOAD DATA
 

df_encoded = load_encoded()

train_df, val_df, test_df, final_df = load_final()

 
# PAGE HEADER
 

st.title("Dataset Documentation")

st.markdown("""
Halaman ini berisi dokumentasi dataset yang digunakan dalam proyek DermaSight, mulai dari dataset analisis hingga dataset pemodelan.

Dokumentasi ini bertujuan memberikan informasi mengenai struktur data, fitur yang digunakan, hasil feature engineering, serta dataset akhir yang digunakan pada tahap machine learning.
""")

 
# DATASET FLOW
 

st.subheader("Alur Dataset")

st.markdown("""
### Dataset Analisis

**dataset_encoded.csv**

Digunakan untuk:

- Exploratory Data Analysis (EDA)
- Business Question Analysis
- Feature Engineering
- Correlation Analysis

### Dataset Pemodelan

**train.csv**
**val.csv**
**test.csv**

Digunakan untuk:

- Training Model
- Validation Model
- Testing Model
- Evaluasi Performa Model

Alur proyek:

Raw Dataset → Data Cleaning → Preprocessing → Feature Engineering → dataset_encoded.csv → Data Preparation → train.csv / val.csv / test.csv
""")

st.divider()

 
# DATASET ANALYSIS SUMMARY
 

st.subheader("Ringkasan Dataset Analisis")

analysis_info = pd.DataFrame({
    "Metrik": [
        "Jumlah Data",
        "Jumlah Kolom",
        "Lesion Unik",
        "Jumlah Kelas"
    ],
    "Nilai": [
        len(df_encoded),
        len(df_encoded.columns),
        df_encoded["lesion_id"].nunique(),
        df_encoded["target"].nunique()
    ]
})

st.dataframe(
    analysis_info,
    use_container_width=True,
    hide_index=True
)

st.divider()

 
# TARGET CLASS DOCUMENTATION
 

st.subheader("Dokumentasi Target Klasifikasi")

target_df = pd.DataFrame({
    "Kode": [
        "BCC",
        "MEL",
        "NV"
    ],
    "Nama Diagnosis": [
        "Basal Cell Carcinoma",
        "Melanoma",
        "Melanocytic Nevi"
    ],
    "Keterangan": [
        "Kanker kulit non-melanoma",
        "Jenis kanker kulit paling agresif",
        "Lesi jinak yang umum ditemukan"
    ]
})

st.dataframe(
    target_df,
    use_container_width=True,
    hide_index=True
)

st.divider()

 
# DATA DICTIONARY
 

st.subheader("Data Dictionary")

dictionary = pd.DataFrame({
    "Kolom": [
        "lesion_id",
        "age_approx",
        "sex",
        "anatom_site_general",
        "target",
        "age_group",
        "risk_category",
        "site_risk_score",
        "sex_encoded",
        "site_encoded",
        "target_encoded",
        "age_group_encoded",
        "risk_encoded"
    ],
    "Deskripsi": [
        "Identitas unik lesi",
        "Perkiraan usia pasien",
        "Jenis kelamin pasien",
        "Lokasi anatomi lesi",
        "Label diagnosis",
        "Kelompok usia hasil feature engineering",
        "Kategori risiko lokasi lesi",
        "Skor numerik tingkat risiko lokasi lesi",
        "Encoding jenis kelamin",
        "Encoding lokasi anatomi",
        "Encoding target diagnosis",
        "Encoding kelompok usia",
        "Encoding kategori risiko"
    ]
})

st.dataframe(
    dictionary,
    use_container_width=True,
    hide_index=True
)

st.divider()

 
# FEATURE ENGINEERING DOCUMENTATION
 

st.subheader("Dokumentasi Feature Engineering")

st.markdown("""
### Age Group

Fitur kategorikal yang dibentuk dari variabel usia pasien (`age_approx`) untuk memudahkan analisis distribusi usia.

| Kelompok | Rentang Usia |
|-----------|-------------|
| Child | < 18 tahun |
| Young Adult | 18 – 39 tahun |
| Adult | 40 – 59 tahun |
| Senior | ≥ 60 tahun |

### Risk Category

Fitur kategorikal yang digunakan untuk mengelompokkan lokasi anatomi berdasarkan tingkat risiko relatif.

### Site Risk Score

Representasi numerik dari tingkat risiko lokasi anatomi lesi yang digunakan untuk memperkaya analisis karakteristik dataset.
""")

st.divider()

 
# MODELING DATASET SUMMARY
 

st.subheader("Ringkasan Dataset Pemodelan")

modeling_summary = pd.DataFrame({
    "Dataset": [
        "Train",
        "Validation",
        "Test"
    ],
    "Jumlah Data": [
        len(train_df),
        len(val_df),
        len(test_df)
    ]
})

st.dataframe(
    modeling_summary,
    use_container_width=True,
    hide_index=True
)

st.divider()

 
# MODELING READINESS
 

st.subheader("Status Dataset")

st.success("""
Dataset telah melalui seluruh tahapan:

✓ Data Cleaning

✓ Preprocessing

✓ Feature Engineering

✓ Data Preparation

✓ Train Validation Test Split

Dataset siap digunakan untuk proses pemodelan machine learning.
""")

st.divider()

 
# DOWNLOAD SECTION
 

st.subheader("Download Dataset")

col1, col2, col3, col4 = st.columns(4)

with col1:

    st.download_button(
        label="Download Encoded Dataset",
        data=df_encoded.to_csv(index=False),
        file_name="dataset_encoded.csv",
        mime="text/csv"
    )

with col2:

    st.download_button(
        label="Download Train Dataset",
        data=train_df.to_csv(index=False),
        file_name="train.csv",
        mime="text/csv"
    )

with col3:

    st.download_button(
        label="Download Validation Dataset",
        data=val_df.to_csv(index=False),
        file_name="val.csv",
        mime="text/csv"
    )

with col4:

    st.download_button(
        label="Download Test Dataset",
        data=test_df.to_csv(index=False),
        file_name="test.csv",
        mime="text/csv"
    )