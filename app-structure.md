# SaaS Note-Taking App Project Structure

```
saas-note-taking-app/
├── README.md
├── package.json
├── nuxt.config.ts
├── tsconfig.json
├── vitest.config.ts
├── cypress.config.ts
├── .gitignore
├── .env
├── components/
│   ├── Note.vue
│   ├── Task.vue
│   ├── Folder.vue
│   ├── Comment.vue
│   ├── Dashboard.vue
│   └── StatusHandler.vue
├── pages/
│   ├── index.vue
│   ├── dashboard.vue
│   ├── login.vue
│   ├── signup.vue
│   └── notes/
│       ├── index.vue
│       └── [id].vue
├── layouts/
│   └── default.vue
├── server/
│   ├── api/
│   │   ├── notes.ts
│   │   ├── tasks.ts
│   │   ├── users.ts
│   │   ├── comments.ts
│   │   └── auth.ts
│   ├── db/
│   │   └── index.ts
│   ├── middleware/
│   │   └── auth.ts
│   └── services/
│       └── authService.ts
├── utils/
│   ├── auth.ts
│   └── helpers.ts
├── stores/
│   ├── notes.ts
│   └── auth.ts
├── types/
│   └── index.ts
├── tests/
│   └── unit/
│       ├── components/
│       │   └── Dashboard.test.ts
│       └── stores/
│           └── notes.test.ts
├── cypress/
│   └── e2e/
│       └── notes.cy.ts
├── plugins/
│   └── api.ts
├── phase4-todo.md
├── phase5-todo.md
└── app-structure.md
```

## File Descriptions

### Root Files
- `README.md`: Project overview, setup instructions, and features
- `package.json`: Project dependencies and scripts
- `nuxt.config.ts`: Nuxt 3 configuration
- `tsconfig.json`: TypeScript configuration
- `vitest.config.ts`: Vitest configuration for unit testing
- `cypress.config.ts`: Cypress configuration for end-to-end testing
- `.gitignore`: Git ignore file
- `.env`: Environment variables (e.g., JWT secret)

### Components
- `Note.vue`: Component for displaying and editing individual notes
- `Task.vue`: Component for task management within notes
- `Folder.vue`: Component for folder structure and navigation
- `Comment.vue`: Component for displaying and adding comments
- `Dashboard.vue`: Main dashboard component
- `StatusHandler.vue`: Component for handling loading and error states

### Pages
- `index.vue`: Home page
- `dashboard.vue`: User dashboard page
- `login.vue`: Login page
- `signup.vue`: Signup page
- `notes/index.vue`: List of all notes
- `notes/[id].vue`: Individual note view/edit page

### Layouts
- `default.vue`: Default layout for the application

### Server
- `api/`: API routes for notes, tasks, users, comments, and authentication
- `db/index.ts`: Database connection and setup
- `middleware/auth.ts`: Authentication middleware
- `services/authService.ts`: Authentication service

### Utils
- `auth.ts`: Authentication utilities
- `helpers.ts`: General helper functions

### Stores
- `notes.ts`: Pinia store for managing notes state
- `auth.ts`: Pinia store for managing authentication state

### Types
- `index.ts`: TypeScript type definitions

### Tests
- `unit/`: Unit tests for components and stores using Vitest
- `cypress/e2e/`: End-to-end tests using Cypress

### Plugins
- `api.ts`: Plugin for API request handling and authentication

### Project Management
- `phase4-todo.md`: Todo list and progress tracking for Phase 4
- `phase5-todo.md`: Todo list and planning for Phase 5
- `app-structure.md`: This file, describing the project structure

## Key Features
- Nuxt 3 framework with Vue 3 and TypeScript
- Pinia for state management
- Server-side rendering and API routes
- JWT authentication
- SQLite database (with option to scale to other databases)
- Unit testing with Vitest
- End-to-end testing with Cypress
- Responsive design with Tailwind CSS (via @nuxt/ui)

## Development Workflow
1. Run `npm install` to install dependencies
2. Use `npm run dev` for development
3. Run `npm run test:unit` for unit tests
4. Run `npm run test:integration` for end-to-end tests
5. Use `npm run build` and `npm run start` for production