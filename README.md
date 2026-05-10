# PannaStreet - Frontend

This repository contains the frontend application for **PannaStreet**, a web platform for daily football games. This project has been developed as part of a **Final Degree Project**, with the goal of demonstrating skills in modern web development, user interface design, and frontend architecture.

## Educational Context

This frontend project focuses on the implementation of a modern, reactive, and accessible user interface for a gaming platform. The main objectives of this development include:
- Application of modern design patterns and component architecture.
- Efficient state management and user authentication.
- Responsive design with a premium aesthetic.
- Integration with external services and REST APIs.

## Key Features

### Interactive Games
- **Guess the Player**: A game where users must guess the mystery player based on clues.
- **11 Clubs**: A strategy game to form lineups or guess players from specific clubs.

### User Management and Social
- **Authentication**: User registration and login.
- **Profiles**: Management of user data and preferences.
- **Leagues**: Competitive system to compare scores with other users.

### Design and UX
- **Premium Aesthetic**: Use of backdrop blur effects and subtle borders for a modern style.
- **Dark/Light Mode**: Full support for both themes with smooth transitions.
- **Responsive**: Adapted to mobile and desktop devices.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) and [Radix UI](https://www.radix-ui.com/) (via shadcn/ui)
- **Icons**: [Lucide React](https://lucide.dev/)
- **DB/Auth Client**: [@supabase/supabase-js](https://supabase.com/)

## Project Structure

```text
app/                  # Routing and pages (App Router)
├── (app)/            # Protected and main routes
│   ├── about/        # About page
│   ├── games/        # Game pages
│   ├── leagues/      # Leagues system
│   ├── profile/      # User profile
│   └── ...
├── layout.tsx        # Root layout
└── page.tsx          # Home page / Login
components/           # Reusable React components
├── ui/               # Base components (shadcn/ui)
└── ...
lib/                  # Utilities, contexts, and configuration
├── api.ts            # API client
├── auth-context.tsx  # Authentication context
└── ...
```

## Installation and Setup

To run this project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone <REPOSITORY_URL>
   cd frontend-pannamaster
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file in the root of the project and add the necessary variables (you can use the existing `.env` file as a guide).

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## License

This project is for educational use within the framework of a Final Degree Project.