# ============================================================
# Python 3.9 · TensorFlow 2.10 · FastAPI
# Build context: ROOT project (dermasight-research-model-2/)
# Command: docker build -f dermasight-api/Dockerfile -t dermasight-api:v3 .
# ============================================================

FROM python:3.9-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    libglib2.0-0 \
    curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY dermasight-api/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt

COPY dermasight-api/main.py .

COPY exports/ exports/

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8000/ || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]