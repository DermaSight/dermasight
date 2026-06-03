# 🩺 DermaSight: Skin Cancer Analytics & Machine Learning Preparation

DermaSight merupakan proyek Data Science yang berfokus pada analisis karakteristik lesi kulit, feature engineering, serta persiapan dataset untuk pengembangan model klasifikasi kanker kulit berbasis Artificial Intelligence (AI).

Proyek ini menggunakan dataset **ISIC 2019** dan menghasilkan dashboard interaktif berbasis Streamlit untuk mendukung proses eksplorasi data, dokumentasi analisis, dan validasi kesiapan dataset sebelum tahap pemodelan machine learning.

---

## 📌 Latar Belakang

Kanker kulit merupakan salah satu jenis kanker yang paling umum ditemukan di dunia. Analisis karakteristik lesi kulit menjadi langkah penting dalam mendukung pengembangan sistem diagnosis berbasis AI yang lebih cepat dan akurat.

Melalui proyek ini dilakukan proses analisis data secara menyeluruh mulai dari data wrangling hingga data preparation untuk menghasilkan dataset yang siap digunakan pada tahap machine learning.

---

## 🎯 Tujuan Proyek

- Menganalisis karakteristik dataset kanker kulit berdasarkan metadata pasien.
- Mengidentifikasi distribusi diagnosis pada berbagai kelompok usia, jenis kelamin, dan lokasi anatomi lesi.
- Melakukan feature engineering untuk memperkaya informasi pada dataset.
- Menganalisis hubungan antar fitur hasil preprocessing dan feature engineering.
- Menyiapkan dataset train, validation, dan test yang bebas data leakage untuk kebutuhan pemodelan machine learning.

---

## 🧬 Target Klasifikasi

Proyek ini berfokus pada tiga kelas diagnosis utama:

| Kode | Diagnosis            |
| ---- | -------------------- |
| MEL  | Melanoma             |
| BCC  | Basal Cell Carcinoma |
| NV   | Melanocytic Nevi     |

---

## ❓ Business Questions

Analisis dilakukan untuk menjawab beberapa pertanyaan utama:

1. Bagaimana karakteristik distribusi Melanoma (MEL), Melanocytic Nevi (NV), dan Basal Cell Carcinoma (BCC) berdasarkan metadata pasien seperti usia, jenis kelamin, dan lokasi anatomi lesi?

2. Apakah terdapat ketidakseimbangan distribusi kelas (class imbalance) yang dapat mempengaruhi performa model klasifikasi AI?

3. Bagaimana kualitas dan karakteristik dataset yang digunakan untuk pengembangan model klasifikasi kanker kulit?

4. Bagaimana proses preprocessing dan feature engineering membantu meningkatkan kualitas dataset serta mendukung analisis karakteristik penyakit?

---

## 🔄 Workflow Proyek

```text
Raw Dataset
    ↓
Business Understanding
    ↓
Data Wrangling
    ↓
Exploratory Data Analysis (EDA)
    ↓
Preprocessing
    ↓
Feature Engineering
    ↓
Visualization & Explanatory Analysis
    ↓
dataset_encoded.csv
    ↓
Data Preparation
    ↓
train.csv
val.csv
test.csv
    ↓
Machine Learning Ready Dataset
```

---

## ⚙️ Feature Engineering

Beberapa fitur baru dibentuk untuk memperkaya proses analisis.

### Age Group

| Age Group   | Rentang Usia  |
| ----------- | ------------- |
| Child       | < 18 Tahun    |
| Young Adult | 18 – 39 Tahun |
| Adult       | 40 – 59 Tahun |
| Senior      | ≥ 60 Tahun    |

### Risk Category

Kategori risiko lokasi lesi berdasarkan karakteristik anatomical site.

### Site Risk Score

Representasi numerik dari tingkat risiko relatif lokasi anatomi lesi.

---

## 📂 Struktur Dataset

### Dataset Analisis

Lokasi:

```text
data/encode/dataset_encoded.csv
```

Digunakan untuk:

- Dataset Overview
- Business Question Analysis
- Feature Engineering
- Correlation Analysis

---

### Dataset Pemodelan

Lokasi:

```text
data/final/
├── train.csv
├── val.csv
└── test.csv
```

Digunakan untuk:

- Training Model
- Validation Model
- Testing Model
- Evaluasi Model

---

## 📊 Dashboard Analytics

Dashboard Streamlit terdiri dari beberapa halaman:

### 🏠 Home

Ringkasan proyek, dataset analisis, dan dataset pemodelan.

### 📈 Executive Dashboard

Ringkasan KPI utama proyek.

### 📂 Dataset Overview

Visualisasi karakteristik dataset:

- Distribusi Kelas
- Distribusi Gender
- Distribusi Usia
- Distribusi Lokasi Anatomi

### ❓ Business Question Analysis

Visualisasi untuk menjawab pertanyaan bisnis proyek.

### ⚙️ Feature Engineering

Analisis fitur hasil rekayasa fitur:

- Age Group
- Risk Category
- Site Risk Score

### 🔗 Correlation Analysis

Analisis hubungan antar fitur dan target.

### 🧪 Data Preparation

Analisis train-validation-test split, class balance, dan leakage validation.

### 📚 Dataset Documentation

Dokumentasi dataset, data dictionary, dan informasi feature engineering.

---

## 📷 Dashboard Preview

### 🏠 Home

![Home](reports/Streamlit%20Home.png)

---

### 📈 Executive Dashboard

![Executive Dashboard](reports/Streamlit%20Dashboard.png)

---

### 📂 Dataset Overview

![Dataset Overview](reports/Streamlit%20Dataset%20Overview.png)

---

### ❓ Business Question Analysis

![Business Question Analysis](reports/Streamlit%20Business%20Question.png)

---

### ⚙️ Feature Engineering

![Feature Engineering](reports/Streamlit%20Feature%20Engineering.png)

---

### 🔗 Correlation Analysis

![Correlation Analysis](reports/Streamlit%20Correlation%20Analysis.png)

---

### 🧪 Data Preparation

![Data Preparation](reports/Streamlit%20Data%20Preparation.png)

---

### 📚 Dataset Documentation

![Dataset Documentation](reports/Streamlit%20Dataset%20Documentation.png)

---

## 📁 Struktur Repository

```text
CAPSTONE DATA SCIENCE DERMASIGHT
│
├── dashboard
│   ├── assets
│   │   └── LOGO.png
│   │
│   ├── pages
│   │   ├── 1_Executive_Dashboard.py
│   │   ├── 2_Dataset_Overview.py
│   │   ├── 3_Business_Questions.py
│   │   ├── 4_Feature_Engineering.py
│   │   ├── 5_Correlation_Analysis.py
│   │   ├── 6_Data_Preparation.py
│   │   └── 7_Dataset_Documentation.py
│   │
│   ├── utils
│   │   ├── charts.py
│   │   ├── data_loader.py
│   │   └── styles.py
│   │
│   └── 0_Home.py
│
├── data
│   ├── encode
│   │   └── dataset_encoded.csv
│   │
│   └── final
│       ├── train.csv
│       ├── val.csv
│       └── test.csv
│
├── docs
│   ├── Laporan Teknis Komprehensif.pdf
│   └── project_overview.md
│
├── notebooks
│   ├── DermasightDS.ipynb
│   └── DermasightDS.py
│
├── reports
│   ├── Streamlit Home.png
│   ├── Streamlit Dashboard.png
│   ├── Streamlit Dataset Overview.png
│   ├── Streamlit Business Question.png
│   ├── Streamlit Feature Engineering.png
│   ├── Streamlit Correlation Analysis.png
│   ├── Streamlit Data Preparation.png
│   └── Streamlit Dataset Documentation.png
│
├── README.md
└── requirements.txt
```

---

## 💻 Teknologi yang Digunakan

- Python
- Pandas
- NumPy
- Plotly
- Streamlit
- Scikit-Learn

---

## 🚀 Menjalankan Dashboard

Install dependency:

```bash
pip install -r requirements.txt
```

Masuk ke folder dashboard:

```bash
cd dashboard
```

Jalankan aplikasi:

```bash
streamlit run 0_Home.py
```

---

## 📄 Dokumentasi

Dokumentasi teknis lengkap tersedia pada:

```text
docs/Laporan Teknis Komprehensif.pdf
```

Notebook analisis tersedia pada:

```text
notebooks/DermasightDS.ipynb
```

Dokumentasi Streamlit pada:

```text
reports/
```

---

## 👤 Author

**Sindi Prassetiyani**

Capstone Project – DermaSight

Skin Cancer Analytics & Machine Learning Preparation
