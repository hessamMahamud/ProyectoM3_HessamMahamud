---
title: "README"
---
# 🗣️ Chat con personajes de Overlord

_Single Page Application para chatear con IA usando Google Gemini_

---

## 📖 Descripción del personaje elegido

El personaje principal es **Ainz Ooal Gown** (también conocido como Momonga), el protagonista de la serie _Overlord_. Es un esqueleto hechicero no-muerto que gobierna la Gran Tumba de Nazarick. Habla con calma, formalidad y autoridad, pero internamente duda constantemente y actúa improvisando para mantener su fachada de gobernante todopoderoso.

Además, el proyecto incluye **dos personajes adicionales** (extra credit):
- **Albedo** – Guardiana Suprema, devota y obsesionada con Ainz.
- **Demiurge** – Demonio brillante y manipulador, siempre con un plan.

El usuario puede elegir con cuál de los tres quiere chatear desde la página de inicio.

---

## 🚀 Requisitos y pasos para ejecutar localmente

### Requisitos previos
- Node.js (v18 o superior)
- Cuenta en Google AI Studio para obtener una API key de Gemini
- Vercel CLI (opcional, pero recomendado para pruebas locales)

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/hessamMahamud/ProyectoM3_HessamMahamud.git
   cd ProyectoM3_HessamMahamud
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - Copia el archivo `.env.example` a `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edita `.env` y añade tu API key de Gemini:
     ```
     GEMINI_API_KEY=tu_clave_aqui
     ```

4. **Ejecutar en modo desarrollo (con Vercel)**
   ```bash
   npx vercel dev
   ```
   Esto levantará el servidor en `http://localhost:3000` y las serverless functions en `/api/chat`.

5. **Abrir en el navegador**
   - Visita `http://localhost:3000` para ver la aplicación.
   - Prueba la navegación SPA entre Home, Chat y About.
   - Selecciona un personaje y empieza a chatear.

---

## 🧪 Cómo ejecutar los tests

Los tests unitarios están escritos con **Vitest**. Para ejecutarlos:

```bash
npm test
```

Esto correrá todos los tests en modo `run` (una sola vez). Si quieres modo watch (para desarrollo):

```bash
npm run test:watch
```

**Tests disponibles:**
- `chatPayload.test.js`: verifica la transformación de mensajes y el recorte del historial.
- `character.test.js`: comprueba el mapeo de datos del personaje.
- `aiClient.test.js`: mockea `fetch` para probar el manejo de respuestas exitosas y de errores (rate limiting) de la API.

---

## 🌐 Cómo desplegar en Vercel

1. **Sube el código a GitHub** (repositorio público o privado).

2. **Conecta el repositorio en Vercel:**
   - Ve a [vercel.com](https://vercel.com) y haz login con GitHub.
   - Haz clic en **Add New → Project**.
   - Selecciona tu repositorio.
   - En **Framework Preset** elige _Other_ (ya que es vanilla JS).
   - En **Root Directory** deja por defecto (`.`).
   - En **Environment Variables** añade:
     - `GEMINI_API_KEY` con el valor de tu clave (puedes obtenerla desde Google AI Studio).

3. **Desplegar:**
   - Haz clic en **Deploy**.
   - Vercel construirá el proyecto y generará una URL pública (ej. `https://tu-proyecto.vercel.app`).

4. **Verificar en producción:**
   - Abre la URL y prueba el chat.
   - Asegúrate de que las funciones serverless (`/api/chat`) respondan correctamente.

---

## 📸 Capturas de pantalla

_(Inserta aquí tus capturas)_

| Home – Galería de personajes | Chat con Ainz | About |
| --- | --- | --- |
| ![Home](./screenshots/home.png) | ![Chat](./screenshots/chat.png) | ![About](./screenshots/about.png) |

---

## 🔗 Link a la aplicación desplegada

[Chat desplegado en Vercel](https://proyecto-m3-hessam-mahamud.vercel.app/)

---

## 🤖 Registro del uso de IA en el proyecto

**Herramientas utilizadas:**
- Google Gemini AI (`gemini-flash-lite-latest`) como motor de conversación.
- Asistentes de código (ChatGPT / Claude) para depuración, sugerencias de arquitectura y generación de fragmentos de código.

**Prompts destacados:**
- System prompts personalizados para cada personaje (definen personalidad, tono y límites).
- Prompt para manejo de errores 429 y 503 con reintentos automáticos.
- Prompt para implementar la navegación SPA con History API.

**Decisiones basadas en IA:**
- Separación modular en `features/` y `shared/`.
- Uso de `URLSearchParams` para identificar al personaje en la URL.
- Estrategia de reintento con countdown para rate limiting.

_Más detalles en los archivos [Uso IA](/src/docs/20260902100028.md) y [System Prompt IA](/src/docs/20260902100053.md)_

---

## 📁 Estructura del proyecto

```
├── api/
│   └── chat.js                # Serverless Function (proxy a Gemini)
├── src/
│   ├── data/
│   │   └── characters.js      # Datos de los personajes
│   ├── features/
│   │   ├── about/             # Vista About
│   │   ├── chat/              # Vista Chat (lógica, estilos, prompts)
│   │   ├── home/              # Vista Home (galería de personajes)
│   │   └── notFound/          # Vista 404
│   ├── shared/                # Utilidades compartidas (navigation, debounce, etc.)
│   ├── styles/                # Estilos globales y variables CSS
│   ├── index.css              # Punto de entrada de estilos
│   ├── main.js                # Punto de entrada JS
│   └── router.js              # Enrutador SPA
├── tests/                     # Tests unitarios con Vitest
├── .env.example               # Ejemplo de variables de entorno
├── .gitignore
├── package.json
├── README.md
└── vercel.json                # Configuración de Vercel
```

---

## 📦 Entregable final

- Código fuente completo en GitHub.
- Serverless function funcionando en `/api/chat`.
- Variables de entorno configuradas (`.env.example` incluido).
- Al menos 4 tests unitarios con Vitest (todos pasando).
- README completo y documentación.
- URL pública de la aplicación desplegada en Vercel.

---

## ✨ Extra credits implementados

1. ✅ **Selección de múltiples personajes** – Galería en Home con 3 personajes, cada uno con su propio system prompt.
2. ✅ **Persistencia del historial** – Guardado en `localStorage` por personaje (una key distinta por cada uno), con indicador visual de "historial guardado" y botón para borrarlo.
3. ✅ **Funcionalidades adicionales**:
   - Indicador de "escribiendo..." animado.
   - Reintento automático con countdown para errores 429 y 503.
   - Scroll automático al último mensaje.
   - Soporte para tecla Enter (aparte del botón).

---

## 🙋‍♂️ Autor

**Hessam Mahamud**
Estudiante de soyHenry – Full Stack Web Development
[GitHub](https://github.com/hessamMahamud) | [LinkedIn](https://linkedin.com/in/tu-perfil)

---

_¡Gracias por visitar este proyecto! Si tienes preguntas, no dudes en contactarme.!_
