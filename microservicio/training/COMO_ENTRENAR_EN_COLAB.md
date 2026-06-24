# 🚀 Guía de Entrenamiento en Google Colab (Aceleración por GPU)

Para evitar consumir la memoria RAM/CPU de tu laptop y reducir el tiempo de entrenamiento de **12-15 horas (en CPU) a solo unos minutos**, podemos entrenar los modelos utilizando la GPU gratuita de Google Colab.

Sigue estos sencillos pasos:

---

## 📦 Paso 1: Comprimir tu Dataset local

Primero, debemos empaquetar el dataset actual en un archivo ZIP para poder subirlo a Colab.

1. Abre tu terminal en la carpeta del microservicio:
   ```bash
   cd c:\ENSAMBLADOR\IAENSAMBLADOR\microservicio
   ```
2. Ejecuta el siguiente comando en PowerShell para crear el archivo `dataset.zip` con la carpeta `dataset/processed` (que contiene las imágenes organizadas por categorías):
   ```powershell
   Compress-Archive -Path dataset\processed -DestinationPath dataset.zip -Force
   ```
   *(Si usas Git Bash o Linux/macOS, puedes usar: `zip -r dataset.zip dataset/processed`)*

---

## 🌐 Paso 2: Abrir el Cuaderno en Google Colab

1. Entra a tu navegador e ingresa a [Google Colab](https://colab.research.google.com/).
2. Inicia sesión con tu cuenta de Google.
3. En la ventana emergente, selecciona la pestaña **Subir** (Upload) y arrastra o selecciona el archivo del cuaderno que acabamos de crear en tu laptop:
   * Ruta: `c:\ENSAMBLADOR\IAENSAMBLADOR\microservicio\training\Entrenamiento_Colab.ipynb`

---

## ⚡ Paso 3: Configurar la GPU (Muy Importante)

Para que el entrenamiento no sea lento y aproveche la potencia de Google:
1. En el menú superior de Colab, haz clic en **Entorno de ejecución** (Runtime) -> **Cambiar tipo de entorno de ejecución** (Change runtime type).
2. En la opción **Acelerador por hardware** (Hardware accelerator), selecciona **T4 GPU** (es gratuita y muy rápida).
3. Haz clic en **Guardar** (Save).

---

## 🏃 Paso 4: Ejecutar el Entrenamiento

1. Ejecuta la primera celda (`# Verificar que la GPU esté activa`) para asegurarte de que la GPU T4 está asignada correctamente.
2. Ejecuta la celda **1. Cargar el Dataset**: te aparecerá un botón que dice **Elegir archivos** (Choose Files). Haz clic y selecciona el archivo `dataset.zip` que creamos en el **Paso 1**.
3. Ejecuta la celda **2. Instalar Librerías Adicionales** para preparar las dependencias.
4. Ejecuta la celda **3. Código de Entrenamiento** para cargar las funciones de PyTorch y clases.
5. Ejecuta la celda **4. Lanzar Entrenamiento**: aquí puedes modificar parámetros si lo deseas (como cambiar de `"resnet50"` a `"mobilenet_v2"`). ¡Verás el progreso avanzar sumamente rápido!
6. Opcionalmente, ejecuta la celda de visualización para ver los gráficos de precisión y pérdida.

---

## 💾 Paso 5: Descargar e Integrar el Modelo en tu Laptop

1. Ejecuta la última celda del cuaderno (**6. Descargar el Modelo a tu Laptop**). Esto descargará automáticamente el archivo entrenado (por ejemplo, `best_resnet50.pt` o `best_mobilenet_v2.pt`) a tu carpeta de Descargas.
2. Copia este archivo `.pt` descargado a la carpeta de modelos de tu microservicio local:
   * Ruta de destino local: `c:\ENSAMBLADOR\IAENSAMBLADOR\microservicio\models\`
3. Si cambiaste de modelo o es la primera vez que lo integras, asegúrate de actualizar el archivo `.env` de tu microservicio para que cargue el proveedor/modelo correcto.
