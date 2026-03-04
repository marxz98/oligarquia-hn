# OLIGARQUÍA HN — Radiografía del Poder en Honduras

Portal de investigación ciudadana que documenta las redes de poder de la oligarquía hondureña: familias, empresas, vínculos políticos, medios de comunicación y conexiones con el crimen organizado.

## Estructura del Proyecto

```
oligarquia-hn/
├── index.html              ← HTML shell (carga estilos y scripts)
├── css/
│   ├── theme.css           ← Variables de tema (modo claro/oscuro)
│   └── main.css            ← Layout, componentes, responsive
├── js/
│   ├── data.js             ← Base de datos (105 personas, 111 empresas, 13 grupos...)
│   ├── utils.js            ← Helpers: escape, avatares, badges, contadores
│   ├── theme.js            ← Toggle modo claro/oscuro
│   ├── auth.js             ← Login/logout admin
│   ├── modals.js           ← Sistema de modales + formularios CRUD
│   ├── app.js              ← Navegación, estado, inicialización
│   └── render/
│       ├── dashboard.js    ← Vista principal con estadísticas
│       ├── personas.js     ← Lista y detalle de personas
│       ├── grupos.js       ← Lista y detalle de grupos familiares
│       ├── empresas.js     ← Lista y detalle de empresas
│       ├── partidos.js     ← Lista y detalle de partidos políticos
│       ├── medios.js       ← Lista y detalle de medios de comunicación
│       ├── carteles.js     ← Lista y detalle de carteles
│       └── network.js      ← Grafo de red D3.js
└── README.md
```

## Admin

- Login: `admin` / `necios2026`
- Permite crear, editar y eliminar registros de todas las entidades

## Desarrollo

No requiere build tools. Abrir `index.html` en el navegador o servir con:

```bash
python3 -m http.server 8000
```

## Deploy

GitHub Pages: Settings → Pages → Deploy from branch `main`
