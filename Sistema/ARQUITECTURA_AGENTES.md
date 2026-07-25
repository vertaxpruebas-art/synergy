# ARQUITECTURA DE AGENTES — SYNERGY (Nexo / Atlas / Cifra / Forge)

Fecha: 25/07/2026
Estado: **propuesta de diseño, no implementada todavía**
Depende de: `AUDITORIA_MIGRACION.md` (léase primero)

## 0. Nota de alcance — importante

Alex decidió que la **fuente de verdad operativa** de este sistema será su
**PC local** (`/home/alex/synergy/Synergy`), con Dropbox pasando a ser copia
de seguridad/sincronización. Esta sesión de Claude Code es remota y no tiene
acceso a ese PC — por tanto **este documento es una especificación para
aplicar**, no algo ya construido. Se entrega en dos sitios que esta sesión
sí puede escribir (este repo de GitHub y Dropbox, como referencia), pero la
estructura real de carpetas descrita aquí debe crearla una sesión de Claude
Code abierta directamente en el PC de Alex — copiando/creando esto bajo
`/home/alex/synergy/Synergy/Sistema/`.

Nada de lo descrito aquí se ha creado todavía como carpetas/archivos reales
en el PC. Es el plano, no el edificio.

## 1. Principios de diseño (de la auditoría y del encargo original)

1. Ningún agente lee todo Synergy en cada mensaje. Solo carga: su identidad,
   su memoria compacta, su estado actual — el resto (Mapeo, CRM, Web,
   Documentación histórica) se consulta **bajo demanda**, con búsqueda/grep,
   no precargado.
2. Archivos legibles por humanos, en Markdown, sin base de datos ni
   frameworks multiagente pesados.
3. Persistencia = archivos. Recuperación = releer archivos pequeños, no
   reconstruir desde una conversación larga.
4. Preservar > borrar. Archivar > eliminar (misma convención `_prev_YYYYMMDD`
   ya usada en todo Synergy — no se inventa una nueva).
5. Nada se inventa: si un agente no sabe algo, lo dice, no lo rellena.
6. Trazabilidad: todo cambio importante deja una línea en un registro.

## 2. Estructura de carpetas propuesta (a crear en el PC local)

```
Synergy/Sistema/
├── STATUS_OPERATIVO.md            ← única fuente de "qué pasa ahora mismo", muy corto, se sobreescribe
├── REGISTRO_ACTIVIDAD.md          ← histórico global, append-only, una línea compacta por evento
├── DECISIONES.md                  ← decisiones del usuario, append-only, nunca se reescriben ni se borran
├── Comunicacion/
│   └── MENSAJES.md                ← mensajes entre agentes, append-only, formato fijo (ver sección 5)
└── Agentes/
    ├── Nexo/
    │   ├── IDENTIDAD.md           ← rol, instrucciones fijas, permisos (cambia solo con aprobación de Alex)
    │   ├── MEMORIA.md             ← compacta: qué existe, dónde, quién es responsable, dependencias, riesgos
    │   ├── ESTADO.md               ← tarea activa ahora mismo, última actualización (se sobreescribe)
    │   └── Handoffs/
    │       └── handoff_YYYYMMDD_HHMM.md   ← uno por cada fin de sesión relevante
    ├── Atlas/    (misma estructura: IDENTIDAD.md, MEMORIA.md, ESTADO.md, Handoffs/)
    ├── Cifra/    (misma estructura)
    └── Forge/    (misma estructura)
```

Esto vive **junto a** las carpetas ya existentes de Synergy (Mapeo, Calculadora,
CRM, Web, Documentación, Gobernanza...), no las sustituye ni las reorganiza.

## 3. Memoria por capas — qué carga cada agente y cuándo

| Capa | Contenido | Cuándo se lee |
|---|---|---|
| **Identidad** (`IDENTIDAD.md`) | Rol fijo, especialidad, permisos, reglas de autonomía | Al arrancar la sesión del agente. Nunca cambia sola. |
| **Memoria** (`MEMORIA.md`) | Hechos estables y compactos: qué existe en su área, dónde, decisiones vigentes, dependencias con otros agentes | Al arrancar. Se actualiza tras cambios importantes, no en cada mensaje. |
| **Estado** (`ESTADO.md`) | Tarea activa ahora mismo, bloqueos actuales | Al arrancar y cuando cambia la tarea. |
| **Registro de actividad** (`REGISTRO_ACTIVIDAD.md`) | Histórico de qué se ha hecho, por quién, cuándo | Solo bajo demanda (ej. "¿qué hizo Forge ayer?"), nunca precargado entero — se busca/filtra por fecha o agente. |
| **Documentación de área** (`Mapeo/`, `CRM/`, `Calculadora/`, `Web/`, `Documentación/`) | El contenido real del proyecto | Solo bajo demanda, cuando la tarea concreta lo requiere — nunca "por si acaso". |

Nexo es el único que necesita una vista global, pero tampoco carga todo:
su `MEMORIA.md` es un **índice** (qué existe, dónde, quién es responsable,
qué depende de qué, qué riesgos hay abiertos), no una copia del contenido.
Para responder "¿qué hizo Atlas esta semana?", Nexo consulta
`REGISTRO_ACTIVIDAD.md` filtrando por agente/fecha, no reconstruye desde
conversaciones.

## 4. `STATUS_OPERATIVO.md` — plantilla

Un archivo que se **sobreescribe** cada vez (no crece), pensado para leerse
en 10 segundos:

```markdown
# STATUS OPERATIVO — Synergy
_Actualizado: 2026-07-25 18:40 por Nexo_

## Ahora mismo
- Atlas: [tarea activa o "en espera"]
- Cifra: [tarea activa o "en espera"]
- Forge: [tarea activa o "en espera"]

## Bloqueos abiertos
- [lista corta, o "ninguno"]

## Decisiones pendientes de Alex
- [lista corta, o "ninguna"]
```

## 5. `REGISTRO_ACTIVIDAD.md` — formato (append-only)

Una línea o bloque corto por evento relevante, **nunca se borra ni reescribe
hacia atrás**, solo se añade al final:

```markdown
### 2026-07-25 18:40 — Forge
Tarea: Investigar y reparar CRM_Synergy.html / Clientes_Municipios_Maestro.csv activos.
Resultado: [pendiente / hecho — resumen de una línea]
Archivos afectados: CRM/CRM_Synergy.html, CRM/Datos de Clientes/Clientes_Municipios_Maestro.csv
Decisión necesaria: [si aplica]
Bloqueos: [si aplica]
```

Nexo (o Alex) puede preguntar "¿qué hemos avanzado hoy?" y el agente
consultado hace un `grep` por fecha sobre este archivo, sin cargarlo entero
en memoria si es largo.

## 6. Comunicación entre agentes — `Comunicacion/MENSAJES.md`

Mismo principio: compacto, estructurado, append-only. Un mensaje = un
bloque corto:

```markdown
### 2026-07-25 18:42 — Atlas → Cifra
Tarea: El mapeo de Andalucía ya tiene Clasificación ZBE calculada; podéis
       usarla para el comparador de municipios.
Archivos: Mapeo/Mapeo_Municipios_ZBE_Andalucia.csv
Decisión necesaria: ninguna
Bloqueos: ninguno
```

Nada de conversaciones largas entre agentes en este archivo — si dos
agentes necesitan discutir algo en profundidad, lo hacen en su propia
sesión y solo el resultado (decisión + archivos afectados) se anota aquí.
Nexo revisa este archivo cuando necesita detectar trabajo duplicado o
desviaciones, no en tiempo real.

## 7. `DECISIONES.md` — persistente, nunca se reescribe

Cada decisión importante de Alex, con fecha, para no perderla ni tener que
releer el histórico completo de conversaciones. Ejemplo (ya extraído de la
auditoría, como semilla inicial):

```markdown
### 2026-07-20 — Alex
Decisión: El CRM en Dropbox pasa a ser la fuente única de seguimiento
          comercial, sustituyendo a Contactos_y_Seguimiento.csv.
Área: CRM
```

Al arrancar este sistema, conviene poblar `DECISIONES.md` con las
decisiones ya identificadas en la sección 9 de `AUDITORIA_MIGRACION.md`,
para no perder ese histórico.

## 8. Nexo — supervisor

**Responsabilidades:** recibir objetivos del usuario, dividirlos en tareas,
decidir qué agente(s) intervienen, delegar, ejecutar en paralelo cuando no
haya conflicto de archivos, revisar resultados, detectar duplicados o
desviaciones (leyendo `MENSAJES.md` y `REGISTRO_ACTIVIDAD.md`), reasignar,
responder sobre el estado general (leyendo `STATUS_OPERATIVO.md` primero,
profundizando solo si hace falta), y **interceptar** acciones potencialmente
destructivas (sección 9) para pedir autorización a Alex.

**Lo que Nexo NO hace:** no se convierte en el único canal — Atlas, Cifra y
Forge pueden comunicarse directamente (sección 6) sin pasar por Nexo cuando
la coordinación es simple. Nexo interviene cuando hay conflicto, ambigüedad,
o una decisión que requiere a Alex.

## 9. Autonomía y seguridad

Cada agente puede trabajar libremente dentro de su especialidad y área de
archivos (Atlas → Mapeo/, Cifra → Calculadora/, Forge → CRM/ y Web/).

**Requieren autorización explícita de Alex, siempre:**
- Borrar cualquier archivo (no solo mover a `Archivo/`).
- Sobrescribir un archivo activo sin dejar la versión anterior archivada.
- Cualquier reorganización de carpetas o renombrado masivo.
- Tocar la calculadora en un punto que la deje sin datos en vivo (ej. cambiar
  de dónde lee el mapeo) sin haber confirmado antes que la nueva fuente está
  estable.
- Cualquier operación sobre la carpeta "Synergy" de Google Drive del padre
  de Alex — **prohibido siempre**, sin excepción, ni con autorización.
- Publicar la web o el CRM en un sitio accesible públicamente.

Cuando un agente detecta que una tarea requeriría una de estas acciones, la
registra en `MENSAJES.md` como "Decisión necesaria" dirigida a Nexo, y Nexo
la traslada a Alex. No se ejecuta hasta tener el visto bueno.

## 10. Creación de nuevos agentes

Nexo puede detectar que hace falta un especialista nuevo y **proponerlo**
(nombre, responsabilidad, memoria inicial, con qué agentes se relaciona),
dejando la propuesta escrita en `Comunicacion/MENSAJES.md` dirigida a Alex.
La incorporación real (crear su carpeta en `Agentes/<nombre>/`) solo ocurre
tras aprobación explícita de Alex.

## 11. Migración de sesión (función "MIGRAR") — diseño honesto

Investigación sobre métricas reales: **Claude Code no expone hoy, como
herramienta invocable por el propio agente, una API para leer su consumo
exacto de tokens/contexto en tiempo real dentro de una sesión.** La interfaz
de Claude Code (CLI/apps) sí muestra al usuario humano un indicador de
contexto y existe `/cost` para coste, pero no hay una función que un agente
pueda llamar para autoconsultar "cuánto contexto me queda" con precisión.
No se ha inventado ninguna API: por eso el diseño de MIGRAR se basa en
señales honestas, no en un número exacto:

**Disparadores de MIGRAR (cualitativos, no un porcentaje exacto):**
- El usuario lo pide explícitamente ("migra", "vamos a cambiar de sesión").
- El propio agente nota que lleva muchos mensajes/archivos grandes leídos en
  la sesión y lo señala como sugerencia a Alex, sin forzarlo.
- Se ha completado una tarea grande y es un punto natural de corte.

**Qué hace MIGRAR, paso a paso:**
1. El agente detiene de forma segura lo que esté haciendo (no a mitad de una
   escritura de archivo).
2. Actualiza su `ESTADO.md` con la tarea real en el punto en que se quedó.
3. Actualiza su `MEMORIA.md` si hay algo nuevo estable que conservar (no
   vuelca la conversación entera, solo lo que cambia el conocimiento
   duradero del agente).
4. Añade una entrada a `REGISTRO_ACTIVIDAD.md`.
5. Si hubo una decisión de Alex en la sesión, la añade a `DECISIONES.md`.
6. Genera `Agentes/<nombre>/Handoffs/handoff_YYYYMMDD_HHMM.md`: un resumen
   compacto (qué se hizo, qué falta, qué archivos tocó, próximo paso
   sugerido) — esto es lo único que una sesión nueva necesita leer para
   continuar sin releer todo el proyecto.
7. La sesión nueva arranca leyendo: `IDENTIDAD.md` + `MEMORIA.md` +
   `ESTADO.md` + el último `handoff_*.md` — nada más, salvo que la tarea
   concreta requiera consultar algo del proyecto.

## 12. Lo que este documento NO decide todavía

- El diseño visual/isométrico de Synergy HQ (fuera de alcance de esta fase,
  como pide el encargo original).
- Cómo se lanzan/gestionan los procesos en segundo plano, notificaciones del
  sistema, bandeja de Ubuntu — todo eso requiere ya estar trabajando desde
  el PC local, no desde esta sesión remota.
- Los nombres exactos de archivo son una propuesta razonable, no una
  decisión cerrada — si Alex prefiere otros nombres, se ajustan antes de
  crear nada.

## 13. Siguiente paso concreto

Esto solo se puede materializar de verdad desde una sesión de Claude Code
con acceso al PC de Alex. El siguiente paso, cuando Alex lo indique, es:
abrir esa sesión local, crear la estructura de la sección 2 bajo
`/home/alex/synergy/Synergy/Sistema/`, poblar `IDENTIDAD.md` de los 4
agentes con lo heredado de la sección 11 de `AUDITORIA_MIGRACION.md`, y
sembrar `DECISIONES.md` con las decisiones ya identificadas en la
auditoría. La primera tarea real, ya asignada, es la de Forge investigando
y reparando el CRM (hallazgo crítico de la auditoría, sección 8.1).
