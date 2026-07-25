# ESTADO — FORGE

_Actualizado: 25/07/2026, creación inicial del sistema de agentes._

## Tarea activa

**Investigar y reparar el CRM.** Encargo de Nexo (ver
`Sistema/Comunicacion/MENSAJES.md`, 25/07/2026): determinar qué pasó con
`CRM/CRM_Synergy.html` y `CRM/Datos de Clientes/Clientes_Municipios_Maestro.csv`
(documentados como activos, pero solo existen versiones `_prev_` archivadas),
y dejar el CRM en un estado consistente con su propia documentación —
regenerando ambos archivos desde los CSV fuente si esa es la vía más segura,
sin dar el asunto por resuelto sin confirmar con Alex.

## Bloqueos

Ninguno para empezar la investigación. Puede que surja la necesidad de que
Alex confirme si hay una versión más reciente de esos archivos en su PC
antes de decidir "regenerar desde cero" vs. "recuperar una copia existente".

## Próximo paso sugerido

1. Confirmar si Alex tiene copia local de `CRM_Synergy.html` o
   `Clientes_Municipios_Maestro.csv` más reciente que las archivadas.
2. Si no, regenerar ambos desde `Clientes_Municipios_Maestro_prev_20260721.csv`
   + los 4 CSV de Mapeo (incluyendo Andalucía, que falta reconciliar).
3. Dejar el resultado documentado en `CRM/Documentación/ESTADO_CRM.md` y
   una entrada en `Sistema/REGISTRO_ACTIVIDAD.md`.
