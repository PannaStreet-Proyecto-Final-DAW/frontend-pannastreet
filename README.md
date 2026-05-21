# PannaStreet - Frontend

## English Version

This repository contains the frontend application for **PannaStreet**, a web platform for daily football games. This project has been developed as part of a **Final Degree Project**, with the goal of demonstrating skills in modern web development, user interface design, and frontend architecture.

### Educational Context

This frontend project focuses on the implementation of a modern, reactive, and accessible user interface for a gaming platform. The main objectives include:
- Application of modern design patterns and modular component architecture.
- Efficient state management and user authentication.
- Responsive design with a polished and consistent aesthetic.
- Integration with external services and REST APIs using centralized clients.

## Key Features

### Modular Architecture
- **Console/Cartridge Pattern**: Decoupling of the generic game engine (`GameEngine`) from the specific game logic (`Cartridges`), allowing for high extensibility.
- **Custom Hook System**: Centralized business logic for scoring formulas, player searching, and backend synchronization.

### Interactive Games
- **Guess the Player**: A game where users must guess the mystery player based on clues.
- **11 Clubs**: A strategy game to form lineups or guess players from specific clubs.

### User Management and Social
- **Authentication**: User registration and login.
- **Profiles**: Management of user data and preferences.
- **Leagues**: Community system to compare scores and track performance across the platform.

### Design and UX
- **Modern UI**: Clean interface using backdrop blur effects and refined borders for a contemporary look.
- **Adaptive Themes**: Full support for Dark and Light modes with smooth transitions.
- **Mobile First**: Adapted to mobile and desktop devices.

### Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router) & [React 19](https://react.dev/)
- **Logic**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **DB**: [Supabase](https://supabase.com/)

### Project Structure
```text
frontend-pannastreet/
├── app/                  # Routing and page definitions
│   ├── (app)/            # Authenticated application core
│   │   ├── games/        # Game cartridges entry points
│   │   ├── leagues/      # Community and competitive systems
│   │   └── profile/      # User management
│   ├── (footer)/         # Static and informational pages
│   │   ├── about/        # About page
│   │   ├── privacy/      # Privacy policy
│   │   └── terms/        # Terms of service
├── components/           # UI Component library
│   ├── games/            # Modular game system
│   │   ├── engine/       # Generic game orchestrator (The Console)
│   │   ├── cartridges/   # Individual game implementations (The Cartridges)
│   │   ├── shared/       # Reusable game UI (Search, Sync indicators)
│   │   └── ui/           # Game-specific visual components
│   ├── layout/           # App-wide structure (Navbar, Sidebar)
│   └── ui/               # Base design system primitives
├── hooks/                # Specialized business logic (Custom Hooks)
├── lib/                  # Utilities, API clients, and constants
├── public/               # Static assets (Images, Pitch textures)
└── types/                # Global TypeScript definitions
```

### Folder Breakdown

- **`app/`**: Contains the routing logic and page definitions. The `(app)` group handles authenticated routes, while the `(footer)` group contains static and informational pages (About, Privacy Policy, Terms of Service).
- **`components/`**: Organized by domain. The `games` folder follows the "Console/Cartridge" pattern for decoupled game logic.
- **`hooks/`**: Custom hooks that encapsulate stateful business logic (e.g., scoring, searching).
- **`lib/`**: Core utilities, API clients, and the authentication context.
- **`public/`**: Static assets like images and textures used throughout the app.
- **`types/`**: Centralized TypeScript definitions to ensure data consistency.

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <REPOSITORY_URL>
   cd frontend-pannastreet
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment variables**:
   Create a `.env.local` file with your Supabase keys.

4. **Run the server**:
   ```bash
   npm run dev
   ```

## Testing
The project includes a suite of unit tests powered by **Vitest** and **React Testing Library**. The testing strategy follows the **Colocation** pattern, where test files reside next to their corresponding source files to improve maintainability and visibility.

- **Hook Testing**: Business logic validation for game mechanics (`useGameLogic`), name normalization (`useNormalization`), and player search results.
- **Component Testing**: Verification of interactive UI elements like the difficulty selector.
- **Utility Testing**: Validation of helper functions such as the country-to-ISO mapper.

To run the tests:
```bash
npm run test
```

## License
This project is for educational use within the framework of a Final Degree Project.


## Versión en Español

Este repositorio contiene la aplicación frontend de **PannaStreet**, una plataforma web de juegos diarios de fútbol. Este proyecto ha sido desarrollado como parte de un **Trabajo de Fin de Grado**, con el objetivo de demostrar habilidades en desarrollo web moderno, diseño de interfaces de usuario y arquitectura frontend.

### Contexto Educativo

Este proyecto se centra en la implementación de una interfaz moderna, reactiva y accesible. Los objetivos principales incluyen:
- Aplicación de patrones de diseño modernos y arquitectura modular de componentes.
- Gestión eficiente del estado y autenticación de usuarios.
- Diseño responsive con una estética cuidada y consistente.
- Integración con servicios externos y APIs REST.

## Características Principales

### Arquitectura Modular
- **Patrón Consola/Cartucho**: Desacoplamiento del motor de juego genérico (`GameEngine`) de la lógica específica de cada juego (`Cartridges`).
- **Sistema de Hooks Personalizados**: Lógica de negocio centralizada para fórmulas de puntuación, búsqueda de jugadores y sincronización con el backend.

### Juegos Interactivos
- **Guess the Player**: Un juego donde los usuarios deben adivinar al jugador misterioso basándose en pistas.
- **11 Clubs**: Un juego de estrategia para formar alineaciones o adivinar jugadores de clubes específicos.

### Gestión de Usuarios y Social
- **Autenticación**: Registro e inicio de sesión de usuarios.
- **Perfiles**: Gestión de datos y preferencias del usuario.
- **Ligas**: Sistema competitivo para comparar puntuaciones con otros usuarios.

### Diseño y UX
- **Interfaz Moderna**: Uso de efectos backdrop blur y bordes refinados para un estilo contemporáneo.
- **Modo Claro/Oscuro**: Soporte completo para ambos temas con transiciones suaves.
- **Responsive**: Adaptado a dispositivos móviles y de escritorio.

### Stack Tecnológico
- **Framework**: [Next.js](https://nextjs.org/) (App Router) y [React 19](https://react.dev/)
- **Lógica**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) y [shadcn/ui](https://ui.shadcn.com/)
- **Iconos**: [Lucide React](https://lucide.dev/)
- **Base de Datos**: [Supabase](https://supabase.com/)

### Estructura del Proyecto

```text
frontend-pannastreet/
├── app/                  # Definición de rutas y páginas
│   ├── (app)/            # Núcleo de la aplicación (Autenticado)
│   │   ├── games/        # Puntos de entrada de los juegos
│   │   ├── leagues/      # Sistemas competitivos y clasificaciones
│   │   └── profile/      # Gestión de perfil
│   ├── (footer)/         # Páginas estáticas e informativas
│   │   ├── about/        # Página "Acerca de"
│   │   ├── privacy/      # Política de privacidad
│   │   └── terms/        # Términos de servicio
├── components/           # Biblioteca de componentes UI
│   ├── games/            # Arquitectura modular de juegos
│   │   ├── engine/       # Orquestador genérico (La Consola)
│   │   ├── cartridges/   # Implementaciones de juegos (Los Cartuchos)
│   │   ├── shared/       # UI reutilizable (Buscador, indicadores)
│   │   └── ui/           # Componentes visuales de juego
├── hooks/                # Lógica de negocio especializada (Hooks)
├── lib/                  # Utilidades, clientes API y constantes
├── public/               # Archivos estáticos (Imágenes, texturas)
└── types/                # Definiciones globales de TypeScript
```

### Desglose de Carpetas

- **`app/`**: Contiene la lógica de enrutamiento. El grupo `(app)` maneja las rutas protegidas, mientras que el grupo `(footer)` contiene páginas estáticas e informativas (Acerca de, Privacidad, Términos).
- **`components/`**: Organizado por dominio. La carpeta `games` sigue el patrón "Consola/Cartucho".
- **`hooks/`**: Hooks personalizados que encapsulan la lógica de negocio (puntuación, búsqueda).
- **`lib/`**: Utilidades core, clientes de API y el contexto de autenticación.
- **`public/`**: Archivos estáticos como imágenes y texturas.
- **`types/`**: Definiciones de TypeScript para asegurar la consistencia de los datos.

## Instalación y Configuración

1. **Clonar el repositorio**:
   ```bash
   git clone <REPOSITORY_URL>
   cd frontend-pannastreet
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Variables de entorno**:
   Crea un archivo `.env.local` con tus claves de Supabase.

4. **Ejecutar el servidor**:
   ```bash
   npm run dev
   ```

## Testing
El proyecto incluye una suite de pruebas unitarias utilizando **Vitest** y **React Testing Library**. La estrategia de pruebas sigue el patrón **Colocation**, donde los archivos de prueba residen junto a sus archivos de origen correspondientes para mejorar el mantenimiento y la visibilidad.

- **Pruebas de Hooks**: Validación de la lógica de negocio para las mecánicas del juego (`useGameLogic`), normalización de nombres (`useNormalization`) y resultados de búsqueda de jugadores.
- **Pruebas de Componentes**: Verificación de elementos interactivos de la interfaz de usuario como el selector de dificultad.
- **Pruebas de Utilidades**: Validación de funciones auxiliares como el mapeador de países a códigos ISO.

Para ejecutar las pruebas:
```bash
npm run test
```

## Licencia
Este proyecto es de uso educativo en el marco de un Trabajo de Fin de Grado.
