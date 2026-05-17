# Plan de Implementación: Frontend - Retos Diarios de PannaStreet

Este documento describe detalladamente la hoja de ruta para integrar el frontend de **PannaStreet** con el nuevo sistema de retos diarios del backend desplegado en producción.

---

## 1. Integración de API (`lib/api.ts`)

Añadiremos las funciones para interactuar con los nuevos endpoints del backend.

```typescript
export interface UserGameAttempt {
  id: string;
  userId: string;
  date: string;
  gameId: string;
  modeId: string;
  score: number;
  status: 'won' | 'lost' | 'pending';
}

export interface DailyChallenge {
  date: string;
  gameId: string;
  modeId: string;
  challengeData: any; // Contendrá la estructura específica de cada juego
}

// 1. Obtener reto de hoy
export async function getDailyChallenge(gameId: string, modeId: string, date: string): Promise<DailyChallenge> {
  return fetchApi(`/daily-challenge/${date}/${gameId}/${modeId}`);
}

// 2. Comprobar si el usuario ya ha jugado hoy
export async function getUserTodayAttempt(gameId: string): Promise<UserGameAttempt | null> {
  try {
    return await fetchApi(`/user-game-attempt/today/${gameId}`);
  } catch (error) {
    // Si da 404 o nulo, interpretamos que no ha jugado
    return null;
  }
}

// 3. Registrar el intento del día
export async function saveUserAttempt(gameId: string, points: number, won: boolean): Promise<any> {
  return fetchApi('/user-game-attempt', {
    method: 'POST',
    body: JSON.stringify({ gameId, points, won }),
  });
}
```

---

## 2. Pantalla de Selección de Juegos (`app/(app)/games/page.tsx`)

Para crear una experiencia premium, implementaremos el **Acceso al Reto Diario** en cada juego:
*   En la barra superior o en un banner destacado, mostraremos un indicador global de los retos de hoy.
*   En cada tarjeta de juego (`GameCard`), realizaremos una consulta en segundo plano para verificar si el reto diario de ese juego ya ha sido completado por el usuario (`getUserTodayAttempt`).
*   Si ya fue completado, mostraremos un badge premium verde con el texto **"Challenge Completed ✅"** y la puntuación obtenida.

---

## 3. Selector de Modo: Práctica vs Reto Diario (`GameIntroCard.tsx`)

Modificaremos `GameIntroCard.tsx` para permitir al usuario alternar entre:
1.  **Modo Práctica (Práctica/Infinito):** 
    *   Permite jugar de forma ilimitada sin registrar puntuación.
    *   No tiene restricciones diarias.
2.  **Reto Diario (Daily Challenge):**
    *   Puntúa para el ranking general.
    *   Tiene un límite estricto de **1 intento al día**.
    *   Deshabilita los controles si el usuario ya jugó hoy.

### Diseño Visual Premium
Añadiremos un selector de pestañas (Tabs) moderno y deportivo en la parte superior del menú de configuración del juego en `GameIntroCard.tsx`:
```
+------------------------------------+
|   [ Practice Mode ]  [ DAILY CHALLENGE ]  |  <-- Tabs Deportivos con brillo dorado para el reto diario
+------------------------------------+
```

---

## 4. Controladores y Carga del Juego (Páginas del Juego)

Modificaremos `app/(app)/games/guess-the-player/page.tsx` y `app/(app)/games/11clubs/page.tsx`.

### 4.1 Lógica al Cargar la Página (Mount)
1.  **Comprobar intento previo:** Al entrar, se consulta `getUserTodayAttempt(gameId)`.
2.  **Si ya jugó hoy (Status: Won/Lost):**
    *   Saltamos automáticamente el `GameIntroCard`.
    *   Configuramos `gameOver = true`.
    *   Mostramos una **pantalla premium bloqueada** (descrita en la sección 5).
3.  **Si no ha jugado hoy y elije "Reto Diario":**
    *   Descargamos el reto desde `/api/daily-challenge/:date/:gameId/:modeId`.
    *   **Cero Mocks:** Inyectamos los datos reales:
        *   *Guess the Player:* Fijamos `gameState.target` con el jugador que devuelve la API.
        *   *11 Clubs:* Configuramos la plantilla usando la formación (`formation`) y la lista de clubes (`teams`) devueltas.

### 4.2 Lógica al Terminar el Juego
*   **En Modo Práctica:** Se mantiene el comportamiento actual (se muestra el botón "Play again" y no se llama a las nuevas APIs).
*   **En Modo Reto Diario:**
    1.  Ocultamos el botón "Play Again" en `GameEngine.tsx`.
    2.  Llamamos a `saveUserAttempt(gameId, points, won)` para guardar el intento permanentemente y sincronizar los puntos.

---

## 5. Pantalla de Bloqueo de Reto Completado y Cuenta Atrás

Cuando un usuario ya ha completado su reto diario de hoy, mostraremos una interfaz bloqueada elegante y premium en lugar del juego:

### Elementos de la Interfaz Premium de Bloqueo:
1.  **Cabecera de Estado:**
    *   Si ganó: Una tarjeta dorada brillante con un trofeo y el texto **"DAILY CHALLENGE COMPLETED!"**.
    *   Si perdió/surrendered: Una tarjeta con una tarjeta roja elegante y el texto **"BETTER LUCK TOMORROW!"**.
2.  **Estadísticas de Hoy:** Mostraremos los puntos ganados hoy con tipografía gigante y elegante.
3.  **Temporizador de Cuenta Atrás Dinámica:**
    *   Un reloj de cuenta atrás que muestra exactamente cuánto tiempo falta para el nuevo reto: `00:00:00 hora de Madrid` (CET).
    *   Ejemplo: **"New Daily Challenge in: 08:34:12"** con una animación de latido sutil en los dos puntos.
4.  **Botones Alternativos:**
    *   `[ Ver clasificación general ]` (Redirige a `/leagues`).
    *   `[ Compartir resultado ]` (Copia al portapapeles un resumen con emojis al estilo Wordle: `PannaStreet GTP 17/05 🟩🟩⬛ 150 pts`).
    *   `[ Volver al menú ]` (Redirige a `/games`).

---

## Plan de Verificación

### Pruebas de Flujo Completo:
1.  **Modo Práctica:** Validar que se puede jugar y reiniciar ilimitadas veces sin llamar a los endpoints de intentos.
2.  **Reto Diario - No jugado:** Iniciar partida de reto diario, completarla, y verificar que hace el POST correcto de la puntuación.
3.  **Reto Diario - Ya jugado:** Recargar la página o volver a entrar y asegurar que se muestra la interfaz premium de bloqueo y la cuenta atrás dinámica a medianoche (Madrid).
