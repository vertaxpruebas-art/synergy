# Calculadora ZBE — app de escritorio (Electron)

Empaqueta `app/Calculadora_ZBE_Interactiva.html` (diseño y fórmulas sin
modificar) como app nativa de Linux, con icono propio, ventana propia y
persistencia local de los valores introducidos.

## 1. Requisitos

- Node.js 18+ y npm, instalados en tu ordenador (Linux).

## 2. Instalación

```bash
cd zbe-calculadora-app
npm install
./scripts/descargar-fuentes.sh   # opcional pero recomendado, ver fonts/README.md
```

## 3. Ejecutar en modo desarrollo

```bash
npm start
```

Se abre la ventana de la app. Cambia cualquier valor: al cerrar y volver a
abrir la app, esos valores siguen ahí (se guardan en
`~/.config/Calculadora ZBE/zbe-calculadora-datos.json`).

## 4. Generar el instalable/ejecutable

```bash
npm run dist:linux
```

Esto crea en `dist/`:

- **`Calculadora ZBE-1.0.0.AppImage`** — ejecutable único, portátil. Dale
  permiso de ejecución (`chmod +x`) y ábrelo con doble clic (o
  `clic derecho → Propiedades → Permisos → "Permitir ejecutar como
  programa"` en la mayoría de gestores de archivos). No requiere
  instalación.
- **`calculadora-zbe_1.0.0_amd64.deb`** — instalable para Debian/Ubuntu y
  derivadas. Doble clic lo abre en el instalador de paquetes de tu sistema,
  o `sudo apt install ./calculadora-zbe_1.0.0_amd64.deb`. Tras instalarlo
  aparece como "Calculadora ZBE" en el menú de aplicaciones, con su propio
  icono.

## 5. El icono

Ya está generado en `build/icon.png` y `build/icons/` (a partir del logo
"SY" que proporcionaste, recortado y en varios tamaños: 16 a 1024 px). Si
quieres cambiarlo, sustituye esos PNG (fondo transparente, cuadrado) y
vuelve a ejecutar `npm run dist:linux`.

## 6. Privacidad

- No hay llamadas a servidores externos ni analítica: `main.js` no abre
  ninguna URL remota, `webPreferences` tiene `nodeIntegration: false` /
  `contextIsolation: true` / `sandbox: true`, y la única comunicación es
  entre la ventana y el proceso principal (para guardar/leer los valores
  localmente).
- Con las fuentes descargadas (paso 2), la app no hace ninguna petición de
  red en ningún momento.

## Estructura

```
zbe-calculadora-app/
├── package.json              # config Electron + electron-builder (target Linux)
├── main.js                   # ventana, icono, persistencia (electron-store)
├── preload.js                # puente seguro window.zbeStore.get()/set()
├── app/
│   └── Calculadora_ZBE_Interactiva.html   # tu calculadora, sin cambios visuales
├── fonts/                    # Inter + Geist Mono (autoalojadas, ver fonts/README.md)
├── build/
│   ├── icon.png               # icono base 1024×1024
│   └── icons/                 # 16…1024 px, usado por electron-builder para AppImage/deb
└── scripts/
    └── descargar-fuentes.sh   # helper para dejar la app 100% offline
```
