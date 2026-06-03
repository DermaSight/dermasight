import streamlit as st


def load_css():

    st.markdown(
        """
        <style>

        /* =========================
           MAIN
        ========================= */

        .main {
            padding-top: 1rem;
        }

        h1, h2, h3 {
            font-weight: 700;
        }

        /* =========================
           SIDEBAR
        ========================= */

        section[data-testid="stSidebar"] {
            background-color: #121826;
            border-right: 1px solid #2E3446;
        }

        section[data-testid="stSidebar"] * {
            color: #E8ECF3;
        }

        /* Hover menu */

        section[data-testid="stSidebar"] a:hover {
            background-color: #1D2435;
            border-radius: 10px;
        }

        /* =========================
           METRIC CARD
        ========================= */

        div[data-testid="stMetric"] {

            border: 1px solid rgba(
                255,
                255,
                255,
                0.08
            );

            border-radius: 16px;

            padding: 18px;

            background: rgba(
                255,
                255,
                255,
                0.03
            );

            backdrop-filter: blur(8px);
        }

        div[data-testid="stMetricValue"] {
            font-size: 2rem;
            font-weight: 700;
        }

        div[data-testid="stMetricLabel"] {
            font-size: 1rem;
            font-weight: 500;
        }

        /* =========================
           DATAFRAME
        ========================= */

        .stDataFrame {
            border-radius: 12px;
            overflow: hidden;
        }

        /* =========================
           BUTTON
        ========================= */

        .stButton button,
        .stDownloadButton button {

            border-radius: 10px;
            font-weight: 600;
        }

        /* =========================
           SUCCESS / INFO
        ========================= */

        div[data-baseweb="notification"] {
            border-radius: 12px;
        }

        </style>
        """,
        unsafe_allow_html=True
    )