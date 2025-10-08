# 🚀 Deploy en GitHub Pages

Este documento explica cómo deployar el frontend de ProjectManagerMind IA en GitHub Pages.

## 📋 Configuración realizada

### 1. Dependencias instaladas
```bash
npm install --save-dev gh-pages
```

### 2. Scripts agregados al package.json
```json
{
  "homepage": "https://edummorenolp.github.io/ProjectManagerMind-IA",
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist",
    "predeploy": "npm run build"
  }
}
```

### 3. Configuración de Vite
- Base URL configurada para GitHub Pages
- Optimizaciones de build
- Chunks manuales para mejor performance

### 4. GitHub Actions
- Workflow automático en `.github/workflows/deploy.yml`
- Deploy automático en push a main/master
- Deploy manual disponible desde GitHub Actions

## 🎯 Comandos de deploy

### Deploy manual desde local
```bash
cd frontend
npm run deploy
```

### Deploy automático
El deploy se ejecuta automáticamente cuando:
- Se hace push a la rama `main` o `master`
- Se ejecuta manualmente desde GitHub Actions

## 📂 Estructura de archivos

```
frontend/
├── public/
│   └── .nojekyll          # Evita procesamiento Jekyll
├── dist/                  # Archivos generados (no versionar)
├── package.json           # Scripts y homepage configurados
├── vite.config.js         # Configuración para GitHub Pages
└── ...

.github/
└── workflows/
    └── deploy.yml         # Workflow de GitHub Actions
```

## 🔧 Configuración de GitHub Pages

1. Ve a tu repositorio en GitHub
2. Settings → Pages
3. Source: "Deploy from a branch"
4. Branch: `gh-pages` 
5. Folder: `/ (root)`

Alternativamente, si usas GitHub Actions:
1. Settings → Pages
2. Source: "GitHub Actions"

## 🌐 URLs

- **Desarrollo**: http://localhost:5173
- **Preview**: Después de `npm run build && npm run preview`
- **Producción**: https://edummorenolp.github.io/ProjectManagerMind-IA

## ⚙️ Variables de entorno

Para producción, asegúrate de configurar las variables de entorno necesarias:

```bash
# En desarrollo
VITE_API_URL=http://localhost:3000

# En producción (configurar en GitHub Secrets si es necesario)
VITE_API_URL=https://tu-backend-url.com
```

## 🐛 Troubleshooting

### Problema: Páginas en blanco después del deploy
- **Solución**: Verifica que el `base` en `vite.config.js` sea correcto
- **Causa**: Rutas incorrectas en GitHub Pages

### Problema: 404 en rutas de React Router
- **Solución**: GitHub Pages no maneja SPAs automáticamente
- **Workaround**: Usa hash router o configura redirects

### Problema: Assets no se cargan
- **Solución**: Verifica que las rutas sean relativas y el `base` correcto

## 📝 Notas importantes

1. **Rama gh-pages**: Se crea automáticamente, no editarla manualmente
2. **Caché**: GitHub Pages puede tardar unos minutos en actualizar
3. **HTTPS**: GitHub Pages fuerza HTTPS automáticamente
4. **Dominio personalizado**: Configurable en Settings → Pages
5. **Límites**: 1GB de almacenamiento, 100GB de ancho de banda/mes

## 🔄 Flujo de trabajo recomendado

1. Desarrolla en rama `feature/*`
2. Haz merge a `main` 
3. El deploy se ejecuta automáticamente
4. Verifica en la URL de producción

¡Deploy configurado exitosamente! 🎉