# Calculadora ZBE PRO

Herramienta independiente (no toca la app Electron de `zbe-calculadora-app/`),
en HTML autocontenido de un solo fichero: `index.html`. Ábrelo con doble
clic o sírvelo con cualquier servidor estático — no tiene dependencias
externas, ni siquiera de fuentes (Public Sans + IBM Plex Mono van
embebidas como `@font-face` en base64).

## Qué añade sobre la calculadora original

- **Rediseño visual claro**: paleta propia (verde-azulado + ocre), tipografía
  Public Sans (texto) + IBM Plex Mono (cifras), distinta del tema oscuro de
  la app de escritorio.
- **Más partidas de coste**: cámaras LPR, sensores ambientales, plataforma +
  centro de control, señalización/obra, estudio de movilidad / proyecto
  técnico, campaña de comunicación pública, IVA opcional (21%).
- **Tramo poblacional afinado**: distingue obligatoriedad plena (>50.000 hab.
  o capital de provincia) de la obligatoriedad condicionada a superar
  límites de calidad del aire (20–50.000 hab.), según Ley 7/2021 y
  RD 1052/2022.
- **Líneas de financiación** con % orientativo por fuente: PRTR/Next
  Generation EU (hasta 90%, según convocatoria del Ministerio), FEDER,
  Diputación provincial, Generalitat/CCAA, fondos propios — siempre editable
  a mano.
- **Guardar varias simulaciones** (una por municipio) en `localStorage` del
  navegador — nada sale de tu equipo.
- **Comparador**: marca 2+ simulaciones en la barra lateral para ver un
  gráfico de barras agrupado (coste total / desembolso / coste Año 1) y una
  tabla comparativa.
- **Gráfico de desglose de costes** por partida (Canvas, sin librerías).
- **Exportar CSV**: de la simulación actual, o de la comparativa completa
  (separador `;`, con BOM UTF-8 para abrir bien en Excel en español).

## Fuentes de los datos regulatorios

- Ley 7/2021, de 20 de mayo, de cambio climático y transición energética.
- Real Decreto 1052/2022, de 27 de diciembre (zonas de bajas emisiones).
- Programa de ayudas PRTR a municipios para ZBE (Ministerio de Transportes /
  Vivienda y Agenda Urbana) — financiación de hasta el 90% de costes
  elegibles.

Los % de subvención y umbrales son **orientativos**: cada convocatoria y
municipio tiene sus propias condiciones — verificar siempre caso por caso.
