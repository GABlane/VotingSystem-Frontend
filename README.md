# QR Voting System - Frontend

Modern Next.js web application for a real-time QR code voting system with admin dashboard and public voting interface.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling (Framer-style dark theme)
- **Zustand** - State management
- **Axios** - HTTP client
- **Supabase JS Client** - Realtime subscriptions
- **FingerprintJS** - Browser fingerprinting

## Features

- 🎨 Modern dark theme (Framer-inspired design)
- 🔐 Admin authentication with JWT
- 📊 Real-time vote updates
- 📱 Responsive design (mobile-first)
- 🖼️ Direct file upload for project logos
- 📲 QR code display and download
- ⚡ Live dashboard with Supabase Realtime
- 🎯 One vote per device (fingerprinting)

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see backend README)
- Supabase project configured

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env.local` file in the frontend root:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Supabase Configuration (for Realtime)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...  # JWT with role:"anon"
```

### Important Notes
- All frontend env vars must be prefixed with `NEXT_PUBLIC_`
- Use the ANON_KEY (not SERVICE_ROLE_KEY) for frontend
- The backend API must be running and accessible

## Running the App

### Development Mode
```bash
npm run dev
```

App runs on `http://localhost:3000`

### Production Build
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

## Project Structure

```
frontend/
├── app/
│   ├── admin/
│   │   ├── layout.tsx           # Admin layout with auth protection
│   │   ├── login/               # Admin login page
│   │   ├── dashboard/           # Admin dashboard
│   │   └── projects/
│   │       ├── create/          # Create project page
│   │       └── [id]/
│   │           ├── edit/        # Edit project page
│   │           └── results/     # Results & QR code page
│   │
│   ├── vote/
│   │   └── [projectId]/         # Public voting page
│   │
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout with metadata
│   └── globals.css              # Global styles + Tailwind
│
├── components/
│   ├── admin/
│   │   ├── Navbar.tsx           # Admin navigation bar
│   │   ├── ProjectCard.tsx      # Project card component
│   │   ├── ProjectForm.tsx      # Create/edit project form
│   │   └── QRCodeDisplay.tsx    # QR code display component
│   │
│   └── common/
│       └── LoadingSpinner.tsx   # Loading spinner
│
├── lib/
│   ├── api/
│   │   ├── axios.ts             # Axios instance with interceptors
│   │   ├── projects.ts          # Projects API client
│   │   └── votes.ts             # Votes API client
│   │
│   ├── stores/
│   │   └── authStore.ts         # Zustand auth store
│   │
│   └── supabase/
│       └── client.ts            # Supabase client for Realtime
│
├── hooks/
│   ├── useAuth.ts               # Authentication hook
│   ├── useFingerprint.ts        # Browser fingerprinting hook
│   └── useRealtimeProjects.ts   # Realtime projects hook
│
├── public/
│   └── logo.png                 # App logo (transparent)
│
└── .env.local                   # Environment variables
```

## Pages & Routes

### Public Routes

#### Landing Page
- **Route:** `/`
- **Features:** Hero section, feature showcase, call-to-action

#### Voting Page
- **Route:** `/vote/:projectId`
- **Features:**
  - Project information with logo
  - Vote button
  - Real-time vote count
  - Already voted state
  - Vote success animation

### Admin Routes (Protected)

#### Login
- **Route:** `/admin/login`
- **Features:** Email/password authentication

#### Dashboard
- **Route:** `/admin/dashboard`
- **Features:**
  - Project statistics
  - Project list with real-time updates
  - Quick actions (create, edit, delete, view results)

#### Create Project
- **Route:** `/admin/projects/create`
- **Features:**
  - Project form (title, description, logo upload)
  - QR code generation on success
  - QR code download

#### Edit Project
- **Route:** `/admin/projects/:id/edit`
- **Features:**
  - Pre-filled form
  - Logo update
  - Active/inactive toggle

#### Results & QR Code
- **Route:** `/admin/projects/:id/results`
- **Features:**
  - Real-time vote count
  - QR code display
  - Downloadable high-res QR code
  - Vote URL (copyable)
  - Recent votes list

## Key Features Explained

### Authentication
- JWT token stored in Zustand store
- Axios interceptor adds token to requests
- Protected routes redirect to login if not authenticated
- Auto-logout on 401 responses

### File Upload
- Direct file upload (no external URLs needed)
- Client-side validation (5MB max, images only)
- Preview before upload
- Uploaded to Supabase Storage via backend

### Real-time Updates
- Dashboard subscribes to Supabase Realtime
- Projects update live when created/edited/deleted
- Vote counts increment in real-time
- No manual refresh needed

### Browser Fingerprinting
- FingerprintJS generates unique device ID
- Prevents duplicate votes from same device
- IP address also tracked as fallback

### QR Code System
- Auto-generated on project creation
- Displayed on results page
- Downloadable as high-res PNG (1000x1000px)
- Can be regenerated if missing

## Styling

### Theme
- Dark theme inspired by Framer
- CSS variables for colors (defined in globals.css)
- Smooth animations and transitions
- Glass-morphism effects

### Colors
```css
--background: #0a0a0a
--surface: #141414
--surface-elevated: #1a1a1a
--border: #272727
--primary: #ffffff
--secondary: #888888
```

### Components
- Card components with subtle borders
- Buttons with hover states
- Input fields with focus states
- Smooth fade-in animations

## API Integration

### Projects API
```typescript
import { projectsApi } from '@/lib/api/projects';

// List projects
const projects = await projectsApi.getAll();

// Create project
const project = await projectsApi.create({ title, description });

// Upload logo
await projectsApi.uploadLogo(projectId, file);

// Download QR code
const blob = await projectsApi.downloadQR(projectId);
```

### Votes API
```typescript
import { votesApi } from '@/lib/api/votes';

// Cast vote
await votesApi.vote(projectId, fingerprint);

// Check if voted
const { hasVoted } = await votesApi.checkVote(projectId, fingerprint);
```

## State Management

### Auth Store (Zustand)
```typescript
import { useAuth } from '@/hooks/useAuth';

const { token, login, logout, isAuthenticated } = useAuth();

// Login
await login(email, password);

// Logout
logout();
```

## Common Issues

### Black Screen on Startup
- Clear `.next` folder: `rm -rf .next`
- Check CSS import order in globals.css
- Verify all env vars are set

### API Requests Failing
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify backend is running
- Check browser console for CORS errors

### Real-time Updates Not Working
- Verify Supabase URL and ANON_KEY are correct
- Check Supabase Realtime is enabled for your project
- Look for WebSocket connection errors in console

### File Upload Not Working
- Check backend is accepting multipart/form-data
- Verify file size < 5MB
- Check file type is an image

### Images Not Loading (Logo/QR)
- Hard refresh: Cmd/Ctrl + Shift + R
- Check image paths are correct
- Verify images exist in `/public` folder

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repo
   - Set root directory to `frontend`

3. **Environment Variables**
   Add in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL` → Your Railway/Render backend URL
   - `NEXT_PUBLIC_SUPABASE_URL` → Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Supabase anon key

4. **Deploy**
   - Vercel auto-deploys on every push
   - Production URL: `your-project.vercel.app`

### Other Platforms
- **Netlify:** Similar to Vercel, good Next.js support
- **Cloudflare Pages:** Free tier, global CDN
- **Self-hosted:** Run `npm run build && npm start`

## Performance Optimizations

- Next.js Image component for optimized images
- Lazy loading for components
- Supabase Realtime subscriptions (efficient WebSocket)
- Minimal JavaScript bundle size
- Edge functions on Vercel

## Security

### Current Implementation
- ✅ JWT token stored in memory (Zustand)
- ✅ HTTPS only in production
- ✅ CORS handled by backend
- ✅ No sensitive data in client code
- ✅ File upload validation

### Production Recommendations
- Enable CSP (Content Security Policy)
- Use environment-specific API URLs
- Implement rate limiting on frontend
- Add input sanitization
- Monitor for XSS vulnerabilities

## Troubleshooting

### Build Errors
```bash
# Clear cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run build
```

### Runtime Errors
- Check browser console (F12)
- Verify all env vars are set
- Check network tab for failed requests
- Ensure backend is accessible

## License

MIT

## Support

For issues or questions, check the main project CLAUDE.md or backend README.
