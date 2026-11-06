# ⚡ SGE Apuntes y Guía Rápida - 2º DAM (Centro Progresa)

> **Materia:** Sistemas de Gestión Empresarial (SGE)  
> **Profesor:** Francisco Belda  
> **Stack:** Ionic v8 + Angular Standalone (Signals, Router Standalone, Swiper v11, HttpClient fetch)  
> **Autor:** javierfr7625-cell (Javier)

---

## 🚀 Contenido del Repositorio

* **`index.html`**: Aplicación web completa lista para abrir con doble clic en local o publicar en **GitHub Pages**. Incluye:
  * 🔍 Buscador en tiempo real por palabras clave, conceptos o archivos (`Ctrl + F`).
  * 🏷️ Filtros por categorías (Zelda, Swiper, Modales, Infinite Scroll, Menú, etc.).
  * 📋 Checklist interactivo de entrega y comprobaciones críticas pre-examen.
  * 🎨 Resaltado de sintaxis con colores estilo VS Code / One Dark Pro pre-renderizado.
  * 📋 Botón de copiado limpio al portapapeles en cada bloque de código.
* **`GUIA_EXAMEN_SGE.md`**: Master document en Markdown con todos los modelos de examen, arquitectura de carpetas, puntos fatales y chuleta rápida.
* **`web-astro/`**: Código fuente del proyecto en [Astro](https://astro.build/) para desarrollo y personalización.
* **`Simulacro/`**: Enunciado oficial y proyecto de referencia del simulacro de Zelda.
* **`Teoría Ionic-20261106/`**: Documentación teórica oficial de los temas de clase en PDF.
* **`Transcripcion/`**: Subtítulos y transcripciones de las clases grabadas.

---

## 🛠️ Ejecución Local

### 1. Web Estática (Sin instalación)
Simplemente haz doble clic en `index.html` para abrirlo en tu navegador favorito. Es 100% offline y no requiere conexión a internet.

### 2. Proyecto Astro
Si deseas modificar el diseño o extender la aplicación:
```bash
cd web-astro
npm install
npm run dev
```

Para generar la compilación estática:
```bash
npm run build
```
