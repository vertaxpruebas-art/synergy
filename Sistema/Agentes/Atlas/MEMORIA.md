# MEMORIA — ATLAS

Compacta. Origen: `AUDITORIA_MIGRACION.md` (25/07/2026), secciones 1-9.

## Qué existe hoy en Mapeo/

Cuatro archivos CSV activos, uno por comunidad autónoma, en `Mapeo/` (raíz,
sin sufijo `_prev_`):

- `Mapeo_Municipios_ZBE_Cataluna.csv` — 70 municipios.
- `Mapeo_Municipios_ZBE_ComunidadValenciana.csv` — 15 municipios (piloto).
- `Mapeo_Municipios_ZBE_RegionMurcia.csv` — ~20 municipios.
- `Mapeo_Municipios_ZBE_Andalucia.csv` — añadido más tarde (20-21/07), no
  reflejado todavía en el CRM ni en `ESTADO_ACTUAL.md`.

Estructura de columnas (todos los archivos por igual, desde el 18/07):
`Municipio, Comarca, Habitantes, Clasificación ZBE (Obligado/Recomendable),
Alcalde/Alcaldesa, Email, Teléfono, Responsable de Movilidad, Email
Movilidad, Teléfono Movilidad, Estado, Notas, Fuente, Tipo de fuente, Fecha
de actualización`.

`Mapeo/Archivo/` tiene 11 versiones anteriores, incluido el antiguo CSV
maestro unificado (`Mapeo_Municipios_ZBE_UNIFICADO_ARCHIVADO_20260718.csv`)
— histórico, no tocar.

## Clasificación ZBE — criterio (comercial, no legal)

- **Obligado**: >50.000 habitantes.
- **Recomendable**: 20.000-50.000 habitantes.
- Los municipios catalanes <20.000 hab. incluidos por decisión expresa de
  Alex (15/07) están marcados "Recomendable" con nota explícita de que es
  ampliación comercial, no obligación legal — verificar caso a caso antes
  de usarlo en una negociación real.

## Estados posibles del campo "Estado" (lista cerrada)

Pendiente, Encontrado, Faltan datos, Revisado, Contactado, Descartado, No
localizado. (El valor antiguo "Pre-visita" se migró a "Encontrado" dejando
constancia en Notas.)

## Pendiente conocido (de PENDIENTES.md del proyecto)

- Añadir las 11 grandes capitales catalanas >100.000 hab. (Barcelona,
  L'Hospitalet, Terrassa, Badalona, Sabadell, Lleida, Tarragona, Mataró,
  Santa Coloma de Gramenet, Reus, Girona) — pendiente de decisión de Alex.
- Completar contactos "No encontrado" en Comunitat Valenciana (Alicante,
  Torrent, Orihuela, Gandía, Paterna, Benidorm, entre otros).
- Decidir si ampliar a más comunidades autónomas — Alex quería consultarlo
  con su padre primero.
- Actualizar `LEEME.txt` de la raíz del proyecto con la estructura actual
  (pendiente desde el 18/07, sigue sin hacerse).

## Dependencia crítica con Cifra

La Calculadora (Cifra) **todavía no lee** estos 4 archivos — sigue
apuntando en su código a la URL del antiguo CSV maestro unificado, que está
archivado y ya no se actualiza. No tocar la estructura de columnas sin
avisar a Cifra primero.
