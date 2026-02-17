# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MUSICweb is a music marketplace and content platform built with React, TypeScript, Vite, and Tailwind CSS. It's deployed on Vercel with a serverless architecture using Vercel Postgres for database and Vercel Blob for image storage.

## Development Commands

```bash
# Development
npm run dev              # Start Vite dev server

# Build
npm run build            # Run migrations then build for production
npm run migrate          # Run database migrations only

# Quality
npm run lint             # Run ESLint
npm run typecheck        # Type check without emitting files
npm run preview          # Preview production build
```

## Architecture

### Frontend Architecture
- **Single Page Application**: Client-side routing via state management in `App.tsx`
- **Page Navigation**: Uses `currentPage` state with switch/case rendering - no React Router
- **Component Structure**:
  - `src/components/`: Shared components (Navigation, Footer)
  - `src/pages/`: Page components that receive `onNavigate` callback
  - `src/services/`: External service integrations (RSS feeds)

### Backend Architecture (Vercel Serverless)
- **API Routes**: Located in `/api/*.ts` (Vercel Serverless Functions)
- **Database**: Vercel Postgres accessed via `@vercel/postgres`
- **Storage**: Vercel Blob for image uploads
- **Migrations**: Auto-run on build via `scripts/migrate.js`

### Database Migration System
- **Migration Files**: `/db/migrations/*.sql` (numbered sequentially)
- **Execution**: Runs automatically before every build
- **Safety**: Uses `ADD COLUMN IF NOT EXISTS` for idempotency
- **Process**: `scripts/migrate.js` reads and executes all `.sql` files in order

### Key Data Models

**Marketplace Listings** (`listings` table):
```typescript
interface Product {
  id: number;
  title: string;
  artist: string;
  label?: string;      // Optional
  year?: string;       // Optional
  format: string;
  condition: string;
  price: string;
  shipping?: string;   // Optional - displays "TBD" when empty
  image_url: string;
}
```

## Design System

### Theme Colors
- Background: `#1a1d2e` (dark blue-gray)
- Secondary background: `#151825` (darker blue-gray)
- Primary accent: `#FF6B35` (orange)
- Text: white with gray variations

### Styling Approach
- **Tailwind CSS**: Inline utility classes throughout
- **No CSS modules**: All styling via className
- **Dark theme**: Consistent across all pages
- **Responsive**: Mobile-first with sm/md/lg breakpoints

## API Structure

### Listings API (`/api/listings.ts`)
- **GET**: Fetch all listings ordered by `created_at DESC`
- **POST**: Create listing with image upload to Vercel Blob
  - Accepts base64 image data
  - Generates filename: `listings/{timestamp}-{sanitized-title}.jpg`
  - Returns JSON success/error responses

### CORS Configuration
All API endpoints include CORS headers for cross-origin requests.

## Marketplace Admin System

- **Authentication**: Password-based (hardcoded: `musicweb2025`)
- **Admin Mode**: Toggle via Lock icon in header
- **Add Listings**: Admin-only modal form with image upload
- **State Management**: Local React state (no Redux/Context)

## Email Integration

Marketplace "Inquire to Purchase" buttons generate `mailto:` links to `service@musicweb.com` with pre-filled product details.

## News Feed Integration

News page fetches Pitchfork RSS feed via:
- CORS proxy: `https://api.allorigins.win/raw?url=`
- RSS parsing: Custom DOM parser in `src/services/rssService.ts`
- Graceful degradation: Returns empty array on fetch errors

## Page States

Most pages use one of these patterns:
1. **Coming Soon**: Placeholder pages for future features (launches 2026)
2. **Content Pages**: Static content (Home, About)
3. **Dynamic Pages**: Data-fetched content (News, Marketplace)

## Important Patterns

### Navigation
Pass `onNavigate` prop to pages that need routing:
```tsx
<PageComponent onNavigate={setCurrentPage} />
```

### Form State Management
Use controlled components with single state object:
```tsx
const [formData, setFormData] = useState({ field1: '', field2: '' });
onChange={(e) => setFormData({...formData, field1: e.target.value})}
```

### Image Uploads
1. FileReader converts to base64 data URL
2. Store in form state
3. Send as JSON to API
4. API extracts base64, uploads to Vercel Blob
5. Returns public URL for database storage

## Deployment

- **Platform**: Vercel
- **Build Command**: `npm run build` (includes migrations)
- **Environment Variables**: Database credentials via Vercel env
- **Automatic**: Push to main branch triggers deployment
- **Migrations**: Run automatically on every deployment
