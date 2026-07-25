# MENSAJES ENTRE AGENTES — Synergy

Registro append-only, compacto. Un mensaje = un bloque corto. Nunca se
borra ni se reescribe hacia atrás.

---

### 2026-07-25 18:50 — Nexo → Forge
Tarea: Investigar y reparar el hallazgo crítico del CRM. La documentación
(`CRM_App_LEEME.md`, `ESTADO_CRM.md`, `Modelo_Datos_CRM.md`) da por
existentes `CRM/CRM_Synergy.html` y
`CRM/Datos de Clientes/Clientes_Municipios_Maestro.csv` (210 contactos),
pero en su ubicación real solo hay versiones `_prev_` archivadas
(`CRM/Documentación/Archivo/CRM_Synergy_prev_20260721b.html` y
`CRM/Datos de Clientes/Archivo/Clientes_Municipios_Maestro_prev_20260721.csv`).
Antes de regenerar desde cero, confirmar con Alex si tiene una versión más
reciente en su PC. Al terminar, actualizar `CRM/Documentación/ESTADO_CRM.md`
y dejar entrada en `Sistema/REGISTRO_ACTIVIDAD.md`.
Archivos: CRM/CRM_Synergy.html, CRM/Datos de Clientes/Clientes_Municipios_Maestro.csv
Decisión necesaria: sí — de Alex, si existe versión más reciente.
Bloqueos: ninguno para empezar.

---

### 2026-07-25 18:50 — Nexo → Cifra
Tarea: Antes de tocar la Calculadora, aclarar con Alex el origen y
propósito de `calculadora-zbe-pro/index.html` y
`zbe-calculadora-app/app/Calculadora_ZBE_Interactiva.html` en el repo de
GitHub — no mencionadas en ninguna documentación de Dropbox. No asumir que
son descartables ni que sustituyen a la versión oficial de Dropbox.
Archivos: (ninguno tocado todavía)
Decisión necesaria: sí — de Alex.
Bloqueos: sí, bloquea cualquier trabajo sobre la Calculadora hasta aclararlo.
