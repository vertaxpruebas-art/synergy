# AUDITORÍA DE MIGRACIÓN — SYNERGY → CLAUDE CODE / SYNERGY HQ

Fecha de la auditoría: 25/07/2026
Realizada por: Claude Code (sesión remota "claude-code-on-the-web")

## 0. Nota de alcance — léase antes que nada

Esta auditoría se pidió sobre `/home/alex/synergy/Synergy` (ruta del PC local
de Alex). **Esta sesión de Claude Code corre en un contenedor remoto y no
tiene acceso a ese PC ni a esa ruta.** Lo único que esta sesión puede ver es:

1. El repositorio de GitHub `vertaxpruebas-art/synergy` (clonado en
   `/home/user/synergy`, rama `claude/synergy-migration-audit-tsxjzz`).
2. Un conector de Dropbox ya vinculado a esta cuenta, que da acceso a la
   carpeta real `/Synergy/...` — la misma que describe toda la documentación
   del proyecto como "sitio oficial y activo".

Alex confirmó en esta sesión que el resto del proyecto "está en una carpeta
local" (el PC), a la que esta sesión no llega. Por tanto **esta auditoría se
ha hecho leyendo la copia de Dropbox**, no la copia local del PC. Es la
fuente más completa y más fiel a la real a la que esta sesión tiene acceso,
pero **no es exactamente lo mismo que pediste auditar** (la ruta local del
PC). Trátese esta auditoría como el mejor sustituto disponible, a
confirmar/completar cuando una sesión con acceso al PC de Alex pueda
contrastarla contra los archivos locales reales.

No se ha escrito, movido ni borrado nada en Dropbox ni en el repositorio
salvo este propio informe.

---

## 1. Qué existe actualmente

Estructura real en Dropbox `/Synergy/` (confirmada por listado directo, no por documentación):

```
/Synergy/
├── LEEME.txt                         (raíz, guía rápida, sin actualizar desde 15/07)
├── Documentación/                    (8 .md activos + Archivo/ con versiones previas)
├── Memoria/Memoria_Synergy.html
├── Mapeo/
│   ├── Mapeo_Municipios_ZBE_Cataluna.csv
│   ├── Mapeo_Municipios_ZBE_ComunidadValenciana.csv
│   ├── Mapeo_Municipios_ZBE_RegionMurcia.csv
│   ├── Mapeo_Municipios_ZBE_Andalucia.csv
│   └── Archivo/  (11 versiones anteriores/archivadas, incluido el antiguo CSV maestro unificado)
├── Calculadora/
│   ├── Calculadora_ZBE_Interactiva.html   (la app "oficial", 21/07)
│   ├── Calculadora_Financiacion_ZBE.csv   (foto estática de ejemplo)
│   └── Archivo/ (2 versiones previas)
├── CRM/
│   ├── CRM_App_LEEME.md
│   ├── Modelos de Datos/Modelo_Datos_CRM.md
│   ├── Seguimiento Comercial/Pipeline_Comercial.csv (+ Archivo/)
│   ├── Datos de Clientes/   ⚠️ SOLO contiene Archivo/ (ver sección 8, hallazgo crítico)
│   └── Documentación/ (ESTADO_CRM.md, HISTORIAL_CAMBIOS_CRM.md + Archivo/)
├── Web/
│   ├── Synergy_Landing_v1.html, Synergy_Landing_v2.html
│   ├── INSTRUCCION_DESPLIEGUE_DOMINIO.md (24/07, la más reciente de todo el proyecto)
│   ├── Documentación/HITO_1_PROPUESTA.md
│   ├── png/ (8 capturas/mockups)
│   └── Archivo/ (4 versiones previas de landing)
├── Gobernanza/
│   └── MALETA_ALEX_001.md (21/07, único archivo de esta carpeta)
├── Contactos y seguimiento/
│   ├── Contactos_y_Seguimiento.csv (marcado obsoleto)
│   └── OBSOLETO_VER_CRM.md
├── Presentación/                     (VACÍA)
├── logo/synergy logo.png
└── .playwright-mcp/                  (capturas/logs de pruebas automáticas, ruido técnico, ignorable)
```

Y, por separado, en el repositorio de GitHub `vertaxpruebas-art/synergy`
(rama actual), que **no aparece mencionado en ninguna parte de la
documentación de Dropbox**:

```
/home/user/synergy/
├── calculadora-zbe-pro/index.html       ("Calculadora ZBE PRO", rediseño standalone, 993 líneas)
├── zbe-calculadora-app/                  (wrapper Electron, contiene su propia copia de
│   └── app/Calculadora_ZBE_Interactiva.html   la calculadora, 461 líneas, título distinto)
└── .mcp.json                             (config del MCP codebase-memory)
```

Solo 3 commits en este repo, todos de los últimos 1-2 días, todos sobre la
calculadora. Ni rastro de Mapeo, CRM, Web, Gobernanza ni Documentación en
GitHub.

## 2. Qué está funcionando

- **Calculadora ZBE interactiva** (Dropbox, `Calculadora/Calculadora_ZBE_Interactiva.html`):
  operativa, revisada con navegador simulado el 21/07, sin errores en
  escritorio ni móvil. 3 pestañas (Calculadora, Resumen general, Municipios).
- **Mapeo de municipios**: 4 comunidades autónomas con archivos CSV activos
  (Cataluña, Comunitat Valenciana, Región de Murcia, Andalucía), con
  histórico de versiones bien conservado en `Archivo/`.
- **CRM — parte comercial (`Pipeline_Comercial.csv`)**: existe y está
  poblado (105 filas a fecha 20/07, todas "No contactado").
- **Landing web (Hito 1)**: dos versiones HTML autocontenidas
  (`Synergy_Landing_v1.html`, `v2.html`), con archivo de despliegue a
  Cloudflare Pages instruido el 24/07 (la actividad documentada más
  reciente de todo el proyecto).
- **Memoria/dossier del proyecto** (`Memoria_Synergy.html`): existe, estable
  desde el 14/07, sin cambios reportados desde entonces.
- **Gobernanza**: primer contacto documentado con el marco "BITÁCORA" del
  padre de Alex (Pedro Sardinero), con preguntas abiertas sin responder
  todavía (ver sección 7).

## 3. Qué está incompleto

- **Adaptación de la calculadora al mapeo por comunidad autónoma**: la
  calculadora sigue leyendo, en su código, la URL del antiguo CSV maestro
  unificado (`MAPEO_CSV_URL`), que está archivado y ya no se actualiza. Esto
  está reconocido explícitamente en `ESTADO_ACTUAL.md` como bloqueado "a la
  espera de que se estabilice" el mapeo — pero el mapeo lleva ya 4
  comunidades autónomas activas sin que la calculadora se haya adaptado.
- **Carpeta `Presentación/`**: vacía desde el origen del proyecto (14/07).
- **Precios reales de Synergy**: la calculadora sigue usando cifras de
  ejemplo; pendientes de que el padre de Alex las comparta. Sin esto, ningún
  número que salga de la calculadora es utilizable comercialmente tal cual.
- **Entidad "Interacción" del modelo de datos del CRM**: documentada como
  diseñada pero "aún sin crear" como archivo.
- **Migración de la calculadora a archivos locales del PC de Alex**: pedida
  explícitamente por Alex el 21/07, documentada como "a la espera de que
  Alex conecte su ordenador" — no hay evidencia en Dropbox de que se haya
  hecho. Los commits recientes en GitHub (`zbe-calculadora-app`, wrapper
  Electron) podrían ser un intento de responder a esa petición, pero no
  están enlazados ni referenciados desde la documentación oficial.

## 4. Qué está pendiente (explícito, con dueño)

| Pendiente | De quién depende |
|---|---|
| Precios reales de Synergy | Padre de Alex |
| Archivo "v2" mencionado por el padre, contenido desconocido | Padre de Alex |
| Adaptar la calculadora al mapeo separado por CCAA | Agente Calculadora (bloqueado) |
| Actualizar `LEEME.txt` con la estructura nueva del mapeo | Agente de Mapeo |
| Decidir si ampliar a más comunidades autónomas | Alex (consultar con el padre) |
| Añadir las 11 grandes capitales catalanas (>100k hab.) | Alex |
| Completar contactos "No encontrado" en C. Valenciana | Agente de Mapeo |
| Coordinar la pestaña CRM (ya retirada) de la calculadora con el CRM central | Agente Calculadora + Agente Web/CRM |
| Confirmar dominio y registrador para desplegar la web | Alex |
| Responder las 3 preguntas de gobernanza de `MALETA_ALEX_001.md` | Alex |
| Reconciliar el CRM (105 municipios, sin Andalucía) con el Mapeo (ya con Andalucía) | Agente Web/CRM |

## 5. Qué archivos parecen ser las versiones activas

- Mapeo activo: los 4 CSV en `/Synergy/Mapeo/*.csv` (raíz, sin sufijo
  `_prev_`/`ARCHIVADO`), **no** los de `Mapeo/Archivo/`.
- Calculadora activa: `/Synergy/Calculadora/Calculadora_ZBE_Interactiva.html`
  (Dropbox, 21/07) — **no** las copias del mismo nombre dentro del repo de
  GitHub, que son distintas en tamaño/título y de procedencia no explicada.
- CRM — pipeline activo: `/Synergy/CRM/Seguimiento Comercial/Pipeline_Comercial.csv`.
- CRM — directorio de clientes: **no hay versión activa** (ver hallazgo
  crítico, sección 8).
- Web activa: `/Synergy/Web/Synergy_Landing_v2.html` (v2 es la revisión más
  reciente sobre v1, ambas fuera de `Archivo/`, así que formalmente
  coexisten las dos como "no archivadas" — no hay un documento que diga
  explícitamente cuál de las dos es *la* landing definitiva).
- Documentación maestra: `/Synergy/Documentación/*.md` (root), no
  `Documentación/Archivo/*`.

## 6. Qué archivos son históricos (no tocar salvo instrucción expresa)

Todo lo que vive bajo cualquier carpeta `Archivo/` en Dropbox (11 en Mapeo, 2
en Calculadora, 2 en CRM/Datos de Clientes, 1 en CRM/Seguimiento Comercial, 2
en CRM/Documentación, 1 en Documentación, 4 en Web, 1 en Web/Documentación),
más `Contactos_y_Seguimiento.csv` (marcado obsoleto pero sin borrar, tal y
como pide la regla general de "archivar en vez de eliminar"). Todos siguen
un patrón de nombre consistente (`_prev_YYYYMMDD` o `_ARCHIVADO_YYYYMMDD`)
que ya funciona bien como convención de archivado — se recomienda
mantenerlo tal cual, sin inventar uno nuevo.

## 7. Qué documentación está desactualizada

- **`CONTEXTO_MAESTRO.md`** (Documentación, sin tocar desde el 18/07):
  describe un único `Mapeo_Municipios_ZBE.csv` cuando el mapeo ya está
  dividido en 4 archivos por comunidad autónoma desde esa misma fecha; no
  menciona el CRM (creado el 20/07) ni la Web (creada el 20/07) ni
  Gobernanza (creada el 21/07); sigue diciendo que "Presentación" está
  vacía (esto sigue siendo cierto, por casualidad).
- **`ARQUITECTURA.md`**: describe la calculadora con **4 pestañas**
  incluyendo "Seguimiento CRM", pestaña que `ESTADO_ACTUAL.md` (más
  reciente, 21/07) confirma que ya se retiró — quedan 3 pestañas.
  `ARQUITECTURA.md` no se actualizó tras ese cambio.
- **`LEEME.txt`** (raíz de Dropbox, sin tocar desde el 15/07): describe la
  estructura original de un único CSV de mapeo y no menciona en absoluto
  CRM, Web ni Gobernanza, que se crearon después. El propio
  `PENDIENTES.md` ya señala esto como tarea pendiente desde el 18/07 y
  sigue sin hacerse.
- **`ESTADO_ACTUAL.md`** (Documentación, 21/07 — el documento que se supone
  "más al día" del proyecto): no menciona ni el Mapeo de Andalucía ni el de
  Región de Murcia (ambos ya existentes, uno incluso con fecha *posterior*,
  20-21/07), ni la existencia del CRM, ni de la Web. Es decir: el documento
  cuyo propósito explícito es "responder en qué punto estamos" ya no
  refleja tres piezas activas del proyecto.
- **`HISTORIAL_CAMBIOS.md`** se detiene el 21/07 y no recoge la creación del
  CRM (20/07, documentada en su propio historial separado
  `CRM/Documentación/HISTORIAL_CAMBIOS_CRM.md`) ni de la Web (20/07) ni de
  Gobernanza (21/07) ni del despliegue a dominio (24/07) — cada área lleva
  su historial por separado y nadie los está consolidando en uno global.
- El texto interno de `HISTORIAL_CAMBIOS.md` menciona una carpeta
  `/Supervisor Central/REGISTRO_ACTIVIDAD.md` como acuerdo ya tomado
  ("a partir de ahora... se debe añadir una entrada..."), pero **esa carpeta
  no existe en Dropbox** (búsqueda directa sin resultados). Es una decisión
  documentada que nunca se llegó a implementar.

## 8. Contradicciones encontradas (documentadas, no corregidas)

1. **CRÍTICO — Falta el directorio de clientes activo del CRM.**
   `CRM_App_LEEME.md`, `ESTADO_CRM.md` y `Modelo_Datos_CRM.md` afirman todos
   que `CRM/Datos de Clientes/Clientes_Municipios_Maestro.csv` existe,
   poblado con 210 filas, como pieza central del CRM. **La carpeta real solo
   contiene un subdirectorio `Archivo/` con dos versiones previas
   (`_prev_20260721.csv` y `_prev_20260720_vacio.csv`); el archivo activo sin
   sufijo no existe.** Mismo patrón exacto con la propia app:
   `CRM_App_LEEME.md` dice literalmente que `CRM_Synergy.html` "está
   guardada directamente en Dropbox en `/Synergy/CRM/CRM_Synergy.html`", pero
   esa ruta no existe — solo hay dos versiones `_prev_` dentro de
   `CRM/Documentación/Archivo/`. **O bien un archivado accidental movió los
   "activos" a `Archivo/` sin renombrarlos correctamente (dejaron el sufijo
   `_prev_` puesto en lo que debía quedar como versión viva), o bien nunca
   se llegó a subir la versión final descrita en la documentación.** Esto
   hay que aclararlo con Alex antes de que Cifra/Forge asuman que el CRM
   tiene datos de clientes accesibles: hoy, tal y como está Dropbox, no los
   tiene en su ubicación documentada.
2. **Mapeo vs. CRM desincronizados.** El CRM se pobló el 20/07 con "105
   municipios (70 Cataluña + 15 C. Valenciana + 20 Región de Murcia)". El
   Mapeo de Andalucía se creó el 20-21/07 (fechas de archivo posteriores o
   simultáneas) y hoy es parte activa del Mapeo, pero no hay ningún rastro
   en la documentación del CRM de que Andalucía se haya incorporado al
   directorio de clientes ni al pipeline. Si el CSV maestro de clientes
   existiera (ver punto 1), habría que verificar si están o no los
   municipios andaluces.
3. **Número de pestañas de la calculadora**: `ARQUITECTURA.md` dice 4,
   `ESTADO_ACTUAL.md` y `FUNCIONALIDADES.md` (esta última tampoco
   actualizada, sigue describiendo la pestaña "Seguimiento CRM" como si
   siguiera activa) dicen o implican 3. Ver sección 7.
4. **Tres copias divergentes de "la" calculadora.** Dropbox tiene una
   (`Calculadora_ZBE_Interactiva.html`, 3 pestañas, sin CRM, 21/07). El repo
   de GitHub tiene otras dos: una dentro de `zbe-calculadora-app/app/`
   (título "Calculadora de Financiación ZBE — SYNERGY", 461 líneas) y otra
   completamente distinta, `calculadora-zbe-pro/index.html` ("Calculadora
   ZBE PRO", 993 líneas, paleta y funciones propias, README dice
   explícitamente "no toca la app Electron"). Ninguna de las dos versiones
   de GitHub está mencionada en ningún documento de Dropbox. No está claro
   si son forks intencionados, trabajo duplicado, o un intento (sin
   documentar) de responder a la petición de Alex de tener la calculadora
   en archivos locales.
5. **`Web/Synergy_Landing_v1.html` vs `v2.html`**: ambas están fuera de
   `Archivo/`, así que ninguna documentación deja explícito cuál de las dos
   es la vigente. Por convención de nombre, v2 parece la más nueva, pero
   `HITO_1_PROPUESTA.md` no lo confirma directamente.
6. **Decisión de gobernanza sin resolver bloqueando el diseño de Nexo.**
   `MALETA_ALEX_001.md` (21/07) deja tres preguntas abiertas sobre si
   adoptar el marco de gobernanza BITÁCORA del padre de Alex (carriles
   separados, `STATUS_OPERATIVO.md`, reparto de roles entre chats). No hay
   respuesta registrada en ningún documento posterior. El punto 20 y 21 del
   encargo de esta auditoría (memoria por capas, `STATUS_OPERATIVO.md`) se
   solapa directamente con esa pregunta sin resolver — conviene cerrarla con
   Alex antes de nombrar los archivos definitivos del nuevo sistema, para no
   generar una tercera convención distinta.
7. **Acuerdo de registro central nunca implementado.** Ver sección 7,
   `/Supervisor Central/REGISTRO_ACTIVIDAD.md` referenciado pero inexistente.

## 9. Qué decisiones anteriores deben conservarse

- **Carriles separados, sin excepción**: nunca tocar ni sincronizar con la
  carpeta "Synergy" de Google Drive del padre de Alex (ID
  `1ddHbG_-_GGkAHoKuHZkmHUYyX9B2tXnf`). Regla repetida en al menos tres
  documentos distintos (`CONTEXTO_MAESTRO.md`, `HITO_1_PROPUESTA.md`,
  contexto de Gobernanza).
- **Nunca inventar datos de contacto**: si un email/teléfono no se
  encuentra, se escribe "No encontrado", nunca se rellena a ojo. Aplica a
  Mapeo y CRM por igual.
- **Preferir archivar sobre borrar**, con la convención de nombre
  `_prev_YYYYMMDD` / `_ARCHIVADO_YYYYMMDD` ya establecida y usada de forma
  consistente en las 6 áreas del proyecto.
- **Dropbox es la fuente única y oficial** desde el 14/07 (migrado desde
  Google Drive personal de Alex). El repo de GitHub añadido estos últimos
  días no ha sido, hasta donde muestra la documentación, adoptado
  formalmente como sustituto ni como complemento de esa fuente única —
  convendría decidirlo explícitamente con Alex antes de seguir escribiendo
  ahí.
- **CRM como fuente única de seguimiento comercial**, decisión de Alex del
  20/07, que ya dejó obsoleto (sin borrar) el sistema anterior de
  `Contactos y seguimiento/`.
- **Web = HTML estático, no Webflow**, decisión de Alex del 20/07 para el
  Hito 1.
- **Nombres de agentes** (Nexo, Atlas, Cifra, Forge) — definidos en el
  encargo de esta auditoría, no aparecen todavía en ningún documento de
  Dropbox (el proyecto hasta ahora habla de "Agente de Mapeo", "Agente
  Calculadora ZBE", "Agente Web/CRM", "Agente Supervisor Central" como
  roles funcionales, sin esos nombres propios). Al nombrar formalmente a
  los 4 agentes, conviene dejar explícito en la documentación qué rol
  anterior hereda cada uno, para no perder la trazabilidad de quién hizo
  qué en el historial ya escrito.

## 10. Riesgos antes de migrar

- **Riesgo alto — origen de la app CRM y del CSV de clientes activo
  desconocido.** No empezar a construir sobre el CRM (ni asumir que Forge
  puede leer datos de clientes) sin que Alex confirme si el archivo activo
  se perdió, se archivó mal, o nunca llegó a subirse.
- **Riesgo alto — tres copias de la calculadora sin reconciliar.** Cualquier
  cambio futuro a "la calculadora" tiene que decir explícitamente sobre cuál
  de las tres actúa, o se corre el riesgo de que Cifra edite una versión que
  nadie usa mientras la real (la de Dropbox) sigue desactualizada.
- **Riesgo medio — el repo de GitHub puede no ser la fuente real.** Toda la
  documentación de Synergy asume Dropbox como fuente única; el hecho de que
  ahora exista además un repo de GitHub con contenido relacionado pero no
  documentado sugiere que puede haber una tercera fuente de trabajo (el PC
  local de Alex) generando cambios que ni Dropbox ni GitHub reflejan todavía
  de forma completa. Antes de fijar "la carpeta raíz" del nuevo sistema
  multiagente, hay que confirmar con Alex cuál de las tres (PC local,
  Dropbox, GitHub) va a ser la fuente de verdad operativa, y cómo se
  sincronizan las otras dos (si es que se sincronizan).
- **Riesgo medio — nombres de carpeta con tildes y espacios** (`Documentación`,
  `Contactos y seguimiento`, `Datos de Clientes`). Viable en Dropbox/macOS,
  pero puede dar problemas si el nuevo sistema (Synergy HQ, scripts, rutas
  de agentes) se construye en Linux/Node sin cuidar el *quoting* de rutas.
  No es razón para renombrar nada todavía — solo un cuidado a tener al
  automatizar accesos.
- **Riesgo bajo-medio — LEEME.txt y CONTEXTO_MAESTRO.md desactualizados** son
  probablemente el primer punto de lectura de cualquier persona (o agente)
  nueva que entre al proyecto. Mientras no se actualicen, transmiten una
  foto del proyecto de hace más de una semana como si fuera la actual.
- **Riesgo bajo — carpeta `.playwright-mcp/` en la raíz de Dropbox**: son
  capturas y logs de pruebas automáticas (no documentación, no
  entregables). No es dañino pero ensucia el listado de la carpeta raíz;
  candidato a mover a una subcarpeta de "temporales" en una fase posterior,
  nunca a borrar sin confirmar primero que no hace falta para depurar algo.

## 11. Qué debería asumir cada agente (de entrada, a validar con Alex)

- **ATLAS** (mapeo/territorio): hereda `/Synergy/Mapeo/` completo (4 CCAA
  activas + histórico), y el conocimiento de que la calculadora *todavía no
  lee* estos archivos en vivo — cualquier cambio de estructura de columnas
  debe coordinarse porque hay una adaptación pendiente enganchada a esto.
- **CIFRA** (calculadora/cálculos/financiación): hereda
  `/Synergy/Calculadora/` de Dropbox como única versión con historial de
  decisiones documentado. Antes de tocar nada debe aclarar con Alex el
  estatus de las dos copias adicionales en GitHub
  (`calculadora-zbe-pro`, `zbe-calculadora-app`) — no asumir que son
  descartables ni que son la versión buena sin confirmación.
- **FORGE** (CRM/Web/HTML/CSS/JS): hereda `/Synergy/CRM/` y `/Synergy/Web/`.
  Su primera tarea real, antes de construir nada nuevo, debería ser resolver
  el hallazgo crítico de la sección 8.1 (dónde está de verdad el CSV/HTML
  activos del CRM) — sin eso, cualquier funcionalidad nueva de CRM se
  construiría sobre un supuesto no verificado.
- **NEXO** (supervisor): hereda la visión global de las 6 áreas y, en
  particular, la pregunta sin responder de `MALETA_ALEX_001.md` sobre si
  adoptar el marco de gobernanza del padre de Alex — decisión que afecta
  directamente a cómo se diseñe la memoria por capas y el
  `STATUS_OPERATIVO.md` que pide el propio encargo de esta auditoría.

## 12. Qué NO debería tocarse todavía

- Nada dentro de ninguna carpeta `Archivo/` de Dropbox.
- `Contactos_y_Seguimiento.csv` (obsoleto pero conservado a propósito).
- La carpeta "Synergy" de Google Drive del padre de Alex — fuera de alcance
  por completo, en cualquier fase.
- Las dos calculadoras del repo de GitHub (`calculadora-zbe-pro`,
  `zbe-calculadora-app`) hasta que Alex confirme su origen y propósito.
- El archivo `Calculadora_ZBE_Interactiva.html` de Dropbox, en tanto no se
  resuelva primero de dónde debe leer el mapeo (riesgo de dejarlo sin datos
  en vivo si se toca a medias).
- Cualquier reorganización de carpetas o renombrado masivo — ninguno de los
  hallazgos anteriores requiere mover archivos para quedar documentado.

## 13. Propuesta para la siguiente fase (solo si Alex autoriza continuar)

1. Cerrar con Alex, antes de nada más, los tres huecos que bloquean diseño:
   (a) el hallazgo crítico del CRM (sección 8.1), (b) qué son las dos
   calculadoras de GitHub y qué relación tienen con el PC local, (c) las 3
   preguntas de gobernanza de `MALETA_ALEX_001.md`.
2. Confirmar cuál de las tres ubicaciones (PC local, Dropbox, GitHub) será
   la fuente de verdad operativa del nuevo sistema multiagente, y cómo (si
   procede) se sincronizan las otras.
3. Diseñar la arquitectura ligera de Nexo/Atlas/Cifra/Forge (identidad,
   memoria por capas, registro de actividad, comunicación entre agentes)
   sobre la estructura real ya inventariada aquí — no sobre la que describe
   la documentación desactualizada.
4. Solo entonces, empezar a construir Synergy HQ.

---

_Este documento es un registro de auditoría, no un plan de acción aprobado.
No implica ninguna corrección de las contradicciones anteriores — quedan
documentadas para que Alex decida._
