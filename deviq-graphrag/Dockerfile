FROM python:3.13-slim

WORKDIR /app

COPY pyproject.toml .
RUN pip install --no-cache-dir .

COPY src/ src/
COPY scripts/ scripts/

EXPOSE 8100

CMD ["uvicorn", "deviq_graphrag.main:app", "--host", "0.0.0.0", "--port", "8100"]
