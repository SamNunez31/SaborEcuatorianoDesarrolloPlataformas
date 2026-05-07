# 🇪🇨 Sabor Ecuatoriano

**Carrito de compras** de comida ecuatoriana — Proyecto académico de **Desarrollo en Plataformas** (PUCE Virtual, Reto 1, semanas 1–6).

## 🏗️ Arquitectura: Modelo–Vista–Controlador (MVC)

Estructura literal de carpetas según **Semana 6, sección 6.4**:

```
sabor-ecuatoriano/
├── index.html              ← Vista principal (HTML semántico)
├── assets/styles.css       ← Estilos (CSS3 + Flexbox + Grid + Media Queries)
│
├── model/                  ← MODELO: datos y persistencia
│   ├── productos.json      ← Catálogo (Sem 6 sec 6.5: lectura JSON)
│   ├── repo.js             ← Acceso a datos con $.getJSON
│   ├── carrito.js          ← Carrito + 4 mecanismos de Web Storage
│   └── validacion.js       ← Validación con regex
│
├── view/                   ← VISTA: renderizado
│   └── vista.js            ← jQuery DOM + efectos
│
└── controller/             ← CONTROLADOR: orquestación
    └── app.js              ← Conecta Modelo ↔ Vista
```

## 🛠️ Tecnologías por semana

| Semana | Tema | Implementación |
|--------|------|----------------|
| 3 | CSS3 adaptable | Box model, Flexbox, Grid, Media Queries (Mobile First), variables CSS |
| 4 | JavaScript ES6+ | `let`/`const`, arrow functions, template literals, async/await, try/catch |
| 5 | DOM y APIs | Validación regex, ARIA, Fetch, **localStorage + sessionStorage + IndexedDB + cookies**, PWA |
| 6 | jQuery + MVC | `$.getJSON`, eventos, efectos `fadeIn`/`animate`, **arquitectura MVC con carpetas separadas** |

## 💾 Persistencia (Web Storage)

| Mecanismo | Uso | PDF |
|-----------|-----|-----|
| **localStorage** | Carrito persistente entre sesiones | Sem 5 sec 5.2 |
| **sessionStorage** | Contador de visitas a la sesión | Sem 5 sec 5.2 |
| **IndexedDB** | Historial de pedidos confirmados | Sem 5 sec 5.3 |
| **Cookies** | Fecha de última actualización del carrito | Sem 5 sec 5.3 punto 8 |

## ✅ Validaciones (regex)

- **Nombre:** 3–50 letras (incluye tildes y ñ)
- **Email:** formato `usuario@dominio.ext`
- **Teléfono:** 10 dígitos numéricos
- **Cédula:** 10 dígitos numéricos

Validación en tiempo real con eventos `input` y `blur` + atributos ARIA (`aria-invalid`, `aria-describedby`, `aria-live`).

## ♿ Accesibilidad (Sem 5 sec 5.4)

- Roles ARIA (`role="banner"`, `role="navigation"`, `role="main"`, `role="contentinfo"`)
- `aria-live` en regiones dinámicas (catálogo, carrito, errores)
- `aria-busy` durante la carga
- `aria-invalid` y `aria-describedby` en formulario
- Navegación por teclado con foco visible
- Respeta `prefers-reduced-motion`

## ▶️ Cómo ejecutar

### Online (recomendado)
Visita: `https://[tu-usuario].neocities.org`

### Local con VS Code + Live Server
1. Instala la extensión **Live Server** (Ritwick Dey)
2. **File → Open Folder** → selecciona la carpeta `sabor-ecuatoriano` (la que tiene `index.html` adentro)
3. Click derecho en `index.html` → **Open with Live Server**
4. La URL debe verse: `http://127.0.0.1:5500/index.html`

> ⚠️ No abrir con doble clic. `fetch` y AJAX requieren servidor HTTP.

## 📚 Defensa académica rápida

> *"El proyecto sigue el patrón **MVC** según Semana 6 sección 6.4. El **Modelo** centraliza datos y persistencia: catálogo en JSON con `$.getJSON` (sec 6.5), carrito en localStorage, visitas en sessionStorage, pedidos en IndexedDB, fecha en cookies (Sem 5). La **Vista** renderiza con jQuery (Sem 6 sec 6.2) e incluye efectos `fadeIn`/`animate` (sec 6.3). El **Controlador** (`app.js`) orquesta los eventos del usuario y conecta Modelo↔Vista. La estructura de carpetas separadas hace cada capa independiente y reemplazable."*

## 👨‍💻 Autor
Proyecto académico — Reto 1 — PUCE Virtual 2025