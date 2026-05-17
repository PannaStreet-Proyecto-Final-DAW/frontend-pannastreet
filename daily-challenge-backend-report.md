# Informe Técnico: Implementación Backend de Retos Diarios

Este documento resume todos los cambios arquitectónicos implementados en el Backend para soportar la nueva funcionalidad de "Retos Diarios" (One-Try Daily Game) y detalla la lógica de flujo esperada tanto para el Frontend como para la base de datos Supabase.

---

## 1. Cambios Estructurales en la Base de Datos (Supabase)

Se han añadido dos nuevas tablas a través de la migración principal de Sequelize (`20260326000000-initial-schema.cjs`).

### Tabla: `daily_challenges`
Almacena el reto generado automáticamente para cada día, juego y modo.
- `date` (DATEONLY): Fecha del reto (PK).
- `gameId` (STRING): Identificador del juego, ej. 'guess-the-player' (PK).
- `modeId` (STRING): Identificador del modo/dificultad, ej. 'male-easy' (PK).
- `challengeData` (JSONB): Objeto o Array libre con la solución (ej. IDs de jugadores, equipos).
- *Timestamps:* `createdAt`, `updatedAt`.

### Tabla: `user_game_attempts`
Registra el intento único del usuario para un juego en una fecha concreta.
- `id` (UUID): Identificador único del intento (PK).
- `userId` (UUID): Foreign Key apuntando a `users.id`.
- `date` (DATEONLY): Fecha del intento.
- `gameId` (STRING): Juego al que se ha intentado jugar.
- `modeId` (STRING): Modo exacto jugado.
- `score` (INTEGER): Puntuación obtenida.
- `status` (ENUM): Estado del intento (`'pending'`, `'won'`, `'lost'`). El valor por defecto es `'pending'`.
- `history` (JSONB): Registro de acciones/selecciones para poder redibujar la pantalla final si el usuario recarga la página.
- *Timestamps:* `createdAt`, `updatedAt`.
- **Restricción Única:** Existe un Índice Compuesto Único para `['userId', 'date', 'gameId']`. Esto garantiza a nivel de base de datos que **un usuario no pueda tener más de un registro por juego al día**.

---

## 2. Arquitectura Backend (Node.js / Clean Architecture)

Se han implementado todas las capas respetando la Arquitectura Hexagonal del proyecto.

### 2.1. Entidades de Dominio (`src/domain/entities/`)
- `daily-challenge.entity.ts`: Interfaces puras sin dependencias de base de datos.
- `user-game-attempt.entity.ts`: Interfaz pura y el ENUM `AttemptStatus` (`PENDING`, `WON`, `LOST`).

### 2.2. Validaciones Zod (`src/infrastructure/validation/schemas/`)
Se han creado esquemas estrictos para la creación y actualización de datos asegurando la integridad de las entradas:
- `daily-challenge.schema.ts`
- `user-game-attempt.schema.ts`

### 2.3. Casos de Uso (`src/application/use-cases/`)
Todos los casos de uso implementan inyección de dependencias (repositorios e interfaces generadoras de IDs) y validan el input mediante Zod.

*Casos de uso para `DailyChallenge`:*
- `create.use-case.ts`: Valida que no exista ya un reto para esa clave primaria compuesta antes de insertarlo.
- `update.use-case.ts`: Actualiza la data de un reto existente.
- `get-by-date.use-case.ts`: Obtiene el reto de una fecha, juego y modo específico.
- `delete-older-than.use-case.ts`: Elimina retos obsoletos.

*Casos de uso para `UserGameAttempt`:*
- `save.use-case.ts`: Crea o actualiza un intento de usuario. Si se trata de un nuevo registro y no trae ID, genera un UUID de manera agnóstica (`IdGenerator`).
- `get-by-user-and-date.use-case.ts`: Obtiene el registro de un intento para bloquear el acceso si ya existe.
- `delete-older-than.use-case.ts`: Elimina intentos obsoletos de la base de datos.

### 2.4. Modelos y Repositorios (`src/infrastructure/`)
- Se implementaron los modelos `DailyChallengeModel` y `UserGameAttemptModel` usando `sequelize-typescript`.
- Se implementaron las interfaces del dominio en `daily-challenge.repository.impl.ts` y `user-game-attempt.repository.impl.ts`.

---

## 3. Lógica de Flujo: Frontend

El Frontend deberá seguir este flujo para garantizar que no se puedan hacer trampas ni se generen estados inconsistentes:

1. **Al Entrar al Juego:**
   - El Frontend consulta al Backend: *¿Tiene este usuario un intento guardado hoy para este juego?* (`get-by-user-and-date`).
   - **Si existe y está `'won'` o `'lost'`**: El juego se bloquea, se carga el `history` del JSON y se le muestra la pantalla de Game Over/Resumen de hoy.
   - **Si existe y está `'pending'`**: Significa que el usuario recargó la página a mitad del juego. El Frontend carga el `history` (con los jugadores que ya había probado) y le permite continuar desde donde lo dejó.
   - **Si NO existe (`null`)**: El Frontend manda un POST/creación al Backend para iniciar un intento con status **`pending`**. Se le permite jugar.

2. **Durante el Juego (Opcional pero Recomendado):**
   - El Frontend puede ir enviando actualizaciones (`save.use-case.ts`) de la columna `history` cada vez que el usuario hace un movimiento. Así, si cierra el navegador accidentalmente, no pierde el progreso.

3. **Al Finalizar la Partida:**
   - El Frontend manda la actualización final (UPDATE) al Backend modificando el `status` a `'won'` o `'lost'`, guardando la puntuación final (`score`) y el historial definitivo (`history`). A partir de este momento, el juego queda bloqueado para el usuario hasta mañana.

---

## 4. Lógica de Flujo: Cronjob (Próximos Pasos)

La tarea automatizada (Cronjob) que se creará vivirá en el propio servidor Backend y se ejecutará cada medianoche (`00:00:00 UTC`).

Su responsabilidad será:
1. Obtener la fecha del nuevo día.
2. Hacer consultas para generar `challengeData` válidos (Ej. Consultar qué jugadores no han salido recientemente para "Guess the Player").
3. Instanciar y ejecutar el caso de uso `CreateDailyChallengeUseCase` para cada juego y cada modo (género/dificultad).
4. (Mantenimiento) Instanciar y ejecutar los casos de uso `delete-older-than.use-case.ts` pasándole la fecha de corte (por ejemplo, hoy menos 30 días) para eliminar automáticamente retos e intentos antiguos de la base de datos Supabase, evitando la acumulación innecesaria de filas inútiles.
