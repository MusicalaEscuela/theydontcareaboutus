# Musicala · Sala rítmica en vivo

## Uso en restaurante

La dinámica está pensada para un host con el panel abierto y el público entrando desde celular. El host crea o abre una sala, comparte el código o QR, activa el pulso público, decide el BPM y lanza las entradas de cada grupo. Los celulares de participantes son principalmente visuales; el audio del evento debe salir desde el computador o dispositivo del host conectado al sonido del restaurante.

Explicación breve para el público:

"Cuenta siempre 1, 2, 3, 4. Mira tu grupo. Cuando tu pantalla se ponga de color, haces tu ritmo. Cuando esté clara, espera tu turno y sigue contando por dentro. Si aparece Todos ahora, todos participan. Si aparece Frase coral, canta la letra que ves en pantalla."

## Grupos existentes

Los nombres principales de grupo se mantienen:

- Pies: marca el pulso con los pies en cada tiempo: 1, 2, 3, 4. Suave y constante.
- Palmas: aplaude solo en 2 y 4. Espera el 1, aplaude en 2, espera el 3, aplaude en 4.
- Piernas: golpea suavemente tus piernas en 1 y 3. No corras, sostienes la base.
- Mesa / vaso: haz golpes cortos y suaves sobre la mesa o el vaso. La idea es sonar rítmico, no fuerte.

El host puede usar estos grupos por zonas o lugares del restaurante, por ejemplo mesa central, barra, terraza o salón. La app mantiene los nombres musicales de los grupos y permite dirigirlos visualmente por entrada.

## Frase coral

El cue especial `chant` muestra a todos los participantes una pantalla de respuesta coral con el título "TODOS RESPONDEN", una instrucción breve y la letra visible. La letra por defecto vive centralizada en `CHANT_RESPONSE_TEXT` dentro de `rhythms.js`.

Desde el panel host, en "Audio del evento" > "Frase coral", puedes editar la letra que verá el público. Ese texto se guarda en Firebase en:

`rooms/{roomCode}/chantText`

Si no hay texto guardado, los participantes usan `CHANT_RESPONSE_TEXT` como fallback.

Para que el botón "🎤 Frase coral" reproduzca audio, coloca una grabación propia en:

`assets/audio/chant-phrase.mp3`

Renombra el archivo vocal exactamente como `chant-phrase.mp3`. Se recomienda usar una grabación propia de la frase coral para evitar problemas de derechos y para que el público escuche una guía clara adaptada al evento.

## Mixer de grupos

La reproducción por grupos vive dentro de "Caja de ritmos en vivo", en la misma fila donde se edita el patrón de 16 pasos. Cada fila funciona como canal local del host:

- OFF/ON al lado del nombre: activa o apaga ese grupo.
- Si activas Pies y luego Palmas, Palmas entra encima sin apagar Pies.
- Si vuelves a tocar Pies, Pies se apaga y Palmas sigue sonando.
- Los cuadritos del patrón siguen siendo editables mientras el canal suena.
- Cambiar BPM mantiene los canales sincronizados con el BPM maestro.

Estos controles solo afectan el audio local del host. No escriben en Firebase y no modifican ni borran los patrones guardados.

Controles generales de esa sección:

- Reproducir por grupos: activa la reproducción usando las filas de la caja de ritmos. Si no hay grupos activos, activa todos.
- Pausar grupos: pausa el reloj de reproducción por grupos, conservando qué canales estaban activos.
- Detener grupos: apaga todos los canales de grupo.
- Detener todo: detiene canales de grupo, beat, pista completa y frase coral.

Separación importante:

- Reproducción por grupos: usa los patrones editables de la caja de ritmos.
- Pista completa: reproduce un archivo de audio cargado en "Audio del evento".

## Archivos de audio

La pista opcional del evento puede cargarse como antes. La frase coral usa un one-shot independiente para sonar encima del beat sin detenerlo. El archivo esperado es:

`assets/audio/chant-phrase.mp3`

El archivo vocal de la frase coral debe ponerse dentro de `assets/audio/` y debe llamarse exactamente `chant-phrase.mp3`. Evita espacios, tildes y nombres largos en archivos de audio para reducir errores de carga en navegadores y servidores estáticos.

Para el gran final, la voz completa debe ponerse en:

`assets/audio/final-vocals.mp3`

El botón "Gran final" arranca esa voz en el tiempo 1. El campo "Entrada del coro (segundos)" permite programar cuándo se envía la señal coral al público; ajusta ese número después de escuchar dónde entra exactamente el coro en tu archivo.

La pantalla de restaurante se abre con:

```txt
index.html?admin=1&room=MJ30
```

Desde el host, en "Pantalla restaurante", puedes mostrar los 4 grupos, un grupo específico o la letra coral al centro. Cuando se lanza la frase coral, la letra se ilumina estilo karaoke durante 3 segundos.

Aplicación web mobile-first para crear una sala rítmica sincronizada en eventos en vivo.

Evento base:

**Salvémoslos del Reggaetón · Especial Michael Jackson**

La app permite que el público escanee un QR, entre desde el celular a una misma sala y reciba instrucciones en tiempo real según su grupo rítmico.

La actividad principal combina dirección visual para el público, pulso sincronizado y audio desde el dispositivo del host. El motor de beat usa la lógica del secuenciador Musicala y carga los sonidos base `bombo.wav`, `redoblante.wav` y `platillo.wav` del proyecto original si están disponibles; si no cargan, usa sonidos sintéticos de respaldo.

---

## Qué hace la app

Tiene dos modos:

### 1. Participante

URL sugerida:

```txt
index.html?room=MJ30
```

El participante puede:

- Entrar a la sala con código.
- Escribir su nombre opcionalmente.
- Elegir grupo manualmente o dejar asignación automática.
- Ver una tarjeta gigante con su grupo, acción, patrón y estado actual.
- Recibir cambios en tiempo real cuando el host cambia la indicación.
- Sentir una vibración corta cuando entra su grupo, si el celular lo permite.
- Consultar “¿Qué hago?” para leer una explicación breve.

Grupos:

1. 👟 Pies
2. 👏 Palmas
3. 🦵 Piernas
4. 🥁 Mesa / vaso

### 2. Host / director

URL sugerida:

```txt
index.html?host=1&room=MJ30
```

El host puede:

- Crear o abrir una sala por código.
- Ver el código grande para proyectarlo.
- Copiar la URL del participante para crear un QR.
- Cambiar actividad.
- Cambiar modo ensayo/show.
- Cambiar BPM visual de referencia entre 40 y 240.
- Ver contador de participantes por grupo.
- Lanzar cues en vivo:
  - Preparar
  - Iniciar conteo
  - Entra Grupo 1
  - Entra Grupo 2
  - Entra Grupo 3
  - Entra Grupo 4
  - Todos juntos
  - Bajar energía
  - Silencio
  - Corte final
  - Pose MJ
  - Reiniciar sala

---

## Estructura de archivos

```txt
musicala-sala-ritmica-mj/
├─ index.html
├─ styles.css
├─ app.js
├─ firebase-config.js
├─ room.service.js
├─ participant.ui.js
├─ host.ui.js
├─ rhythms.js
├─ audio.engine.js
├─ demo-tracks.js
├─ assets/
│  ├─ audio/
│  │  └─ pista-evento.mp3  # opcional, no incluida
│  └─ sounds/
│     ├─ bombo.wav         # opcional si quieren copiar los samples localmente
│     ├─ redoblante.wav    # opcional
│     └─ platillo.wav      # opcional
└─ README.md
```

---

## Audio del evento

El audio suena **solo desde el dispositivo del host**. Conecta ese computador/celular al sonido del bar. Los participantes no reproducen audio, solo ven instrucciones y una luz de pulso para evitar latencias raras entre celulares, porque un bar con veinte teléfonos sonando descuadrados no es groove, es castigo.

En el panel host encontrarás la sección **Audio del evento**:

1. Toca **Activar audio**. Los navegadores bloquean audio hasta que haya una acción del usuario.
2. Elige un preset:
   - Marcha estadio
   - Groove corporal
   - Pulso estadio
   - Rock Musicala
   - Funk Musicala
3. Toca **Reproducir beat**.
4. Ajusta BPM y volumen.

El motor intenta cargar estos sonidos del secuenciador Musicala:

```txt
assets/sounds/bombo.wav
assets/sounds/redoblante.wav
assets/sounds/platillo.wav
```

Si esos archivos no existen localmente, intenta cargarlos desde la URL pública del secuenciador original. Si tampoco cargan por red/CORS, usa fallback sintético con Web Audio API.

### Pista local

Puedes agregar una pista propia en:

```txt
assets/audio/pista-evento.mp3
```

Luego, en el host, toca **Cargar pista local** y después **Pista**.

Formatos admitidos:

```txt
.mp3
.wav
.ogg
.m4a
```

### URL directa de pista

También puedes pegar una URL directa a un archivo de audio. Debe terminar en `.mp3`, `.wav`, `.ogg` o `.m4a`. No sirve pegar enlaces de YouTube, SoundCloud o páginas HTML, porque el navegador no reproduce páginas disfrazadas de audio, aunque a veces el internet intente convencernos de lo contrario.

### Beats de ejemplo

Las pistas de ejemplo se configuran en:

```txt
demo-tracks.js
```

Por ahora incluye una opción que usa el **beat generado con sonidos Musicala**. Pueden reemplazar o agregar URLs directas cuando tengan pistas definitivas.

---

## Pulso visual para participantes

El host controla un metrónomo visual desde **BPM maestro**:

- **Activar pulso público**: los participantes ven una luz circular siguiendo el BPM.
- **Pausar pulso público**: apaga el pulso visual.
- **Reiniciar pulso**: vuelve a marcar el tiempo 1.

La sincronización usa Realtime Database:

```txt
rooms/{roomCode}/metronome
```

La app guarda `enabled`, `bpm`, `startedAt` y cada celular calcula la animación localmente usando `.info/serverTimeOffset`. No se envía un update a Firebase por cada beat. Firebase ya tiene suficientes dramas como para ponerlo a mandar un “tum” por cada pulso.

---

## Configurar Firebase

### 1. Crear proyecto

Entra a Firebase Console y crea un proyecto nuevo, por ejemplo:

```txt
musicala-sala-ritmica-mj
```

### 2. Crear app web

Dentro del proyecto:

1. Ve a **Configuración del proyecto**.
2. Baja a **Tus apps**.
3. Crea una app web.
4. Copia el objeto `firebaseConfig`.

### 3. Activar Realtime Database

1. Ve a **Build → Realtime Database**.
2. Crea una base de datos.
3. Elige la región.
4. Puedes iniciar en modo bloqueado y luego pegar las reglas de este README.

El campo `databaseURL` del `firebaseConfig` debe coincidir con la URL de tu Realtime Database.

### 4. Activar Authentication anónima

1. Ve a **Build → Authentication**.
2. Entra a **Sign-in method**.
3. Activa **Anonymous**.
4. Guarda.

### 5. Copiar firebaseConfig

Abre `firebase-config.js` y reemplaza únicamente este objeto:

```js
export const firebaseConfig = {
  apiKey: "REEMPLAZA_CON_TU_API_KEY",
  authDomain: "REEMPLAZA_CON_TU_AUTH_DOMAIN",
  databaseURL: "REEMPLAZA_CON_TU_DATABASE_URL",
  projectId: "REEMPLAZA_CON_TU_PROJECT_ID",
  storageBucket: "REEMPLAZA_CON_TU_STORAGE_BUCKET",
  messagingSenderId: "REEMPLAZA_CON_TU_MESSAGING_SENDER_ID",
  appId: "REEMPLAZA_CON_TU_APP_ID"
};
```

No cambies los imports si vas a usar GitHub Pages.

---

## Reglas de Firebase Realtime Database

### Opción rápida para prueba interna

Úsala solo para ensayos cerrados. Permite que cualquier usuario autenticado anónimo lea y escriba en salas.

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

### Opción recomendada para evento

Esta versión permite:

- Cualquier usuario autenticado anónimo puede leer la sala.
- Cualquier usuario autenticado anónimo puede registrarse como participante en su propio `uid`.
- Solo el host creador de la sala puede cambiar `currentCue`, `bpm`, `activity`, `mode` y `metronome`.

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": "auth != null",
        ".write": "auth != null && !data.exists() && newData.child('hostUid').val() === auth.uid",

        "title": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "hostUid": {
          ".write": false
        },
        "createdAt": {
          ".write": false
        },
        "createdAtClient": {
          ".write": false
        },
        "updatedAt": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "updatedAtClient": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },

        "activity": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid",
          ".validate": "newData.isString() && (newData.val() === 'tdcau_body_groove' || newData.val() === 'beat_challenge' || newData.val() === 'groove_machine')"
        },
        "mode": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid",
          ".validate": "newData.isString() && (newData.val() === 'rehearsal' || newData.val() === 'show')"
        },
        "bpm": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid",
          ".validate": "newData.isNumber() && newData.val() >= 40 && newData.val() <= 240"
        },

        "currentCue": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid",
          ".validate": "newData.hasChildren(['type', 'message', 'subMessage', 'participantStatus', 'updatedAtClient'])"
        },

        "metronome": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid",
          ".validate": "newData.hasChildren(['enabled', 'bpm', 'subdivision', 'accentEvery']) && newData.child('bpm').isNumber() && newData.child('bpm').val() >= 40 && newData.child('bpm').val() <= 240"
        },

        "participants": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid",
            ".validate": "newData.hasChildren(['uid', 'name', 'group', 'joinedAtClient', 'lastSeenClient']) && newData.child('uid').val() === auth.uid && newData.child('name').isString() && newData.child('name').val().length <= 32 && newData.child('group').isNumber() && newData.child('group').val() >= 1 && newData.child('group').val() <= 4"
          }
        }
      }
    }
  }
}
```

Importante: con reglas seguras, el host queda ligado al `uid` anónimo del navegador donde se creó la sala. Si abres el host en otro navegador, Firebase puede bloquear los cambios porque será otro usuario anónimo.

Para el evento, abre la sala desde el computador del host y no borres datos del navegador durante la jornada. La tecnología, tan avanzada, todavía depende de no tocar el botón equivocado.

---

## Cómo crear la sala

1. Publica la app.
2. Abre:

```txt
?host=1&room=MJ30
```

Agrégalo al final de la URL pública que te dé GitHub Pages.

3. Si la sala no existe, se crea automáticamente.
4. Deja ese navegador como host principal.

---

## Cómo entrar como participante

Abre:

```txt
?room=MJ30
```

La persona verá la pantalla de ingreso, podrá escribir su nombre y elegir grupo o dejar automático.

---

## Crear QR para participantes

Usa la URL pública de GitHub Pages con este parámetro al final:

```txt
?room=MJ30
```

Puedes crear el QR con cualquier generador confiable de QR o desde Canva.

Recomendación para el afiche:

```txt
Escanea y únete a la sala rítmica Musicala
Código: MJ30
```

---

## Cambiar patrones

Edita `rhythms.js`.

Cada grupo tiene esta estructura:

```js
{
  id: 1,
  name: "Pies",
  emoji: "👟",
  action: "Marca el pulso con los pies",
  pattern: "1 · 2 · 3 · 4",
  patternDetail: "Golpea el piso en cada tiempo...",
  steps16: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
}
```

`steps16` representa 16 semicorcheas en un compás de 4/4.

- `1` = golpe activo.
- `0` = silencio.

Ejemplo para palmas en 2 y 4:

```js
steps16: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
```

---

## Probar localmente

Por ser JavaScript modular, no abras `index.html` directamente con doble clic. Usa un servidor local.

Con Python:

```bash
python -m http.server 5500
```

Luego abre:

```txt
http://localhost:5500/?host=1&room=MJ30
```

Y en otro navegador o pestaña:

```txt
http://localhost:5500/?room=MJ30
```

---

## Subir a GitHub Pages

1. Crea un repositorio, por ejemplo:

```txt
sala-ritmica-mj
```

2. Sube todos los archivos a la raíz del repo.
3. En GitHub entra a **Settings → Pages**.
4. En **Build and deployment**, selecciona:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Guarda.
6. Abre la URL pública de GitHub Pages.

Cuando GitHub Pages entregue la URL pública, usa estas variantes al final:

```txt
?host=1&room=MJ30
?room=MJ30
```

---

## Flujo sugerido para la actividad principal

1. Preparar
2. Entra Grupo 1
3. Entra Grupo 2
4. Entra Grupo 3
5. Entra Grupo 4
6. Todos juntos
7. Frase coral`r`n8. Silencio
9. Corte final
10. Pose MJ

Patrones principales:

| Grupo | Acción | Patrón |
|---|---|---|
| 1 · Pies | Marca el pulso | 1 · 2 · 3 · 4 |
| 2 · Palmas | Aplaude | 2 y 4 |
| 3 · Piernas | Golpea suave | 1 y 3 |
| 4 · Mesa / vaso | Golpes cortos | 1 · y · 3 · y |

---

## Notas de producción

- No usa backend propio.
- No usa Node en producción.
- No usa frameworks pesados.
- Usa Firebase Authentication anónima.
- Usa Firebase Realtime Database.
- El metrónomo es visual y local para el host, no sincroniza audio.
- La sincronización importante es el `currentCue` en Realtime Database.
- La app está pensada para celular, con botones grandes y textos legibles.
- El archivo `logo.png` es opcional. Si lo pones en la raíz del proyecto, la app lo muestra automáticamente.


---

## Solución de errores de audio y pulso

### El beat no suena

1. Toca **Activar audio**.
2. Sube el volumen del beat.
3. Revisa que el navegador no esté bloqueando audio.
4. Si los samples no cargan, la app debe usar fallback sintético.

### La pista local no carga

Revisa que exista exactamente:

```txt
assets/audio/pista-evento.mp3
```

También puedes usar `.wav`, `.ogg` o `.m4a`, pero si cambias el nombre debes cargarlo por URL directa o ajustar el código.

### Una URL de audio no carga

Causas comunes:

- No es una URL directa a archivo.
- El servidor bloquea CORS.
- El archivo requiere permisos.
- Es una página de reproducción y no un audio real.

Solución práctica: descarga/sube el archivo permitido al proyecto en `assets/audio/` y úsalo localmente.

### El pulso no aparece en participantes

1. Abre el host.
2. Toca **Activar pulso público**.
3. Revisa que los participantes estén conectados a la misma sala.
4. Revisa reglas de Realtime Database para permitir lectura de `rooms/{roomCode}/metronome`.

### El BPM no cambia en participantes

Revisa que el host sea el dueño de la sala. Con reglas seguras, solo el navegador que creó la sala puede cambiar `bpm` y `metronome`.

---

## Caja de ritmos en vivo

Esta versión agrega una **Caja de ritmos en vivo** al panel host, inspirada en el secuenciador Musicala.

El host puede editar una matriz de **4 filas x 16 pasos**:

```txt
              1 e & a | 2 e & a | 3 e & a | 4 e & a
Pies          □ □ □ □ | □ □ □ □ | □ □ □ □ | □ □ □ □
Palmas        □ □ □ □ | □ □ □ □ | □ □ □ □ | □ □ □ □
Piernas       □ □ □ □ | □ □ □ □ | □ □ □ □ | □ □ □ □
Mesa / vaso   □ □ □ □ | □ □ □ □ | □ □ □ □ | □ □ □ □
```

Cada celda puede activarse o desactivarse desde el host. Un mismo paso puede tener varios grupos al tiempo, por ejemplo:

```txt
Paso 1: Pies + Mesa
Paso 5: Palmas
Paso 9: Piernas
Paso 13: Palmas
```

La fuente de verdad está en Firebase:

```txt
rooms/{roomCode}/patterns/{groupId}/steps
```

Los participantes **no editan**. Cada participante ve únicamente el patrón de su grupo, y la fila de 16 pasos se actualiza en tiempo real cuando el host hace cambios. Sí, por fin algo sincronizado sin tener que gritar “¿ya les salió?” treinta veces.

### Presets de patrones

El host puede aplicar estos presets:

- **Base corporal estadio**: patrón principal de la dinámica.
- **Conteo simple**: entradas básicas para ensayo.
- **Estadio intenso**: patrón más cargado para show.
- **Vacío**: limpia todos los pasos.

### Editor rápido por tiempos

Además de la matriz completa, hay un editor rápido por tiempos:

```txt
Tiempo 1 → paso 1
Tiempo 2 → paso 5
Tiempo 3 → paso 9
Tiempo 4 → paso 13
```

Desde ahí el host puede crear combinaciones como:

```txt
Tiempo 1: Pies
Tiempo 2: Palmas
Tiempo 3: Piernas
Tiempo 4: Voz
```

Botones disponibles:

- **Aplicar combinación**: modifica solo los tiempos 1, 2, 3 y 4, sin borrar pasos intermedios.
- **Aplicar y limpiar intermedios**: deja solo los tiempos principales y borra los demás pasos.
- **Limpiar todo**: deja todos los grupos en silencio.
- **Restaurar base**: vuelve al patrón principal.

### Fuente del beat

En **Audio del evento**, el host ahora puede elegir:

- **Preset de audio**: usa los presets internos del motor de audio.
- **Caja de ritmos en vivo**: el beat del host reproduce la matriz editable.

Asignación sonora de la caja en vivo:

```txt
Grupo 1 / Pies        → Kick / stomp
Grupo 2 / Palmas      → Snare / clap
Grupo 3 / Piernas     → Golpe corporal / mesa
Grupo 4 / Mesa / vaso → Click / platillo suave
```

El audio sigue sonando **solo en el dispositivo del host**.

---

## Reglas de Firebase actualizadas para patterns

Para pruebas rápidas, puedes usar:

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

Para una versión más segura de evento, agrega permisos específicos para `patterns`:

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": "auth != null",
        ".write": "auth != null && !data.exists() && newData.child('hostUid').val() === auth.uid",

        "activity": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "mode": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "bpm": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "currentCue": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "metronome": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "patterns": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "participants": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid"
          }
        }
      }
    }
  }
}
```

Si aparece `permission_denied` al editar la caja de ritmos, el problema casi seguro está en las reglas de `patterns`. Firebase, ese portero que no deja pasar ni al baterista si no está en lista.

---

## Nombre visible vs código de sala

La app ahora separa dos conceptos que antes estaban mezclados:

```txt
Código de sala: MJ30
Nombre visible: Salvémoslos del Reggaetón · Especial Michael Jackson
```

### Código de sala

Es el identificador técnico usado en la URL y en Firebase:

```txt
index.html?host=1&room=MJ30
index.html?room=MJ30
rooms/MJ30
```

Cambiar el código de sala **abre o crea otra sala**. No se recomienda cambiarlo durante una sesión en vivo porque el QR de los participantes tendría que cambiar también. Qué sorpresa, incluso un QR tiene problemas de mudanza.

### Nombre visible

Es el título que se muestra en host y participantes. Se guarda en:

```txt
rooms/{roomCode}/title
```

Puede cambiarse desde el panel host sin afectar el QR ni sacar a nadie de la sala.

### Configuración en el host

En el panel host existe una sección llamada **Configuración de sala** con:

- Código actual de sala.
- Campo editable de nombre visible.
- Botón **Guardar nombre**.
- Campo para abrir otra sala por código.

### Normalización del código de sala

El código de sala conserva letras y números. Por ejemplo:

```txt
MJ30 → MJ30
```

No debe convertirse en `MJ0`. Si eso aparece en consola, hay que revisar que la URL tenga realmente `?room=MJ30` y que no haya una versión vieja del archivo en caché.

---

## Reglas recomendadas de desarrollo

Mientras estás construyendo y probando, puedes usar reglas abiertas para usuarios autenticados anónimos:

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": "auth != null",
        ".write": "auth != null",
        "participants": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid"
          }
        }
      }
    }
  }
}
```

Estas reglas son cómodas para desarrollo, no son las más finas para evento real. Básicamente dejan entrar al equipo técnico sin pedir cédula, que para probar sirve, para producción da sustico.

---

## Reglas recomendadas para evento

Estas reglas permiten:

- Leer la sala a cualquier usuario autenticado anónimo.
- Crear una sala nueva si el `hostUid` coincide con el usuario que la crea.
- Permitir al host escribir `title`, `activity`, `mode`, `bpm`, `currentCue`, `metronome` y `patterns`.
- Permitir que cada participante escriba solo su propio nodo.

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": "auth != null",
        ".write": "auth != null && !data.exists() && newData.child('hostUid').val() === auth.uid",

        "title": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid",
          ".validate": "newData.isString() && newData.val().length <= 80"
        },
        "activity": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "mode": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "bpm": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid",
          ".validate": "newData.isNumber() && newData.val() >= 40 && newData.val() <= 240"
        },
        "currentCue": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "metronome": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "patterns": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "updatedAt": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "updatedAtClient": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "participants": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid"
          }
        }
      }
    }
  }
}
```

### Nota sobre `permission_denied`

En esta versión el código evita escribir cambios parciales directamente en:

```txt
rooms/{roomCode}
```

Para evitar bloqueos por reglas segmentadas, ahora escribe directamente en rutas específicas como:

```txt
rooms/{roomCode}/patterns
rooms/{roomCode}/metronome
rooms/{roomCode}/currentCue
rooms/{roomCode}/title
rooms/{roomCode}/bpm
```

Si todavía aparece `permission_denied`, revisa dos cosas:

1. Que la sala haya sido creada por el mismo navegador que está usando el host.
2. Que el nodo `rooms/{roomCode}/hostUid` coincida con el `auth.uid` actual.

Si cambiaste de navegador, borraste caché o pasaste de localhost a GitHub Pages, puede que tengas otro usuario anónimo. En ese caso, borra la sala de prueba y créala de nuevo desde el host.

---

## Actualización: BPM maestro unido a beat, pista y pulso

Esta versión usa un solo **BPM maestro** para todo:

- Beat generado por código.
- Pista cargada localmente o por URL directa.
- Pulso visual del host.
- Pulso visual de participantes.
- Cursor de 16 pasos de la caja de ritmos.

Cuando cambias el BPM desde el host, la app actualiza:

```txt
rooms/{roomCode}/bpm
rooms/{roomCode}/metronome/bpm
AudioEngine.setBpm(bpm)
playbackRate de la pista cargada
```

Si hay audio sonando y cambias el BPM, la app reinicia el reloj visual para evitar que el público quede viendo un tiempo que ya no corresponde. Porque tener tres tempos distintos en una dinámica rítmica sería básicamente inventar el tráfico de Bogotá, pero musical.

### Pistas y BPM

Las pistas cargadas tienen un **BPM base**. La app usa ese BPM base para calcular la velocidad de reproducción:

```txt
playbackRate = BPM maestro / BPM base de la pista
```

Ejemplo:

```txt
Pista base: 96 BPM
BPM maestro: 104 BPM
playbackRate: 1.08x aprox.
```

Para pistas locales (`assets/audio/pista-evento.mp3`), la app toma como BPM base el BPM actual al momento de cargarla. Para pistas demo, usa el `bpm` definido en `demo-tracks.js`.

### Al iniciar audio

Cuando el host toca **Reproducir beat** o **Reproducir pista**:

1. El audio arranca desde el inicio.
2. Se activa `rooms/{roomCode}/metronome`.
3. Se reinicia `startedAt`.
4. Los participantes ven el pulso desde el tiempo 1.

### Al pausar o detener audio

Cuando el host pausa o detiene el beat o la pista:

1. El audio se detiene o pausa.
2. Si ya no queda ningún audio sonando, el pulso público se apaga.
3. El metrónomo se reinicia internamente para que la próxima reproducción vuelva a arrancar desde tiempo 1.

---

## Si sigue apareciendo `permission_denied` al editar

La app ya escribe los patrones directamente en rutas específicas:

```txt
rooms/{roomCode}/patterns/{groupId}
rooms/{roomCode}/patterns
```

Si todavía aparece `permission_denied`, el problema casi seguro está en Firebase, no en la celda del secuenciador.

Durante desarrollo usa estas reglas temporales:

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

Luego borra la sala vieja en:

```txt
Realtime Database → Data → rooms → MJ30 → Delete
```

Y vuelve a abrir:

```txt
index.html?host=1&room=MJ30
```

Si la sala ya tiene un `hostUid` viejo, también puedes probar el botón:

```txt
Tomar control en desarrollo
```

Ese botón solo funciona con reglas abiertas de desarrollo. Con reglas seguras, Firebase no permite cambiar el `hostUid`, porque aparentemente hasta una caja de ritmos necesita seguridad de aeropuerto.




