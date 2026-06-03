import streamlit as st
import pandas as pd
import plotly.express as px

from utils.styles import load_css
from utils.data_loader import load_final

load_css()

 
# LOAD DATA
 

train_df, val_df, test_df, final_df = load_final()

 
# PAGE HEADER
 

st.title("Data Preparation")

st.markdown("""
Halaman ini menjelaskan proses Data Preparation yang dilakukan sebelum tahap pemodelan machine learning.

Analisis pada halaman ini menggunakan **dataset final** yang terdiri dari:

- train.csv
- val.csv
- test.csv

Ketiga dataset tersebut merupakan hasil pemisahan data setelah proses preprocessing dan feature engineering selesai dilakukan.
""")

st.info(
    "Sumber data: train.csv, val.csv, dan test.csv (Dataset Pemodelan)"
)

 
# DATASET SUMMARY
 

st.subheader("Ringkasan Dataset Pemodelan")

col1, col2, col3, col4 = st.columns(4)

col1.metric(
    "Train",
    f"{len(train_df):,}"
)

col2.metric(
    "Validation",
    f"{len(val_df):,}"
)

col3.metric(
    "Test",
    f"{len(test_df):,}"
)

col4.metric(
    "Total Data",
    f"{len(final_df):,}"
)

st.divider()

 
# SPLIT DISTRIBUTION
 

st.subheader("Distribusi Train, Validation, dan Test")

split_df = pd.DataFrame({
    "Subset": [
        "Train",
        "Validation",
        "Test"
    ],
    "Records": [
        len(train_df),
        len(val_df),
        len(test_df)
    ]
})

col1, col2 = st.columns([2, 1])

with col1:

    fig = px.bar(
        split_df,
        x="Subset",
        y="Records",
        text="Records",
        title="Jumlah Data pada Setiap Subset"
    )

    st.plotly_chart(
        fig,
        use_container_width=True
    )

with col2:

    pie_fig = px.pie(
        split_df,
        names="Subset",
        values="Records",
        hole=0.5,
        title="Proporsi Dataset"
    )

    st.plotly_chart(
        pie_fig,
        use_container_width=True
    )

st.dataframe(
    split_df,
    use_container_width=True,
    hide_index=True
)

st.divider()

 
# CLASS BALANCE
 

st.subheader("Validasi Distribusi Kelas")

st.markdown("""
Distribusi kelas diperiksa untuk memastikan bahwa setiap subset masih merepresentasikan karakteristik dataset secara konsisten setelah proses splitting.
""")

if "class_name" in final_df.columns:

    balance_df = (
        final_df["class_name"]
        .value_counts()
        .reset_index()
    )

    balance_df.columns = [
        "Class",
        "Count"
    ]

else:

    balance_df = (
        final_df["target"]
        .value_counts()
        .reset_index()
    )

    balance_df.columns = [
        "Class",
        "Count"
    ]

fig = px.bar(
    balance_df,
    x="Class",
    y="Count",
    text="Count",
    title="Distribusi Kelas Dataset Pemodelan"
)

st.plotly_chart(
    fig,
    use_container_width=True
)

st.dataframe(
    balance_df,
    use_container_width=True,
    hide_index=True
)

st.divider()

 
# SUBSET CLASS DISTRIBUTION
 

st.subheader("Distribusi Kelas per Subset")

target_col = (
    "class_name"
    if "class_name" in train_df.columns
    else "target"
)

train_dist = (
    train_df[target_col]
    .value_counts()
    .reset_index()
)

train_dist.columns = ["Class", "Count"]
train_dist["Subset"] = "Train"

val_dist = (
    val_df[target_col]
    .value_counts()
    .reset_index()
)

val_dist.columns = ["Class", "Count"]
val_dist["Subset"] = "Validation"

test_dist = (
    test_df[target_col]
    .value_counts()
    .reset_index()
)

test_dist.columns = ["Class", "Count"]
test_dist["Subset"] = "Test"

dist_df = pd.concat(
    [train_dist, val_dist, test_dist],
    ignore_index=True
)

fig = px.bar(
    dist_df,
    x="Class",
    y="Count",
    color="Subset",
    barmode="group",
    title="Perbandingan Distribusi Kelas Antar Subset"
)

st.plotly_chart(
    fig,
    use_container_width=True
)

st.divider()

 
# LEAKAGE VALIDATION
 

st.subheader("Validasi Data Leakage")

st.markdown("""
Pemeriksaan dilakukan untuk memastikan bahwa tidak terdapat lesion_id yang muncul pada lebih dari satu subset.

Hal ini penting untuk menghindari data leakage yang dapat menyebabkan hasil evaluasi model menjadi bias.
""")

train_lesion = set(train_df["lesion_id"])
val_lesion = set(val_df["lesion_id"])
test_lesion = set(test_df["lesion_id"])

tv_overlap = len(
    train_lesion.intersection(val_lesion)
)

tt_overlap = len(
    train_lesion.intersection(test_lesion)
)

vt_overlap = len(
    val_lesion.intersection(test_lesion)
)

leakage_df = pd.DataFrame({
    "Perbandingan": [
        "Train vs Validation",
        "Train vs Test",
        "Validation vs Test"
    ],
    "Jumlah Overlap": [
        tv_overlap,
        tt_overlap,
        vt_overlap
    ]
})

st.dataframe(
    leakage_df,
    use_container_width=True,
    hide_index=True
)

if (
    tv_overlap == 0 and
    tt_overlap == 0 and
    vt_overlap == 0
):
    st.success(
        "Tidak ditemukan data leakage antar subset. Dataset siap digunakan untuk proses pemodelan."
    )
else:
    st.error(
        "Terdapat indikasi data leakage antar subset. Perlu dilakukan pemeriksaan lebih lanjut."
    )

st.divider()

 
# MODELING READINESS
 

st.subheader("Kesiapan Dataset Pemodelan")

st.success("""
Dataset train, validation, dan test telah berhasil dibentuk.

✓ Data telah melalui preprocessing

✓ Feature engineering telah selesai dilakukan

✓ Data leakage telah divalidasi

✓ Dataset telah dipisahkan untuk proses training dan evaluasi model

Dataset siap digunakan pada tahap pemodelan machine learning.
""")