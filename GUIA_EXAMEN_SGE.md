# 🚀 GUÍA DEFINITIVA DE RESOLUCIÓN RÁPIDA: EXAMEN SGE (IONIC v8 + ANGULAR STANDALONE)
> **Asignatura**: Sistemas de Gestión Empresarial / Desarrollo de Software (2º DAM)  
> **Profesor**: Francisco Belda | **Centro**: Progresa  
> **Objetivo**: Guía de referencia rápida y cheat-sheet copy-paste para examen a libro abierto con ordenador.

---

## ⚠️ AVISO URGENTE: EL "CHECKLIST DE LOS 5 PUNTOS DE SALVACIÓN" (ANTES DE TOCAR CÓDIGO)
*Extraído textualmente de las transcripciones de clase y correcciones del profesor Francisco Belda:*

1. **`package.json` -> AUTOR OBLIGATORIO**:  
   El profesor siempre revisa el `package.json`. Añadir tu nombre en `"author"` inmediatamente al crear/abrir el proyecto:
   ```json
   "author": "Tu Nombre y Apellidos",
   "version": "1.0.0",
   ```
2. **`main.ts` -> `provideHttpClient(withFetch())`**:  
   En Angular 17/18/19 Standalone, si llamas a cualquier API y no agregaste `provideHttpClient(withFetch())` en los `providers` de `main.ts`, la app explotará con pantalla en blanco (`NullInjectorError: No provider for HttpClient`).
3. **`app.component.ts` -> `register()` de Swiper**:  
   Si el examen tiene diapositivas/slides, debes importar `import { register } from 'swiper/element/bundle';` y ejecutar `register();` en `app.component.ts`. Si no, `<swiper-container>` no funciona.
4. **`schemas: [CUSTOM_ELEMENTS_SCHEMA]` en la página de Slides**:  
   Angular marcará error de compilación si no colocas `CUSTOM_ELEMENTS_SCHEMA` en la lista `schemas` del `@Component` que use Swiper.
5. **Conexión Menú-Contenido (`menuId` y `contentId`)**:  
   El atributo `contentId` de `<ion-menu>` DEBE coincidir con el `id` del `<ion-content>` de la página o del `<ion-router-outlet id="principal">`. Si no coinciden, el menú no se abrirá o bloqueará la pantalla con una capa oscura.

---

# 🛠️ GUÍA DE INICIO Y SETUP DESDE CERO (CREACIÓN Y ESTRUCTURA DE PROYECTO)

### 1. Creación del Proyecto en Blanco
En la terminal (PowerShell o Git Bash), ejecuta el comando oficial con Angular Standalone:
```bash
ionic start mi-examen blank --type=angular --standalone
```
*Si la terminal te pregunta si quieres crear una cuenta de Ionic o integrar Capacitor, pulsa `N` (o `Y` si el examen pide Capacitor).*

### 2. Instalación Inmediata de Dependencias del Examen
Navega a la carpeta del proyecto recién creado:
```bash
cd mi-examen
```
Instala Swiper (casi siempre cae diapositivas):
```bash
npm install swiper
```
*Si el examen pide multilenguaje:*
```bash
npm install @ngx-translate/core @ngx-translate/http-loader
```

### 3. Edición Obligatoria en `package.json`
Abre `package.json` y pon tu nombre completo en la clave `author`:
```json
{
  "name": "examen-sge",
  "version": "1.0.0",
  "author": "Tu Nombre y Apellidos",
  "description": "Examen Primera Evaluación SGE"
}
```

### 4. Estructura de Carpetas Oficial (Arquitectura Recomendada por el Profesor)
Crea las siguientes carpetas dentro de `src/app/` y `src/assets/`:

```text
src/
├── app/
│   ├── common/
│   │   └── models/          <-- Interfaces TypeScript y DTOs (ej: zelda.model.ts, user.model.ts)
│   ├── components/          <-- Componentes modulares reutilizables (ej: menu/, header/)
│   ├── pages/               <-- Pantallas completas asociadas a rutas (ej: inicio/, materials/)
│   ├── pipes/               <-- Pipes de filtrado personalizado (ej: filtro.pipe.ts)
│   └── services/            <-- Servicios con llamadas HTTP y lógica compartida (ej: zelda.service.ts, toast.service.ts)
├── assets/
│   ├── data/                <-- Archivos JSON locales de pruebas (ej: menu.json)
│   ├── i18n/                <-- Archivos de traducción si hay multilenguaje (es.json, en.json)
│   └── images/              <-- Imágenes estáticas (AmongUs.jpg, link.jpg, logo.png)
└── environments/
    └── environment.ts       <-- URLs base de las APIs (environment.URLBase = 'https://...')
```

### 5. Comandos CLI para Generar Artefactos sin Archivos Basura
*Nota*: Siempre usamos `--spec=false` y `--standalone` para no generar tests innecesarios ni módulos clásicos:
```bash
# 📄 Generar Páginas (Pages)
ionic g page pages/inicio --spec=false
ionic g page pages/materials --spec=false

# 🧩 Generar Componentes (Components)
ionic g c components/menu --standalone --spec=false
ionic g c components/header --standalone --spec=false

# 💉 Generar Servicios (Services)
ionic g s services/zelda --skip-tests
ionic g s services/toast --skip-tests

# 🔍 Generar Pipes de Filtrado
ionic g pipe pipes/filtro --standalone
```

### 6. Configuración de Enrutamiento (`src/app/app.routes.ts`)
Asegúrate de que la ruta raíz redirija a tu página principal (por ejemplo `inicio`):
```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then((m) => m.InicioPage),
  },
  {
    path: 'materials',
    loadComponent: () => import('./pages/materials/materials.page').then((m) => m.MaterialsPage),
  },
];
```

---

# 1. DICCIONARIO RÁPIDO DE BÚSQUEDA Y ARTEFACTOS (TAGS & QUICK LOOKUP)

| Concepto / Requerimiento | Archivo de Referencia | Decoradores / Funciones Clave | 1 Línea de Propósito |
| :--- | :--- | :--- | :--- |
| **Autor y Versión** | `package.json` | Claves `"author"`, `"version"` | Identificación del alumno en la corrección oficial. |
| **Configuración HTTP** | `src/main.ts` | `provideHttpClient(withFetch())` | Habilita llamadas REST con `HttpClient` en toda la app. |
| **Router con Inputs** | `src/main.ts` | `withComponentInputBinding()` | Vincula query params a `@Input()` de páginas y componentes. |
| **Registro Swiper** | `src/app/app.component.ts` | `register()` de `swiper/element/bundle` | Registra Web Components de Swiper para diapositivas. |
| **Modelo de Datos DTO** | `src/app/common/models/*.model.ts` | `export interface ApiResponse<T>` | Tipado estricto TypeScript para la respuesta de la API. |
| **Servicio API REST** | `src/app/services/*.service.ts` | `@Injectable({ providedIn: 'root' })`, `inject(HttpClient)` | Métodos HTTP (`.get<T>()`) que retornan `Observable<T>`. |
| **Gestión de Estado** | `*.page.ts` | `signal<T>()`, `items.set(val)` | Señales reactivas de Angular para pintar en template con `items()`. |
| **Suscripción en Listas** | `*.page.ts` + `*.page.html` | `service.get().subscribe({ next, error })`, `@for` | Patrón tradicional de suscripción a Observable sin Signals y renderizado con `@for (item of items; track $index)`. |
| **Bucle For Moderno** | `*.page.html` | `@for (item of items(); track item.id)` | Control flow moderno de Angular sin necesidad de `*ngFor`. |
| **Condicional Moderno** | `*.page.html` | `@if (condicion) { } @else { }` | Renderizado condicional moderno sin directivas `*ngIf`. |
| **Swiper Diapositivas** | `inicio.page.html` + `*.ts` | `<swiper-container>`, `CUSTOM_ELEMENTS_SCHEMA` | Secuencia de diapositivas con botón final condicional `@if ($last)`. |
| **Menú Lateral** | `components/menu/menu.component.*` | `<ion-menu>`, `menuId`, `contentId`, `<ion-menu-toggle>` | Panel lateral de navegación con avatar y lista de opciones. |
| **Modal Inline** | `*.page.html` + `*.ts` | `<ion-modal trigger="...">`, `(willDismiss)="fn($event)"` | Ventana emergente con `<ng-template>`, botón cerrar y retorno de datos. |
| **Servicio Toast** | `services/toast.service.ts` | `ToastController`, `.create()`, `.present()` | Muestra mensajes flotantes (éxito/error) con color y duración. |
| **Infinite Scroll (API)** | `*.page.html` + `*.ts` | `<ion-infinite-scroll>`, `event.target.complete()` | Paginación continua hacia abajo con llamada a API y bloqueo final. |
| **Infinite Scroll (Local)** | `*.page.html` + `*.ts` | `Array.push(...nuevoArr)`, `event.target.disabled = true` | Carga por bloques simulada con array local. |
| **Refresher (Pull)** | `*.page.html` + `*.ts` | `<ion-refresher (ionRefresh)="refresh($event)">` | Recarga deslizando hacia abajo con cierre en `event.target.complete()`. |
| **Skeleton Text** | `*.page.html` + `*.scss` | `<ion-skeleton-text [animated]="true">` | Placeholder visual de carga con estilos `.animate__animated`. |
| **Buscador Searchbar** | `*.page.html` + `*.ts` | `<ion-searchbar (ionInput)="buscar($event)">` | Barra de búsqueda reactiva conectada a variable o filtro. |
| **Pipe Filtro** | `pipes/filtro.pipe.ts` | `@Pipe({ name: 'filtro', standalone: true })` | Filtro dinámico en template: `@for (x of items \| filtro:txt:'campo')`. |
| **Segmentos con URL** | `*.page.html` + `*.ts` | `<ion-segment (ionChange)="segmentChanged($event)">` | Botones de pestaña horizontal sincronizados con query params. |
| **Action Sheet** | `*.page.ts` | `ActionSheetController.create({ buttons })` | Menú inferior de opciones con roles (`destructive`, `cancel`). |
| **Alert con Inputs** | `*.page.ts` o inline | `AlertController.create({ inputs, buttons })` | Cuadro de diálogo modal para pedir texto o radio selección. |
| **Botón Flotante FAB** | `*.page.html` | `<ion-fab slot="fixed">`, `<ion-fab-list>` | Botón circular flotante con submenú desplegable en cruz o lista. |
| **Multilenguaje (i18n)** | `main.ts` + `*.json` | `TranslateModule`, `TranslateService`, pipe `translate` | Traducción dinámica en caliente mediante archivos JSON. |

---

# 2. CATÁLOGO DE MODELOS EVALUABLES (ARQUETIPOS DEL PROFESOR)

Francisco Belda estructura los exámenes combinando **3 a 5 de los siguientes bloques** sobre una temática (Zelda, Películas, Pokémon, Usuarios):
1. **MODELO 1**: Configuración Base de Proyecto, Rutas y Providers.
2. **MODELO 2**: Consumo de API REST con HttpClient, Modelos DTO y Signals.
3. **MODELO 3**: Pantalla de Inicio / Diapositivas (Swiper Slides) con botón al final.
4. **MODELO 4**: Menú Lateral Independiente con Avatar y Toggle en Cabecera.
5. **MODELO 5**: Modal Inline con `ng-template`, Generación Aleatoria y `willDismiss`.
6. **MODELO 6**: Infinite Scroll con Paginación de API Externa y Bloqueo al Final.
7. **MODELO 7**: Pull to Refresh con Skeleton Text Animado.
8. **MODELO 8**: Barra de Búsqueda (`ion-searchbar`) con Pipe de Filtrado personalizado.
9. **MODELO 9**: Segmentos sincronizados con Parámetros de URL (`queryParams`) y Componente Hijo.
10. **MODELO 10**: Servicio Centralizado de Toasts Dinámicos.
11. **MODELO 11**: Diálogo Alert con Inputs de Texto o Radios.
12. **MODELO 12**: Sistema Multilenguaje (`ngx-translate`) con Action Sheet de Selección.

---

# 3. DETALLE PASO A PASO DE CADA MODELO DE EJERCICIO

---

### MODELO 1: CONFIGURACIÓN BASE DEL PROYECTO (IMPRESCINDIBLE)

* **IDENTIFICADOR Y TRIGGER RÁPIDO**: Creación del proyecto, error de `HttpClient`, error de Swiper o pérdida de puntos en `package.json`.
* **ANATOMÍA DE ARCHIVOS**:
  * `package.json` -> Agregar autor y versión.
  * `src/main.ts` -> Proveer `HttpClient` y `RouteReuseStrategy`.
  * `src/app/app.component.ts` -> Registrar Swiper web components.
  * `src/environments/environment.ts` -> Guardar URL base de la API.
* **RECETA PASO A PASO**:
  1. Abre `package.json` y pon tu nombre completo en `"author": "Tu Nombre"`.
  2. Abre `src/main.ts` e importa `provideHttpClient, withFetch` de `@angular/common/http`.
  3. Agrega `provideHttpClient(withFetch())` y `withComponentInputBinding()` a `provideRouter(routes, ...)`.
  4. En `src/app/app.component.ts`, importa `register` de `'swiper/element/bundle'` y ejecútalo fuera de la clase.
* **SNIPPET COPY-PASTE READY**:

```json
// package.json (Líneas 2 a 5)
{
  "name": "examen-sge",
  "version": "1.0.0",
  "author": "Tu Nombre y Apellidos",
  "description": "Examen de SGE Primera Evaluacion"
}
```

```typescript
// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withComponentInputBinding, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideHttpClient(withFetch()),
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),
  ],
});
```

```typescript
// src/app/app.component.ts
import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';

register(); // <-- OBLIGATORIO para diapositivas

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {}
}
```

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  URLBase: 'https://botw-compendium.herokuapp.com/api/v3/compendium'
};
```

---

### MODELO 2: CONSUMO DE API REST + MODELOS DTO + SIGNALS

* **IDENTIFICADOR Y TRIGGER RÁPIDO**: "Dada la API https://...", "cargar la información de la API", "listar elementos con imagen, nombre y descripción".
* **ANATOMÍA DE ARCHIVOS**:
  * `src/app/common/models/zelda.model.ts` (o de la API que indique).
  * `src/app/services/api.service.ts`.
  * `src/app/pages/lista/lista.page.ts`.
  * `src/app/pages/lista/lista.page.html`.
* **RECETA PASO A PASO**:
  1. Genera el servicio: `ionic g s services/zelda --skip-tests`.
  2. Crea el modelo TypeScript con la respuesta raíz (`data`, `status`, etc.) y el tipo del objeto.
  3. En el servicio, inyecta `HttpClient` con `inject(HttpClient)` y define la función que devuelva un `Observable<ApiResponse>`.
  4. En el archivo `.page.ts`, inyecta el servicio, declara un `signal<Modelo[]>([])`.
  5. En `ngOnInit()`, suscríbete al servicio y guarda los datos con `this.items.set(res.data)`.
  6. En el `.page.html`, itera con `@for (item of items(); track item.id)` usando `<ion-list>` e `<ion-item>`.
* **SNIPPET COPY-PASTE READY**:

```typescript
// src/app/common/models/zelda.model.ts
export interface ApiResponseZelda {
  data: ZeldaMaterial[];
  message: string;
  status: number;
}

export interface ZeldaMaterial {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  common_locations?: string[];
  cooking_effect?: string;
  hearts_recovered?: number;
}
```

```typescript
// src/app/services/zelda.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseZelda } from '../common/models/zelda.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZeldaService {
  private readonly http: HttpClient = inject(HttpClient);

  getMaterials(): Observable<ApiResponseZelda> {
    return this.http.get<ApiResponseZelda>(`${environment.URLBase}/category/materials`);
  }
}
```

```typescript
// src/app/pages/materials/materials.page.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonAvatar, IonLabel } from '@ionic/angular/standalone';
import { ZeldaService } from '../../services/zelda.service';
import { ZeldaMaterial } from '../../common/models/zelda.model';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.page.html',
  styleUrls: ['./materials.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonAvatar, IonLabel, CommonModule]
})
export class MaterialsPage implements OnInit {
  private readonly zeldaService: ZeldaService = inject(ZeldaService);
  materials = signal<ZeldaMaterial[]>([]);

  ngOnInit() {
    this.loadMaterials();
  }

  private loadMaterials() {
    this.zeldaService.getMaterials().subscribe({
      next: (res) => this.materials.set(res.data),
      error: (err) => console.error('Error cargando materiales:', err)
    });
  }
}
```

```html
<!-- src/app/pages/materials/materials.page.html -->
<ion-header class="ion-no-border">
  <ion-toolbar color="primary">
    <ion-title>Materials</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content id="materials-page">
  <ion-list>
    @for (material of materials(); track material.id) {
      <ion-item>
        <ion-avatar slot="end">
          <img [src]="material.image" [alt]="material.name" />
        </ion-avatar>
        <ion-label>
          <h2 class="ion-text-capitalize">{{ material.name }}</h2>
          <p>{{ material.description }}</p>
        </ion-label>
      </ion-item>
    }
  </ion-list>
</ion-content>
```

---

### MODELO: SUSCRIPCIONES EN LISTAS (CONSUMO CON SUBSCRIBE TRADICIONAL Y @FOR)

* **IDENTIFICADOR Y TRIGGER RÁPIDO**: "Cargar lista mediante suscripción", "Consumo con subscribe", "Listas con ion-avatar y botones", "Iterar con @for y track $index".
* **ANATOMÍA DE ARCHIVOS**:
  * `src/app/services/agentes.service.ts`
  * `src/app/pages/inicio/inicio.page.ts`
  * `src/app/pages/inicio/inicio.page.html`
* **RECETA PASO A PASO**:
  1. Inyecta el servicio mediante la función moderna `inject(AgenteService)` asignándolo a una propiedad `private readonly`.
  2. Declara la variable de estado como un array clásico tipado: `agentes: AgenteItem[] = [];`.
  3. En el ciclo de vida `ngOnInit()` invoca `this.cargarAgentes();`.
  4. En `cargarAgentes()`, suscríbete al método del servicio pasando el objeto con `next` y `error`:
     ```typescript
     this.agentesService.getAgents().subscribe({
       next: (res: Agente) => {
         this.agentes = res.data;
       },
       error: (err: any) => {
         console.log('Error al cargar agentes:', err);
       },
     });
     ```
  5. En el template HTML, usa `<ion-list>` y el nuevo bloque de control de flujo `@for (agente of agentes; track $index)`.
  6. Para cada ítem, define un `<ion-item>` con `<ion-button>`, `<ion-avatar slot="end">` con binding `[src]="agente.displayIcon"` y un `<ion-label class="ion-margin">` con título y descripción.

* **SNIPPET COPY-PASTE READY**:

```typescript
// src/app/pages/inicio/inicio.page.ts
import { Component, OnInit, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonButton,
  IonAvatar,
  IonLabel
} from '@ionic/angular/standalone';
import { AgenteService } from '../../services/agentes.service';
import { Agente, AgenteItem } from '../../common/models/agente.model';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonButton,
    IonAvatar,
    IonLabel
  ],
})
export class InicioPage implements OnInit {
  private readonly agentesService: AgenteService = inject(AgenteService);
  agentes: AgenteItem[] = [];

  constructor() {}

  ngOnInit() {
    this.cargarAgentes();
  }

  cargarAgentes() {
    this.agentesService.getAgents().subscribe({
      next: (res: Agente) => {
        this.agentes = res.data;
      },
      error: (err: any) => {
        console.log('Error al cargar agentes:', err);
      },
    });
  }
}
```

```html
<!-- src/app/pages/inicio/inicio.page.html -->
<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-title class="ion-text-center">Página de Inicio</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true">
  <ion-list>
    @for (agente of agentes; track $index) {
      <ion-item>
        <ion-button>
          <ion-avatar slot="end">
            <img [src]="agente.displayIcon" />
          </ion-avatar>
          <ion-label class="ion-margin">
            <h1>{{ agente.displayName }}</h1>
            <h2><p class="descripcion">{{ agente.description }}</p></h2>
          </ion-label>
        </ion-button>
      </ion-item>
    }
  </ion-list>
</ion-content>
```

---

### MODELO 3: SECUENCIA DE DIAPOSITIVAS (SWIPER / SLIDES)

* **IDENTIFICADOR Y TRIGGER RÁPIDO**: "Página de inicio con secuencia de 3 diapositivas", "la tercera tendrá un botón para ir a la siguiente página", "carrusel de bienvenida".
* **ANATOMÍA DE ARCHIVOS**:
  * `src/app/pages/inicio/inicio.page.ts`.
  * `src/app/pages/inicio/inicio.page.html`.
  * `src/app/pages/inicio/inicio.page.scss`.
* **RECETA PASO A PASO**:
  1. En `inicio.page.ts`, añade `schemas: [CUSTOM_ELEMENTS_SCHEMA]` en el `@Component`.
  2. Importa `RouterLink` de `@angular/router` y añádelo a `imports`.
  3. Define un array de objetos `slides` con `texto`, `image`, `color`.
  4. En `inicio.page.html`, usa `<swiper-container>` y dentro `@for (slide of slides; track slide.texto)`.
  5. En cada slide, coloca `<swiper-slide>`.
  6. Para el botón de la última diapositiva, usa la variable contextual `@if ($last)`.
* **SNIPPET COPY-PASTE READY**:

```typescript
// src/app/pages/inicio/inicio.page.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonContent, IonButton, IonText, IonCardContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <-- OBLIGATORIO PARA SWIPER
  imports: [IonContent, IonButton, IonText, IonCardContent, RouterLink, CommonModule]
})
export class InicioPage implements OnInit {
  slides = [
    {
      texto: 'En este examen utilizaremos componentes de Ionic',
      image: 'assets/images/logo.avif',
      color: 'primary',
    },
    {
      texto: 'Pero trabajaremos con la API del Zelda',
      image: 'assets/images/link.jpg',
      color: 'secondary',
    },
    {
      texto: 'Para lograr el ansiado aprobado',
      image: 'assets/images/approved.png',
      color: 'success',
    },
  ];

  constructor() {}
  ngOnInit() {}
}
```

```html
<!-- src/app/pages/inicio/inicio.page.html -->
<ion-content>
  <swiper-container pagination="true">
    @for (slide of slides; track slide.texto) {
      <swiper-slide>
        <div class="slide-container ion-display-flex ion-flex-column ion-justify-content-center ion-align-items-center">
          <div class="img-wrapper ion-margin-bottom">
            <img [src]="slide.image" [alt]="slide.texto" />
          </div>
          <ion-card-content class="ion-text-center">
            <ion-text [color]="slide.color">
              <h3>{{ slide.texto }}</h3>
            </ion-text>
            @if ($last) {
              <div class="ion-margin-top">
                <ion-button routerLink="/materials" [color]="slide.color" shape="round">
                  EMPEZAR
                </ion-button>
              </div>
            }
          </ion-card-content>
        </div>
      </swiper-slide>
    }
  </swiper-container>
</ion-content>
```

```scss
// src/app/pages/inicio/inicio.page.scss
swiper-container {
  height: 100%;
  width: 100%;
}
.slide-container {
  height: 100%;
  padding: 24px;
  text-align: center;
}
.img-wrapper img {
  max-height: 250px;
  max-width: 80%;
  object-fit: contain;
}
```

---

### MODELO 4: MENÚ LATERAL (`ion-menu`) CON AVATAR Y TOGGLE

* **IDENTIFICADOR Y TRIGGER RÁPIDO**: "Menú que se lanzará con un ion-menu-toggle con Avatar y aparecerá por la izquierda (o derecha)", "Menú lateral de la página".
* **ANATOMÍA DE ARCHIVOS**:
  * `src/app/components/menu/menu.component.ts`.
  * `src/app/components/menu/menu.component.html`.
  * `src/app/pages/materials/materials.page.html` (o la página que lo invoque).
* **RECETA PASO A PASO**:
  1. Genera el componente: `ionic g c components/menu --standalone --spec=false`.
  2. En `menu.component.html`, define `<ion-menu side="start" menuId="menu-principal" contentId="materials-page">`.
  3. Dentro del `<ion-menu>`, pon `<ion-content class="ion-padding">` con los datos (Avatar, Nombre del Alumno, Año, opciones con `<ion-menu-toggle>`).
  4. En `materials.page.ts`, importa `MenuComponent` y añádelo al array `imports`.
  5. En `materials.page.html`, inserta `<app-menu />` y asegúrate de que el `<ion-content id="materials-page">` tenga el mismo ID que el `contentId`.
  6. En el `<ion-toolbar>` de la cabecera, añade `<ion-menu-toggle slot="start" menu="menu-principal">` que envuelva el `<ion-avatar>`.
* **SNIPPET COPY-PASTE READY**:

```typescript
// src/app/components/menu/menu.component.ts
import { Component } from '@angular/core';
import { IonMenu, IonContent, IonText, IonList, IonItem, IonIcon, IonLabel, IonAvatar, IonMenuToggle } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { settings, cog } from 'ionicons/icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [IonMenu, IonContent, IonText, IonList, IonItem, IonIcon, IonLabel, IonAvatar, IonMenuToggle]
})
export class MenuComponent {
  constructor() {
    addIcons({ settings, cog });
  }
}
```

```html
<!-- src/app/components/menu/menu.component.html -->
<ion-menu side="start" menuId="menu-principal" contentId="materials-page">
  <ion-content class="ion-padding">
    <div class="ion-display-flex ion-justify-content-center ion-margin-bottom">
      <ion-avatar style="width: 80px; height: 80px;">
        <img src="assets/images/AmongUs.jpg" alt="Avatar" />
      </ion-avatar>
    </div>
    <h2 class="ion-text-center"><ion-text color="primary">Tu Nombre y Apellidos</ion-text></h2>
    <p class="ion-text-center">Año de nacimiento: 1998</p>

    <ion-list>
      <ion-menu-toggle auto-hide="true">
        <ion-item button>
          <ion-icon name="settings" color="primary" slot="start"></ion-icon>
          <ion-label>Ajustes</ion-label>
        </ion-item>
      </ion-menu-toggle>
      <ion-menu-toggle auto-hide="true">
        <ion-item button>
          <ion-icon name="cog" color="primary" slot="start"></ion-icon>
          <ion-label>Preferencias</ion-label>
        </ion-item>
      </ion-menu-toggle>
    </ion-list>
  </ion-content>
</ion-menu>
```

```html
<!-- Invocación en la cabecera de la página: materials.page.html -->
<ion-header class="ion-no-border">
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-menu-toggle menu="menu-principal">
        <ion-avatar style="width: 40px; height: 40px; cursor: pointer;">
          <img src="assets/images/AmongUs.jpg" alt="Abrir menú" />
        </ion-avatar>
      </ion-menu-toggle>
    </ion-buttons>
    <ion-title color="primary">Materials</ion-title>
  </ion-toolbar>
</ion-header>

<app-menu />

<!-- EL ID DEBE COINCIDIR CON EL contentId DEL MENÚ -->
<ion-content id="materials-page">
  ...
</ion-content>
```

---

### MODELO 5: MODAL INLINE CON TRIGGER Y `willDismiss` (RETORNO DE DATOS)

* **IDENTIFICADOR Y TRIGGER RÁPIDO**: "Botón que lanzará un modal", "Para salir del modal tendremos 2 opciones: Aceptar o Cancelar", "generará un número aleatorio", "mostrará un toast con el resultado".
* **ANATOMÍA DE ARCHIVOS**:
  * `src/app/pages/materials/materials.page.html`.
  * `src/app/pages/materials/materials.page.ts`.
  * `src/app/services/toast.service.ts`.
* **RECETA PASO A PASO**:
  1. En el HTML, pon un `<ion-button id="btn-abrir-modal">`.
  2. Debajo, pon `<ion-modal #modal trigger="btn-abrir-modal" (willDismiss)="onWillDismiss($event)">`.
  3. Dentro del modal, es OBLIGATORIO `<ng-template>`.
  4. En la cabecera del modal, pon botones con `(click)="modal.dismiss(null, 'cancel')"` y `(click)="modal.dismiss(null, 'aceptar')"`.
  5. En el TS de la página, implementa la función `onWillDismiss(event: CustomEvent)` y evalúa `event.detail.role`.
* **SNIPPET COPY-PASTE READY**:

```html
<!-- src/app/pages/materials/materials.page.html -->
<div class="ion-text-center ion-margin">
  <ion-button id="btn-abrir-modal" color="primary">
    <ion-icon name="power" slot="icon-only"></ion-icon>
  </ion-button>
</div>

<ion-modal #miModal trigger="btn-abrir-modal" (willDismiss)="onWillDismiss($event)">
  <ng-template>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="primary" (click)="miModal.dismiss(null, 'cancel')">CANCEL</ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button color="primary" (click)="miModal.dismiss(null, 'aceptar')">ACEPTAR</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding ion-text-center">
      <div class="ion-margin-top">
        <ion-button color="success" (click)="generateRandom()">RANDOM</ion-button>
      </div>
      <p class="ion-margin-top">
        Número aleatorio: <ion-text color="success" style="font-size: 24px; font-weight: bold;">{{ randomNumber() }}</ion-text>
      </p>
    </ion-content>
  </ng-template>
</ion-modal>
```

```typescript
// En materials.page.ts
randomNumber = signal<number>(0);

protected generateRandom() {
  const max = this.materials().length;
  if (max > 0) {
    this.randomNumber.set(Math.floor(Math.random() * max));
  }
}

protected onWillDismiss(event: CustomEvent) {
  const role = event.detail.role;
  if (role === 'cancel') {
    this.toastService.showToast('Cancelado', 'danger');
  } else if (role === 'aceptar') {
    const itemSeleccionado = this.materials()[this.randomNumber()];
    const nombre = itemSeleccionado ? itemSeleccionado.name : 'Desconocido';
    this.toastService.showToast(`Aceptado: ${nombre}`, 'primary');
  }
}
```

---

### MODELO 6: LISTAS INFINITAS (INFINITE SCROLL)

* **IDENTIFICADOR Y TRIGGER RÁPIDO**: "Infinite Scroll", "cargar elementos conforme el usuario baja", "bloquear el infinite scroll al llegar a 50 o última página".
* **ANATOMÍA DE ARCHIVOS**:
  * `src/app/pages/infinite/infinite.page.ts`.
  * `src/app/pages/infinite/infinite.page.html`.
* **CASO A: Simulado con Array Local (ej. bloques de 20 elementos)**
* **CASO B: Paginación Real con API (`page: number`, ej. TheMovieDB)**
* **RECETA PASO A PASO**:
  1. En el template, coloca `<ion-infinite-scroll threshold="150px" (ionInfinite)="loadData($event)">` después de `<ion-list>`.
  2. Dentro, coloca `<ion-infinite-scroll-content loadingSpinner="crescent" loadingText="Cargando más...">`.
  3. En la función `loadData(event: any)`, carga los nuevos elementos y ejecuta **SIEMPRE**: `event.target.complete()`.
  4. Si se alcanza el límite (ej. `data.length >= 50` o `page >= totalPages`), pon **`event.target.disabled = true;`** para evitar llamadas innecesarias.
* **SNIPPET COPY-PASTE READY (CASO REAL CON API)**:

```typescript
// infinite.page.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonAvatar, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-infinite',
  templateUrl: './infinite.page.html',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonAvatar, IonInfiniteScroll, IonInfiniteScrollContent, CommonModule]
})
export class InfinitePage implements OnInit {
  private dataService = inject(DataService);
  items: any[] = [];
  currentPage = 1;
  totalPages = 5;

  ngOnInit() {
    this.loadMore();
  }

  loadMore(event?: InfiniteScrollCustomEvent) {
    this.dataService.getItemsPage(this.currentPage).subscribe({
      next: (res) => {
        this.items.push(...res.results);
        this.totalPages = res.total_pages;

        // 1. COMPLETAR SIEMPRE EL EVENTO
        event?.target.complete();

        // 2. DESACTIVAR SI LLEGAMOS AL FINAL
        if (event && this.currentPage >= this.totalPages) {
          event.target.disabled = true;
        }
        this.currentPage++;
      },
      error: (err) => {
        console.error(err);
        event?.target.complete();
      }
    });
  }
}
```

```html
<!-- infinite.page.html -->
<ion-content>
  <ion-list>
    @for (item of items; track item.id) {
      <ion-item>
        <ion-label>
          <h2>{{ item.title || item.name }}</h2>
          <p>{{ item.overview }}</p>
        </ion-label>
      </ion-item>
    }
  </ion-list>

  <ion-infinite-scroll threshold="150px" (ionInfinite)="loadMore($event)">
    <ion-infinite-scroll-content
      loadingSpinner="crescent"
      loadingText="Cargando siguientes elementos...">
    </ion-infinite-scroll-content>
  </ion-infinite-scroll>
</ion-content>
```

---

### MODELO 7: PULL TO REFRESH (`ion-refresher`) + SKELETON TEXT ANIMADO

* **IDENTIFICADOR Y TRIGGER RÁPIDO**: "Arrastre hacia abajo para recargar", "Refresher y Skeleton", "animación de carga previa".
* **ANATOMÍA DE ARCHIVOS**:
  * `src/app/pages/refresher/refresher.page.html`.
  * `src/app/pages/refresher/refresher.page.ts`.
  * `src/global.scss` -> Clases de animación CSS.
* **RECETA PASO A PASO**:
  1. En `global.scss`, añade las clases de animate (`.animate__animated`, `.animate__fadeIn`).
  2. En el HTML, añade `<ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">` al inicio de `<ion-content>`.
  3. Dentro, coloca `<ion-refresher-content />`.
  4. Maneja dos estados: array vacío, estado cargando (`skeleton = true`), y lista con datos.
  5. En `doRefresh(event)`, activa `skeleton = true`, simula la carga y al terminar llama a `event.target.complete()` y pasa `skeleton = false`.
* **SNIPPET COPY-PASTE READY**:

```scss
// src/global.scss (Al final del archivo)
.animate__animated {
  animation-duration: 0.8s;
  animation-fill-mode: both;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate__fadeIn {
  animation-name: fadeIn;
}
```

```html
<!-- refresher.page.html -->
<ion-content class="ion-padding">
  <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>

  @if (items.length === 0 && !skeleton) {
    <h4 class="ion-text-center animate__animated animate__fadeIn">
      Arrastre hacia abajo para recargar
    </h4>
  } @else if (skeleton) {
    <!-- SKELETON ACTIVADO -->
    <ion-list class="animate__animated animate__fadeIn">
      @for (i of [1,2,3,4,5,6]; track i) {
        <ion-item>
          <ion-avatar slot="start">
            <ion-skeleton-text [animated]="true"></ion-skeleton-text>
          </ion-avatar>
          <ion-label>
            <h3><ion-skeleton-text [animated]="true" style="width: 50%;"></ion-skeleton-text></h3>
            <p><ion-skeleton-text [animated]="true" style="width: 80%;"></ion-skeleton-text></p>
          </ion-label>
        </ion-item>
      }
    </ion-list>
  } @else {
    <!-- DATOS REALES -->
    <ion-list class="animate__animated animate__fadeIn">
      @for (item of items; track item.id; let i = $index) {
        <ion-item>
          <ion-label>Item {{ i + 1 }}: {{ item.title || item.name }}</ion-label>
        </ion-item>
      }
    </ion-list>
  }
</ion-content>
```

```typescript
// refresher.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonRefresher, IonRefresherContent, IonList, IonItem, IonLabel, IonAvatar, IonSkeletonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-refresher',
  templateUrl: './refresher.page.html',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonRefresher, IonRefresherContent, IonList, IonItem, IonLabel, IonAvatar, IonSkeletonText, CommonModule]
})
export class RefresherPage {
  items: any[] = [];
  skeleton = false;

  doRefresh(event: any) {
    this.skeleton = true;
    setTimeout(() => {
      this.items = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, name: `Elemento ${i + 1}` }));
      this.skeleton = false;
      event.target.complete(); // <-- OBLIGATORIO
    }, 1500);
  }
}
```

---

### MODELO 8: BARRA DE BÚSQUEDA (`ion-searchbar`) + PIPE DE FILTRADO

* **IDENTIFICADOR Y TRIGGER RÁPIDO**: "Barra de búsqueda", "filtrar los elementos de la lista en tiempo real", "crear un Pipe".
* **ANATOMÍA DE ARCHIVOS**:
  * `src/app/pipes/filtro.pipe.ts`.
  * `src/app/pages/search/search.page.ts`.
  * `src/app/pages/search/search.page.html`.
* **RECETA PASO A PASO**:
  1. Genera el Pipe: `ionic g pipe pipes/filtro --standalone`.
  2. Implementa `PipeTransform` recibiendo `lista: any[]`, `texto: string`, `columna: string`.
  3. En `search.page.ts`, importa `FiltroPipe` y ponlo en `imports`.
  4. Crea la propiedad `textoBuscar: string = ''` y el método `buscar(event: any) { this.textoBuscar = event.detail.value; }`.
  5. En `search.page.html`, aplica el pipe en el bucle: `@for (item of items | filtro: textoBuscar: 'name'; track item.id)`.
* **SNIPPET COPY-PASTE READY**:

```typescript
// src/app/pipes/filtro.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro',
  standalone: true
})
export class FiltroPipe implements PipeTransform {
  transform(lista: any[], texto: string, columna: string): any[] {
    if (!lista) return [];
    if (!texto || texto.trim() === '') return lista;

    const term = texto.toLowerCase();
    return lista.filter(item => {
      const val = item[columna];
      return val ? val.toString().toLowerCase().includes(term) : false;
    });
  }
}
```

```html
<!-- src/app/pages/search/search.page.html -->
<ion-header class="ion-no-border">
  <ion-toolbar color="primary">
    <ion-title>Buscar</ion-title>
  </ion-toolbar>
  <ion-toolbar>
    <ion-searchbar
      animated="true"
      placeholder="Buscar..."
      (ionInput)="buscar($event)">
    </ion-searchbar>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <ion-list>
    @for (item of items | filtro: textoBuscar: 'name'; track item.id) {
      <ion-item>
        <ion-label>
          <h2>{{ item.name }}</h2>
          <p>{{ item.description }}</p>
        </ion-label>
      </ion-item>
    }
  </ion-list>
</ion-content>
```

```typescript
// src/app/pages/search/search.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { FiltroPipe } from '../../pipes/filtro.pipe';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonList, IonItem, IonLabel, FiltroPipe, CommonModule]
})
export class SearchPage implements OnInit {
  textoBuscar: string = '';
  items: any[] = [];

  buscar(event: any) {
    this.textoBuscar = event.detail.value || '';
  }
  ngOnInit() {}
}
```

---

### MODELO 9: SEGMENTOS (`ion-segment`) CON QUERY PARAMS Y COMPONENTE HIJO

* **IDENTIFICADOR Y TRIGGER RÁPIDO**: "Segment", "filtrar por categoría", "actualizar la URL con query param", "componente hijo con `@Input`".
* **ANATOMÍA DE ARCHIVOS**:
  * `src/app/pages/segments/segments.page.ts` (Padre).
  * `src/app/pages/segments/segments.page.html`.
  * `src/app/components/segment-content/segment-content.component.ts` (Hijo).
  * `src/app/components/segment-content/segment-content.component.html`.
* **RECETA PASO A PASO**:
  1. En `segments.page.html`, define `<ion-segment [value]="currentCategory" (ionChange)="segmentChanged($event)">`.
  2. En `segmentChanged(event)`, navega con el Router: `this.router.navigate([], { queryParams: { category }, queryParamsHandling: 'merge' })`.
  3. Pasa el valor al componente hijo: `<app-segment-content [category]="currentCategory" />`.
  4. En el hijo, recibe `@Input() category!: string` e implementa `ngOnChanges(changes: SimpleChanges)` para llamar a la API cuando cambie el input.
* **SNIPPET COPY-PASTE READY**:

```typescript
// segments.page.ts (Padre)
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonSegment, IonSegmentButton, IonLabel, IonContent } from '@ionic/angular/standalone';
import { SegmentContentComponent } from '../../components/segment-content/segment-content.component';

@Component({
  selector: 'app-segments',
  templateUrl: './segments.page.html',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonSegment, IonSegmentButton, IonLabel, IonContent, SegmentContentComponent]
})
export class SegmentsPage {
  private router = inject(Router);
  categories = [
    { value: 'materials', label: 'Materiales' },
    { value: 'monsters', label: 'Monstruos' },
    { value: 'equipment', label: 'Equipamiento' }
  ];
  currentCategory = 'materials';

  segmentChanged(event: any) {
    const cat = event.detail.value;
    if (cat) {
      this.currentCategory = cat;
      this.router.navigate([], {
        queryParams: { category: cat },
        queryParamsHandling: 'merge'
      });
    }
  }
}
```

```html
<!-- segments.page.html -->
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>Categorías</ion-title>
  </ion-toolbar>
  <ion-toolbar>
    <ion-segment [value]="currentCategory" (ionChange)="segmentChanged($event)">
      @for (c of categories; track c.value) {
        <ion-segment-button [value]="c.value">
          <ion-label>{{ c.label }}</ion-label>
        </ion-segment-button>
      }
    </ion-segment>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <app-segment-content [category]="currentCategory"></app-segment-content>
</ion-content>
```

```typescript
// segment-content.component.ts (Hijo)
import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { IonList, IonItem, IonLabel, IonSpinner } from '@ionic/angular/standalone';
import { ZeldaService } from '../../services/zelda.service';

@Component({
  selector: 'app-segment-content',
  template: `
    @if (loading) {
      <div class="ion-text-center ion-padding"><ion-spinner></ion-spinner></div>
    } @else {
      <ion-list>
        @for (item of items; track item.id) {
          <ion-item>
            <ion-label>{{ item.name }}</ion-label>
          </ion-item>
        }
      </ion-list>
    }
  `,
  standalone: true,
  imports: [IonList, IonItem, IonLabel, IonSpinner]
})
export class SegmentContentComponent implements OnChanges {
  @Input() category!: string;
  private api = inject(ZeldaService);
  items: any[] = [];
  loading = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['category'] && this.category) {
      this.fetchData(this.category);
    }
  }

  fetchData(cat: string) {
    this.loading = true;
    this.api.getByCategory(cat).subscribe({
      next: (res: any) => {
        this.items = res.data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
```

---

### MODELO 10: SERVICIO DE TOAST CENTRALIZADO (`ToastService`)

* **IDENTIFICADOR Y TRIGGER RÁPIDO**: "mostrar un toast con el nombre...", "toast de confirmación", "notificación al usuario".
* **ANATOMÍA DE ARCHIVOS**:
  * `src/app/services/toast.service.ts`.
* **RECETA PASO A PASO**:
  1. Genera el servicio: `ionic g s services/toast --skip-tests`.
  2. Inyecta `ToastController` con `inject(ToastController)`.
  3. Crea el método `async showToast(message: string, color: string = 'primary', duration: number = 2000)`.
  4. Crea la instancia con `.create(...)` y espera a `.present()`.
* **SNIPPET COPY-PASTE READY**:

```typescript
// src/app/services/toast.service.ts
import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly toastCtrl = inject(ToastController);

  async showToast(message: string, color: string = 'primary', duration: number = 2000) {
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration,
      position: 'bottom',
      buttons: [{ text: 'OK', role: 'cancel' }]
    });
    await toast.present();
  }
}
```

---

### MODELO 11: DIÁLOGO ALERT CON INPUTS / RADIOBUTTONS

* **IDENTIFICADOR Y TRIGGER RÁPIDO**: "Alert con Input", "preguntar al usuario su nombre mediante alert", "diálogo con opciones de selección".
* **SNIPPET COPY-PASTE READY**:

```typescript
// En tu .page.ts
import { Component, inject } from '@angular/core';
import { AlertController } from '@ionic/angular/standalone';

@Component({ ... })
export class MiPagina {
  private alertCtrl = inject(AlertController);

  async abrirAlertConInput() {
    const alert = await this.alertCtrl.create({
      header: 'Identificación',
      subHeader: 'Ingrese su nombre de usuario',
      inputs: [
        {
          name: 'usuario',
          type: 'text',
          placeholder: 'Escribe aquí tu nombre'
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            console.log('Nombre ingresado:', data.usuario);
          }
        }
      ]
    });
    await alert.present();
  }
}
```

---

### MODELO 12: MULTILENGUAJE CON NGX-TRANSLATE Y ACTION SHEET

* **IDENTIFICADOR Y TRIGGER RÁPIDO**: "Multilenguaje", "traducción", "ActionSheet para cambiar de idioma".
* **SNIPPET COPY-PASTE READY**:

```typescript
// src/app/services/translate-config.service.ts
import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class TranslateConfigService {
  private translate = inject(TranslateService);

  initLanguage() {
    const saved = localStorage.getItem('lang') || this.translate.getBrowserLang() || 'es';
    this.translate.setDefaultLang(saved);
    this.translate.use(saved);
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
}
```

```typescript
// ActionSheet para selector de idioma:
async cambiarIdioma() {
  const sheet = await this.actionSheetCtrl.create({
    header: 'Selecciona Idioma',
    buttons: [
      { text: 'Español', handler: () => this.translateService.setLanguage('es') },
      { text: 'English', handler: () => this.translateService.setLanguage('en') },
      { text: 'Cancelar', role: 'cancel' }
    ]
  });
  await sheet.present();
}
```

---

# 4. SECCIÓN CHEAT-SHEET RÁPIDO (CÓDIGO FRECUENTE)

### A. Registro de Iconos Habituales (`addIcons`)

```typescript
// En el constructor de *.page.ts o app.component.ts:
import { addIcons } from 'ionicons';
import { power, settings, cog, search, close, refresh, arrowBack, trash, add, menu, flame } from 'ionicons/icons';

constructor() {
  addIcons({ power, settings, cog, search, close, refresh, arrowBack, trash, add, menu, flame });
}
```

### B. Decorador @Component Standalone Completo

```typescript
@Component({
  selector: 'app-mi-pagina',
  templateUrl: './mi-pagina.page.html',
  styleUrls: ['./mi-pagina.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
    IonList, IonItem, IonLabel, IonAvatar, IonIcon, IonModal
  ]
})
export class MiPaginaPage {}
```

### C. Comandos CLI Imprescindibles para la Terminal

```bash
# Crear página standalone sin archivo de test:
ionic g page pages/materials --spec=false

# Crear servicio sin tests:
ionic g s services/zelda --skip-tests

# Crear componente standalone:
ionic g c components/menu --standalone --spec=false

# Crear pipe standalone:
ionic g pipe pipes/filtro --standalone
```

---

# 5. APARTADO DE DISEÑOS

### DISEÑO PARA QUE SOLO SE VEA UNA LINEA EN LA DESCRIPCION DE CADA OBJETO

* **IDENTIFICADOR Y TRIGGER RÁPIDO**: "Diseño para que solo se vea una línea en la descripción de cada objeto", "truncar texto", "cortar texto con puntos suspensivos", "line-clamp".
* **ANATOMÍA DE ARCHIVOS**:
  * `src/app/pages/inicio/inicio.page.scss` (o el `.scss` de la página correspondiente).
  * `src/app/pages/inicio/inicio.page.html`.
* **RECETA PASO A PASO**:
  1. En el archivo `.scss` de la página, añade la regla con el selector de clase `.descripcion`.
  2. Define `-webkit-line-clamp: 1;` con `display: -webkit-box;` y `-webkit-box-orient: vertical;`.
  3. Añade `overflow: hidden;` y `text-overflow: ellipsis;` para forzar el corte con puntos suspensivos (...).
  4. En el HTML asigna `class="descripcion"` al párrafo de la descripción dentro de `ion-label`:
     `<p class="descripcion">{{ agente.description }}</p>`.

* **SNIPPET COPY-PASTE READY**:

```scss
// src/app/pages/inicio/inicio.page.scss
.descripcion {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

```html
<!-- src/app/pages/inicio/inicio.page.html -->
<ion-label class="ion-margin">
  <h1>{{ agente.displayName }}</h1>
  <h2><p class="descripcion">{{ agente.description }}</p></h2>
</ion-label>
```

---

# 6. CHECKLIST DE ENTREGA FINAL DEL EXAMEN (3 MINUTOS ANTES)

- [ ] **1. `package.json`**: ¿Está tu nombre en `"author"` y la `"version"` definida?
- [ ] **2. Consola del Navegador (F12)**: ¿Está limpia de errores rojos?
- [ ] **3. `complete()` en Eventos**: ¿Tienen todos los Infinite Scroll y Refreshers su `event.target.complete()`?
- [ ] **4. Conexión del Menú**: ¿El `contentId` del menú coincide exactamente con el `id` del contenido?
- [ ] **5. Diapositivas**: Si usas Swiper, ¿está `register()` en `app.component.ts` y `CUSTOM_ELEMENTS_SCHEMA` en la página?
- [ ] **6. Grabación de Pantalla**: ¿Se está grabando la sesión correctamente según las instrucciones del centro?

