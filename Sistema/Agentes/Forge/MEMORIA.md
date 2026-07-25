# MEMORIA — FORGE

Compacta. Origen: `AUDITORIA_MIGRACION.md` (25/07/2026).

## Qué existe hoy en CRM/

```
CRM/
├── CRM_App_LEEME.md              (documenta CRM_Synergy.html, que no está donde dice)
├── Modelos de Datos/Modelo_Datos_CRM.md
├── Seguimiento Comercial/
│   ├── Pipeline_Comercial.csv     (activo, 105 filas, 20/07)
│   └── Archivo/
├── Datos de Clientes/
│   └── Archivo/                   ⚠️ SOLO Archivo/ — ver hallazgo crítico
└── Documentación/
    ├── ESTADO_CRM.md
    ├── HISTORIAL_CAMBIOS_CRM.md
    └── Archivo/ (incluye CRM_Synergy_prev_20260721.html y _prev_20260721b.html)
```

## HALLAZGO CRÍTICO — mi primera tarea

La documentación (`CRM_App_LEEME.md`, `ESTADO_CRM.md`, `Modelo_Datos_CRM.md`)
afirma que existen, activos:
- `CRM/CRM_Synergy.html` (app de un solo archivo, ~82 KB, 210 contactos
  incrustados, subida el 21/07).
- `CRM/Datos de Clientes/Clientes_Municipios_Maestro.csv` (210 filas, 105
  municipios × contacto de Alcaldía + Movilidad).

**Ninguno de los dos existe en esa ruta.** Solo hay, archivadas:
`CRM/Documentación/Archivo/CRM_Synergy_prev_20260721.html` y
`_prev_20260721b.html`, y `CRM/Datos de Clientes/Archivo/Clientes_Municipios_Maestro_prev_20260721.csv`
y `_prev_20260720_vacio.csv`.

Dos hipótesis a verificar (ninguna descartada): (a) un archivado dejó los
"activos" con el sufijo `_prev_` puesto por error, en vez de quedar sin
sufijo en la raíz; (b) la versión final descrita en la documentación nunca
llegó a subirse. **Antes de construir nada nuevo sobre el CRM, resolver
esto**: lo más seguro es regenerar `CRM_Synergy.html` y
`Clientes_Municipios_Maestro.csv` a partir de los CSV fuente
(`Datos de Clientes/Archivo/Clientes_Municipios_Maestro_prev_20260721.csv`
como base más probable, y `Seguimiento Comercial/Pipeline_Comercial.csv`
que sí está activo), y confirmar con Alex antes de dar el CRM por
reparado.

## Modelo de datos del CRM (de Modelo_Datos_CRM.md)

- **Cliente/Contacto**: `Municipio, Comunidad Autónoma, Comarca, Habitantes,
  Clasificación ZBE, Nombre Contacto, Cargo, Email, Teléfono, Tipo de
  Contacto (Alcaldía/Movilidad), Fuente del Dato, Fecha de Actualización, Notas`.
- **Oportunidad (pipeline)**: `Municipio, Comunidad Autónoma, Etapa, Fecha
  Primer Contacto, Fecha Último Contacto, Próximo Paso, Fecha Próximo
  Seguimiento, Responsable, Notas`. Etapas cerradas: No contactado →
  Contactado → Interesado → Propuesta enviada → En negociación → Cerrado
  (ganado) → Cerrado (perdido) → Descartado.
- Entidad "Interacción" (histórico de llamadas/emails/reuniones): diseñada
  en la documentación de la app, pero como archivo CSV separado **aún no
  existe** — hoy vive dentro del propio `CRM_Synergy.html` (que tampoco
  está disponible, ver arriba).

## Riesgo de sincronización con Atlas

El CRM se pobló el 20/07 con 105 municipios = 70 Cataluña + 15 C.
Valenciana + 20 Región de Murcia. El Mapeo de Andalucía se añadió después
(20-21/07) y no hay constancia de que se haya incorporado al CRM. Verificar
al reconstruir el CSV maestro de clientes.

## Qué existe hoy en Web/

- `Synergy_Landing_v1.html` y `v2.html` — ambas fuera de `Archivo/`, sin
  confirmación documental explícita de cuál es la definitiva (v2 parece la
  más reciente por convención de nombre).
- `INSTRUCCION_DESPLIEGUE_DOMINIO.md` (24/07) — instrucción de Nexo para
  desplegar a Cloudflare Pages; pendiente de que Alex confirme dominio y
  registrador. Pasos 1-2 (cuenta Cloudflare, proyecto Pages) no bloqueados.
- `Documentación/HITO_1_PROPUESTA.md` — landing HTML estática, sin cifras
  de coste, con CTA "Solicita un estudio para tu municipio".
