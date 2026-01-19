# Pathos

A full-stack web application for discovering and curating thematic film collections. Built to demonstrate modern full-stack development practices with a focus on clean architecture, security, and user experience.

[Live Demo](#) | [Repository](https://github.com/Micah-Pirikski/Pathos)

---

## Project Overview

**Pathos** is a production-ready web application that allows users to browse curated films and enables administrators to manage content. The application implements complete authentication, authorization, and CRUD operations with a clean separation between frontend and backend.

### Key Features

- **User Authentication** - JWT-based auth with secure password hashing
- **Role-Based Access Control** - Curator and viewer permissions
- **Film Management** - Full CRUD operations with image optimization
- **Responsive Design** - Mobile-first UI with theme-based styling
- **Optimized Performance** - Client-side image compression, lazy loading
- **Modern Stack** - React 18, Node.js, PostgreSQL, Prisma ORM

---

## Architecture

### Technology Stack

**Frontend:**

- React 18 with Hooks
- React Router for client-side navigation
- Vite for fast development and optimized builds
- CSS Grid/Flexbox for responsive layouts

**Backend:**

- Node.js with Express.js
- PostgreSQL database
- Prisma ORM for type-safe database access
- JWT for stateless authentication
- bcryptjs for password hashing

**DevOps:**

- npm-run-all for parallel development
- Nodemon for auto-reload
- Database migrations for schema versioning

### Design Patterns

1. **Middleware Chain Pattern** - Reusable authentication and authorization middleware

   ```javascript
   app.post("/api/movies", verifyToken, isCurator, handler);
   // Checks cascade: token → curator status → handler
   ```

2. **Singleton Pattern** - Prevents connection leaks in development

   ```javascript
   export const prisma = globalForPrisma.prisma || new PrismaClient();
   ```

3. **Initialization Functions** - Efficient state hydration from localStorage

   ```javascript
   const [user, setUser] = useState(() => {
     const stored = localStorage.getItem("user");
     return stored ? JSON.parse(stored) : null;
   });
   ```

4. **SPA Fallback Routing** - Single server handles frontend and API
   ```javascript
   // Non-API routes serve index.html (React Router handles navigation)
   // API routes return JSON or 404
   ```

### API Design

RESTful API with standard HTTP methods:

```
GET    /api/movies              # List all films
GET    /api/movies/:slug        # Get single film
POST   /api/movies              # Create film (curator only)
PUT    /api/movies/:id          # Update film (curator only)
DELETE /api/movies/:id          # Delete film (curator only)
GET    /api/themes              # Get available themes

POST   /api/auth/register       # User registration
POST   /api/auth/login          # User login
```

### Database Schema

Two core models with proper constraints:

**Movies Table:**

- Auto-incrementing ID with unique slug constraint
- Arrays for intrigues and still images (PostgreSQL native feature)
- Theme-based categorization
- Featured flag for homepage display
- Timestamps for audit trail

**Users Table:**

- CUID for privacy (vs. sequential IDs)
- Hashed passwords (never stored plain text)
- Curator role for content management
- Created timestamp

---

## Getting Started

### Prerequisites

- Node.js 16+
- PostgreSQL 12+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/Micah-Pirikski/Pathos.git
cd Pathos

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# Run migrations
npx prisma migrate deploy

# Seed database with sample data
npm run prisma:seed

# Start development server
npm run dev
```

Server runs on `http://localhost:4000`
Frontend runs on `http://localhost:5173`

---

## Key Implementation Highlights

### Security

- **Password Hashing**: bcryptjs with salt rounds for resistant password storage
- **JWT Tokens**: 1-hour expiry for minimal attack surface
- **Role-Based Access**: Curator verification before sensitive operations
- **Input Validation**: Required field checks on API endpoints
- **CORS**: Properly configured for frontend-backend communication

### Performance

- **Image Optimization**: Client-side compression to base64 (80% quality, max 400x600px)
- **Lazy Loading**: Pagination with "Load More" pattern
- **Lazy Image Loading**: Image lazy loads on scroll
- **Race Condition Prevention**: Cleanup flags in async effects
- **Static Asset Serving**: Express serves optimized client bundle

### Code Quality

- Clean separation of concerns (frontend/backend/database)
- Minimal dependencies (only essential packages)
- Consistent error handling with specific error codes
- Reusable middleware for cross-cutting concerns
- Environment-based configuration

### User Experience

- Loading skeleton screens
- Real-time form validation
- Persistent authentication (localStorage)
- Theme-based color schemes for visual consistency
- Responsive navigation with mobile support

---

## Project Metrics

- **Backend**: 228 lines (2 files)
- **Frontend**: ~2000 lines (8+ components)
- **Database**: 2 tables with proper relationships
- **API Endpoints**: 8 routes with full CRUD
- **Auth Flows**: Registration, Login, JWT verification, Logout
- **Average Response Time**: <100ms

---

## What This Project Demonstrates

**Full-Stack Development**: Complete application from database to UI  
**Database Design**: Migrations, constraints, proper schema modeling  
**API Development**: RESTful design, error handling, authentication  
**Frontend Engineering**: Modern React patterns, routing, state management  
**Security**: Password hashing, JWT auth, role-based access control  
**DevOps**: Environment configuration, database migrations  
**Code Architecture**: Clean code, reusable patterns, maintainability  
**UX Attention**: Loading states, error feedback, responsive design

---

## How It Works

### User Flow

1. User lands on homepage → sees featured films
2. User explores `/movies` → filters by theme
3. User clicks film → sees detailed view
4. User logs in → gets JWT token stored in localStorage
5. Curator logs in → gains access to admin panel
6. Curator creates/edits/deletes films → API verifies role
7. User logs out → token cleared, redirected home

### Request Flow

```
Browser (React)
    ↓ fetch("/api/movies")
Express Server
    ↓ middleware: verify JWT, check curator status
Prisma ORM
    ↓ query builder
PostgreSQL
    ↓ executes SQL
    ↑ returns rows
Prisma ORM
    ↓ serializes to JSON
Express Server
    ↓ res.json(movies)
Browser
    ↓ state update, re-render
User sees films
```

---

## Development

### Available Scripts

```bash
npm run dev              # Start both frontend and backend in watch mode
npm run dev:server      # Start only backend with nodemon
npm run dev:client      # Start only frontend with Vite
npm run build           # Build frontend for production
npm run start           # Run production build
npm run prisma:seed     # Run database seeder
```

### Code Organization

```
/server
  ├── server.js         # Express app, route handlers, middleware
  └── prismaClient.js   # Database connection singleton

/client/src
  ├── pages/            # Route components (Home, Movies, Admin, etc)
  ├── components/       # Reusable UI components
  └── styles/           # Global CSS with CSS variables

/prisma
  ├── schema.prisma     # Database schema definition
  ├── migrations/       # SQL migration files
  └── seed.js           # Database seeding script
```

---

## Architectural Decisions

**Why Prisma?**

- Type-safe queries without raw SQL
- Automatic migrations
- Better DX than query builders
- Works great for this scale

**Why PostgreSQL?**

- Mature, reliable, free
- Native array support (used for intrigues/stills)
- Excellent full-text search if needed later
- JSONB for flexible data

**Why JWT?**

- Stateless (no session storage needed)
- Standard across industry
- Easy to scale horizontally
- Works for mobile/SPA apps

**Why React + Vite?**

- Fast development experience
- Modern build tooling
- Small bundle size
- Large ecosystem

**Why One Server (not separated)?**

- Simpler deployment
- No CORS issues
- Better for this application size
- Could be separated later without code changes

---

## Scaling Considerations

If this app grew to 100k users:

**Database:** Add indexes on `slug`, `theme`, `email`. Consider read replicas.  
**Search:** Implement full-text search with PostgreSQL or Elasticsearch  
**Caching:** Add Redis layer for frequently accessed films  
**CDN:** Store images on S3/CloudFront instead of database  
**API:** Rate limiting, pagination optimization, query complexity analysis  
**Frontend:** Code splitting, image optimization, service workers  
**Monitoring:** Error tracking (Sentry), performance monitoring (Datadog)

---

## Future Enhancements

- User ratings and reviews
- Film recommendations engine
- Advanced search and filtering
- Email notifications
- Admin analytics dashboard
- Automated tests (Jest, React Testing Library)
- GraphQL API option
- Mobile app

---

## License

MIT

---

## Author

Built as a demonstration of full-stack web development principles.

For questions about the architecture or implementation, see code comments and git history.

---

**Want to see it in action?** Clone the repo and run `npm install && npm run dev`
