Actúa como profesor titular, arquitecto de software y auditor técnico de la asignatura (Sistemas de Gestión Empresarial / Desarrollo de Software). He subido:
1. Las transcripciones completas de todas las clases.
2. Todos los PDFs teóricos oficiales.
3. El simulacro de examen oficial junto con la solución detallada hecha por el profesor.

Tu objetivo es generar la "Base de Conocimiento y Guía de Resolución Rápida" diseñada para un examen a libro abierto con ordenador. Esta documentación se integrará en una **web interactiva de consulta rápida** (puedes usar astro o lo que te convenga)(con buscador instantáneo, filtrado por etiquetas y snippets copiables).

El contenido debe estar estructurado en Markdown limpio y modular, optimizado para búsqueda rápida (`Ctrl + F` y barra de búsqueda interactiva) de conceptos, archivos y artefactos de código (ej. `model.ts`, `service.ts`, decoradores, entidades, validaciones, consultas o configuraciones).

Genera el documento con la siguiente estructura estricta:

1. DICCIONARIO RÁPIDO DE BÚSQUEDA Y ARTEFACTOS (TAGS & QUICK LOOKUP):
- Tabla con palabras clave de búsqueda rápida: Nombre del concepto/problema | Archivo de referencia (ej. `*.model.ts`, `*.controller.ts`, etc.) | Decoradores/Funciones clave | 1 línea de propósito.

2. CATÁLOGO DE MODELOS / EJERCICIOS EVALUABLES:
Identifica cada uno de los arquetipos de problemas o requerimientos prácticos que el profesor evaluará.

3. PARA CADA MODELO DE EJERCICIO:
- IDENTIFICADOR Y TRIGGER RÁPIDO: Palabras clave exactas del enunciado para identificarlo en menos de 5 segundos.
- ANATOMÍA DE ARCHIVOS IMPLICADOS: Lista exacta de archivos a tocar o crear (ej. `user.model.ts`, `auth.service.ts`, etc.) y qué va en cada uno.
- RECETA PASO A PASO (ALGORITMO ESTRICTO): Pasos cronológicos numerados sin teoría sobrante.
- SNIPPET DE CÓDIGO MODELO (COPY-PASTE READY): Bloque de código con la sintaxis exacta, tipos TypeScript, anotaciones y estructura que exige el profesor en sus correcciones.
- CRITERIO DEL PROFESOR Y ERRORES FATALES: 
  * Cosas que puntúa positivo o considera obligatorias según el simulacro y las transcripciones.
  * Errores típicos que restan puntos o anulan el ejercicio (fallos de sintaxis, tipos `any`, lógica de negocio mal ubicada, etc.).
- CHECKLIST DE AUTO-EVALUACIÓN: 3 a 5 puntos rápidos para verificar que el código funciona y cumple todos los requisitos antes de entregar.

4. SECCIÓN CHEAT-SHEET RÁPIDO (CÓDIGO FRECUENTE):
Tablas con snippets de 2-4 líneas para imports habituales, decoradores, estructuras de esquemas, mapeos de DTOs y validaciones recurrentes en clase.

Sé ultra conciso, directo al grano y orientado a la ejecución bajo presión de tiempo. Prioriza tablas, listas numeradas y bloques de código listos para producción.

5. A tener EN CUENTA!!
Lo que mas se me complica son los elementos de de ionic y las conexiones de elementos, listas infinitas etc.
puedes añadir cosas que creas convenientes a la app web despues de haber analizado las transcripciones de las clases por si el profesor ha dixho algo importante, a tener en cuenta que las transcripciones muchas palabras estan mal ya que el modelo se equivoca y pueden haber cosas raras pero la mayoria esta bien, se suele filtrar tambien palabras de alumnos sueltas asi que tenlo en cuenta. Puedes poner en la pagina captions o detalles que no se tienen que olvidar cambiar en el examen por ejemplo el profe dice siempre de poner el author en el package.json siempre.