#!/usr/bin/env bash
# Descarga Inter y Geist Mono (fuentes variables, .woff2) para uso 100% offline
# en la app. Ejecútalo UNA VEZ en tu ordenador (con conexión a internet), antes
# de empaquetar o lanzar la app. Este entorno de desarrollo remoto no tiene
# salida a internet para descargarlas por ti.
set -euo pipefail
cd "$(dirname "$0")/../fonts"

echo "Descargando Inter (variable)..."
curl -fL -o InterVariable.woff2 \
  "https://github.com/rsms/inter/raw/master/docs/font-files/InterVariable.woff2"

echo "Descargando Geist Mono (variable)..."
curl -fL -o GeistMono-Variable.woff2 \
  "https://github.com/vercel/geist-font/raw/main/packages/next/dist/fonts/geist-mono/GeistMono-Variable.woff2"

echo "Listo. Archivos en $(pwd):"
ls -la InterVariable.woff2 GeistMono-Variable.woff2
