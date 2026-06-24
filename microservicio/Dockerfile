FROM python:3.10-slim-bullseye

WORKDIR /app

# Instalar dependencias del sistema mínimas para OpenCV
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements e instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código del proyecto
COPY . .

# Exponer el puerto de producción del microservicio
EXPOSE 8001

# Ejecutar Gunicorn con Uvicorn workers para alta concurrencia
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "app.main:app", "-w", "4", "--bind", "0.0.0.0:8001"]
