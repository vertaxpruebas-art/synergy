# MEMORIA — NEXO

Índice compacto de Synergy. No es el contenido, es el mapa de dónde está
cada cosa y qué estado tiene. Se actualiza tras cambios importantes, no en
cada mensaje. Origen: `AUDITORIA_MIGRACION.md` (25/07/2026) y
`ARQUITECTURA_AGENTES.md`.

## Qué existe y quién es responsable

| Área | Carpeta | Responsable | Estado |
|---|---|---|---|
| Municipios/ZBE/territorio | `Mapeo/` | Atlas | Activo, 4 CCAA (Cataluña, C. Valenciana, Región de Murcia, Andalucía) |
| Cálculo/financiación | `Calculadora/` | Cifra | Activo pero desincronizado del Mapeo actual (ver riesgos) |
| CRM/pipeline comercial | `CRM/` | Forge | ⚠️ Roto — ver riesgo crítico abajo |
| Web/landing | `Web/` | Forge | Hito 1 completado (2 versiones HTML), pendiente de dominio |
| Documentación general | `Documentación/` | Nadie asignado formalmente; desactualizada en varios puntos | Ver riesgos |
| Gobernanza | `Gobernanza/` | Nexo (yo) | 3 preguntas de `MALETA_ALEX_001.md`; la de STATUS_OPERATIVO ya resuelta (25/07: versión ligera adoptada) |
| Memoria/dossier | `Memoria/Memoria_Synergy.html` | — | Estable desde 14/07 |
| Presentación | `Presentación/` | — | Vacía desde el origen |

## Fuente de verdad

Decisión de Alex (25/07/2026): el **PC local de Alex** es la fuente de
verdad operativa. Dropbox pasa a copia de seguridad/sincronización. El repo
de GitHub `vertaxpruebas-art/synergy` contiene código/prototipos
(calculadoras adicionales) cuyo origen y propósito **no están aclarados
todavía** con Alex.

## Riesgos abiertos (de la auditoría, sin resolver)

1. **CRÍTICO — CRM roto.** `CRM_Synergy.html` y
   `Clientes_Municipios_Maestro.csv` (210 contactos) no existen en su ruta
   activa documentada — solo hay versiones `_prev_` archivadas. Asignado a
   Forge como primera tarea (25/07/2026).
2. **Tres copias de la calculadora sin reconciliar**: Dropbox (oficial,
   3 pestañas, 21/07), más dos en GitHub (`calculadora-zbe-pro`,
   `zbe-calculadora-app`) sin relación documentada. Cifra debe aclarar con
   Alex antes de tocar ninguna.
3. **Calculadora desincronizada del Mapeo**: sigue leyendo el CSV maestro
   unificado antiguo (archivado), no los 4 CSV por comunidad autónoma.
4. **CRM desincronizado del Mapeo**: el CRM se pobló con 105 municipios (3
   CCAA); Andalucía se añadió al Mapeo después y no consta que esté en el
   CRM.
5. Documentación desactualizada: `CONTEXTO_MAESTRO.md`, `ARQUITECTURA.md`,
   `LEEME.txt` y `ESTADO_ACTUAL.md` no reflejan el estado real (detalle en
   `AUDITORIA_MIGRACION.md`, sección 7).

## Decisiones vigentes que no debo perder de vista

- Nunca tocar la carpeta "Synergy" de Google Drive del padre de Alex.
- Nunca inventar datos de contacto ("No encontrado" si no se localiza).
- Archivar en vez de borrar (`_prev_YYYYMMDD`).
- Dropbox fue fuente única hasta el 25/07; ahora el PC local la sustituye.
- CRM es la fuente única de seguimiento comercial (20/07).
- Web = HTML estático, no Webflow (20/07).
- Gobernanza: versión ligera de `STATUS_OPERATIVO.md` adoptada, sin el
  resto del marco BITÁCORA del padre de Alex (25/07).

## Preguntas de gobernanza aún abiertas (de MALETA_ALEX_001.md)

1. ¿Repartir roles de BITÁCORA (pensados para varias IAs distintas) entre
   nuestros propios chats/agentes, aunque aquí todo sea Claude? — sin
   responder.
2. ¿El sistema del padre y el nuestro deben quedar completamente separados
   siempre, o hay partes donde sí conviene que se hablen? — sin responder.
