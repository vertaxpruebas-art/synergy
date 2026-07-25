# MEMORIA — CIFRA

Compacta. Origen: `AUDITORIA_MIGRACION.md` (25/07/2026).

## Qué existe hoy en Calculadora/

- `Calculadora_ZBE_Interactiva.html` — la versión oficial (Dropbox, 21/07),
  3 pestañas: Calculadora, Resumen general, Municipios. La pestaña
  "Seguimiento CRM" se retiró el 21/07 (Alex construye eso aparte, en
  `CRM/`, con Forge).
- `Calculadora_Financiacion_ZBE.csv` — foto estática de ejemplo, no
  interactiva.
- `Archivo/` — 2 versiones previas.

## Cómo calcula (lógica, sin código)

- Coste total = (nº puntos de acceso/cámaras × coste por punto) + coste
  plataforma/software + coste señalización/obra civil.
- Subvención = coste total × % editable (varía por convocatoria).
- Desembolso neto = coste total − subvención.
- Financiación a plazos: fórmula estándar tipo préstamo (capital + interés,
  plazo en años, tipo de interés) — igual que PAGO/PMT de Excel.

## De dónde saca los datos de municipios (importante, y roto)

Cascada con capas de seguridad: (1) intenta descargar en vivo un CSV desde
una URL fija en el código (`MAPEO_CSV_URL`), (2) si falla, usa la última
copia en `localStorage` del navegador, (3) si tampoco hay, usa una lista de
emergencia de 60 municipios catalanes incrustada en el propio HTML.

**El problema**: `MAPEO_CSV_URL` sigue apuntando al antiguo CSV maestro
unificado, que Atlas archivó el 18/07 y ya no se actualiza. La Calculadora
no lee hoy ninguno de los 4 CSV activos por comunidad autónoma. Esto está
reconocido en la documentación del proyecto como bloqueado "a la espera de
que se estabilice" el Mapeo — pero el Mapeo lleva ya 4 comunidades
autónomas activas sin que se haya hecho la adaptación.

## Riesgo abierto — tres copias de la calculadora

1. Dropbox `Calculadora/Calculadora_ZBE_Interactiva.html` (oficial, 21/07,
   3 pestañas).
2. GitHub `zbe-calculadora-app/app/Calculadora_ZBE_Interactiva.html`
   (wrapper Electron, 461 líneas, título "Calculadora de Financiación ZBE
   — SYNERGY").
3. GitHub `calculadora-zbe-pro/index.html` ("Calculadora ZBE PRO", 993
   líneas, rediseño con paleta y funciones propias — comparador, gráfico de
   desglose, export CSV).

Ninguna de las dos de GitHub está mencionada en la documentación de
Dropbox. No se sabe si son intencionadas, duplicado de trabajo, o un
intento sin documentar de responder a la petición de Alex (21/07) de tener
la Calculadora en archivos locales de su PC.

## Pendiente conocido

- Precios reales de Synergy (a la espera del padre de Alex).
- Adaptar la lectura del Mapeo a los 4 CSV por comunidad autónoma.
- Aclarar con Alex el estatus de las 2 copias de GitHub.
