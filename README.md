# OLIGARQUÍA HN — Radiografía del Poder en Honduras

Portal de investigación ciudadana con base de datos PostgreSQL persistente via Supabase.

## Setup Rápido

### 1. Crear proyecto en Supabase (gratis)
- Ir a [supabase.com](https://supabase.com) → New Project
- Copiar **Project URL** y **anon public key** de Settings → API

### 2. Configurar credenciales
Editar `js/supabase.js` y reemplazar:
```js
const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOi...tu-key';
```

### 3. Crear tablas
En Supabase Dashboard → SQL Editor → ejecutar:
1. `sql/01-schema.sql` (crea tablas + seguridad)
2. `sql/02-migration.sql` (importa los 248 registros)

### 4. Crear usuario admin
En Supabase Dashboard → Authentication → Users → Add user:
- Email + contraseña de tu preferencia

### 5. Deploy
Subir a GitHub y activar Pages, o servir localmente:
```bash
python3 -m http.server 8000
```

## Estructura

```
├── index.html              ← Shell HTML
├── css/
│   ├── theme.css           ← Modo claro/oscuro
│   └── main.css            ← Layout y componentes
├── js/
│   ├── supabase.js         ← Configuración Supabase
│   ├── data.js             ← Carga datos desde PostgreSQL
│   ├── utils.js            ← Helpers reutilizables
│   ├── theme.js            ← Toggle de tema
│   ├── auth.js             ← Login/logout via Supabase Auth
│   ├── modals.js           ← Formularios CRUD (persistentes)
│   ├── app.js              ← Navegación e inicialización
│   └── render/             ← Vistas por sección
│       ├── dashboard.js
│       ├── personas.js
│       ├── grupos.js
│       ├── empresas.js
│       ├── partidos.js
│       ├── medios.js
│       ├── carteles.js
│       └── network.js
└── sql/
    ├── 01-schema.sql       ← Esquema PostgreSQL
    └── 02-migration.sql    ← Datos iniciales
```

## Stack
- **Frontend:** HTML + CSS + JavaScript vanilla
- **Backend:** Supabase (PostgreSQL + REST API + Auth)
- **Visualización:** D3.js (grafo de red)
- **Hosting:** GitHub Pages (estático)
