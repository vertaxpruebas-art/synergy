# Fuentes locales (Inter + Geist Mono)

La app carga las fuentes desde aquí (`fonts/fonts.css`) en vez de Google Fonts,
para funcionar 100% offline. Esta carpeta no incluye los `.woff2` porque este
entorno de desarrollo no tiene salida a internet — descárgalos tú una vez, en
tu propio ordenador:

```bash
./scripts/descargar-fuentes.sh
```

Eso deja aquí `InterVariable.woff2` y `GeistMono-Variable.woff2`.

## Si el script falla (URL caída/movida)

Descarga manual:

- **Inter** (variable, todos los pesos en un archivo): https://rsms.me/inter/ → botón "Download" → dentro del zip, usa `Inter/InterVariable.woff2` → renómbralo/colócalo aquí.
- **Geist Mono** (variable): https://vercel.com/font (o `npm view geist` / paquete npm `geist`) → dentro de `dist/fonts/geist-mono/`, copia `GeistMono-Variable.woff2` aquí.

Nombres finales esperados en esta carpeta:

```
fonts/InterVariable.woff2
fonts/GeistMono-Variable.woff2
```

## Si no descargas nada

No pasa nada grave: `fonts.css` sigue apuntando a estos archivos, pero si no
existen el navegador simplemente usa el fallback definido en el HTML
(`-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` / `monospace`).
La app funciona igual, solo que con la tipografía del sistema en vez de
Inter/Geist Mono.
