# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands

```bash
# Development
bun run dev                      # Start development server with Supabase auto-start
bun run build                    # Build for production
bun run start                    # Start production server
bun run lint                     # Run ESLint

# Database (Supabase)
bun run db:start                 # Start Supabase locally
bun run db:stop                  # Stop Supabase
bun run db:reset                 # Reset local database
bun run db:push:local           # Push schema to local DB
bun run db:types                # Generate TypeScript types from DB schema
bun run db:new                  # Create new migration
bun run db:status               # List migration status

# Deployment (Branch-specific)
bun run deploy:dev              # Deploy dev branch to app.dev.instantbranding.ai
bun run deploy:prod             # Deploy main branch to app.instantbranding.ai
bun run preview:dev             # Preview dev build locally
bun run preview:prod            # Preview production build locally
```

### Environment Setup

- Copy `.env.sample` to `.env.local` for local development
- Environment files: `.env.dev` for development, `.env.production` for production
- Database runs on port 54321 (API), 54322 (DB), 54323 (Studio)

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (PostgreSQL) with local development
- **Authentication**: Supabase Auth (email/password + Google OAuth)
- **Deployment**: Cloudflare Workers via OpenNext.js
- **Payment**: Paddle integration
- **Analytics**: PostHog
- **Package Manager**: Bun

### State Management Architecture

The app uses Context API with three main contexts:

1. **AppContext** (`contexts/AppContext/`): Global app state, user auth, loading states
2. **BrandContext** (`contexts/BrandContext/`): Brand configuration (colors, typography, dark mode)
3. **AssetContext** (`contexts/AssetContext/`): Asset management and template data

Each context follows the pattern: `Context.tsx` → `types.ts` → `helpers/` (actions, initialState, logic)

### Module Structure

Main application modules in `modules/`:

- **Main**: Entry point with sidebar and main content area
- **Brand**: Brand management and template selection
- **Canvas**: Template rendering and editing canvas
- **ControlPanel**: Form controls for editing content
- **StylePanel**: Export functionality and style controls

### Template System

Templates are organized by category in `components/instant-branding/`:

- `social-banner/` - Social media banners (11 templates)
- `social-post/` - Social media posts (4 templates)
- `quote-card/` - Quote cards (6 templates)
- `featured-post/` - Featured posts (6 templates)
- `mockup-post/` - Mockup posts (4 templates)
- `textimg-post/` - Text + image posts (6 templates)
- `social-carousel/` - Carousel templates (1 template)

Each template category has:

- Individual template components (`Template1.tsx`, etc.)
- Shared styles file (`-styles.ts`)
- Template wrapper in `modules/Canvas/components/`

### Component Architecture

- **UI Components**: `components/ui/` - shadcn/ui components
- **Business Components**: `components/` - Custom app components
- **Reusable Elements**: `components/instant-branding/components/` - Shared template elements

### Key Patterns

#### Template Data Pattern

Templates use dynamic data from `common/constants/template-data.ts`:

```typescript
export const templateData: TemplateData = {
  "social-banner": {
    default: { title: "...", description: "...", imageUrl: "..." },
    "1": {
      /* template 1 specific data */
    },
  },
};
```

#### Context Actions Pattern

All contexts use action helpers for state updates:

```typescript
// In actions.ts
export const actions = {
  setColors: (setState: SetState, colors: Partial<Brand["colors"]>) => {
    setState((prev) => ({
      ...prev,
      brand: {
        ...prev.brand,
        colors: { ...prev.brand?.config?.colors, ...colors },
      },
    }));
  },
};
```

#### Template Wrapper Pattern

Each template type has a wrapper component that handles common logic:

```typescript
// Example: SocialBannerWrapper
- Handles template selection
- Manages shared styles
- Provides common editing interface
```

### Database Schema

Key tables (see `supabase/migrations/`):

- `users` - User profiles and subscription data
- `brands` - User brand configurations
- `designs` - Saved design instances

### Deployment Architecture

- **Development**: `dev` branch → `app.dev.instantbranding.ai`
- **Production**: `main` branch → `app.instantbranding.ai`
- Deployment requires being on the correct branch
- Uses Cloudflare Workers with R2 incremental cache

### Development Guidelines

- Use TypeScript path aliases: `@/` maps to root directory
- Follow existing component patterns in template creation
- ESLint warns on console statements and unused variables
- Responsive design is mobile-first with desktop optimization
- Use Bun as package manager throughout

### Font System

Custom fonts loaded via `lib/fonts.ts` with files in `public/fonts/`
Primary fonts: Geist Sans and Geist Mono from next/font/google

### Image Handling

- Remote patterns configured in `next.config.ts`
- Background removal via AI integration
- Image cropping and positioning system
- SVG assets organized in `public/` subdirectories

## API Architecture

### API Endpoints Overview

The application uses Next.js 13+ App Router API routes in `app/api/`:

#### Core API Routes

- **GET** `/api/` - Health check endpoint
- **GET/POST** `/api/auth/reset-password/` - Password reset functionality
- **GET** `/app/auth/callback/` - OAuth callback handler

#### Brand Management APIs

- **GET** `/api/brands/` - Fetch all user brands
- **GET** `/api/brands/[brandId]` - Fetch specific brand
- **PUT** `/api/brands/[brandId]` - Update existing brand
- **POST** `/api/brands/upsert-brand/` - Create or update brand
- **POST** `/api/brands/delete-brand/` - Delete brand by ID

#### Design Management APIs

- **GET** `/api/designs/` - Fetch all user designs

#### AI/Content Generation APIs

- **GET/POST** `/api/generate-text/` - AI text generation with usage limits
- **POST** `/api/remove-background/` - AI-powered background removal

#### User Management APIs

- **GET** `/api/user/` - User profile with plan information
- **POST** `/api/user-dependencies/` - Setup user dependencies (default brand, temp data transfer)

#### Payment/Webhook APIs

- **POST** `/api/webhooks/paddle-webhook/` - Paddle payment webhook handler

### Common API Patterns

#### Authentication Pattern

```typescript
const supabase = await createClient();
const {
  data: { user: authUser },
  error: authError,
} = await supabase.auth.getUser();

if (authError || !authUser) {
  return NextResponse.json(
    { success: false, error: "Authentication required" },
    { status: 401 }
  );
}
```

#### Response Structure

```typescript
// Success responses
{ success: true, data: any, message?: string }

// Error responses
{ success: false, error: string, details?: any }
```

#### Database Access Pattern

```typescript
// User lookup and operations
const { data: rawUser } = await supabase
  .from("User")
  .select("id")
  .eq("supabaseUserId", authUser.id)
  .single();
```

### Security & Authorization

- **Supabase Integration**: Server-side client with cookie-based sessions
- **Row Level Security (RLS)**: Database-level security policies
- **User Ownership Verification**: Users can only access their own resources
- **Plan-based Limits**: Free plan users have usage restrictions
- **Signature Verification**: Paddle webhook security with HMAC-SHA256

### External Service Integration

- **Cloudflare Workers AI**: Text generation service
- **Background Removal API**: External AI image processing
- **Paddle Webhooks**: Payment processing with event-driven plan updates

## Custom Hooks Architecture

### Hook Categories

#### 1. Brand Management (`hooks/brand.ts`)

- `useFetchBrands()` - Retrieve all user brands
- `useFetchBrand()` - Get specific brand by ID
- `useUpsertBrand()` - Create or update brands with intelligent upsert
- `useDeleteBrand()` - Remove brands with state cleanup

#### 2. Design Management (`hooks/designs.ts`)

- `useGetAllDesigns()` - Fetch all designs across brands
- `useGetDesignsByBrand()` - Brand-specific design retrieval
- `useCreateDesign()` / `useUpdateDesign()` / `useDeleteDesign()` - CRUD operations
- `useGetDesignSummaries()` - Lightweight design metadata with caching

#### 3. Canvas References (`hooks/canvas.ts`)

- `useCanvasRef()` - Main canvas element reference for exports
- `useHeadshotRef()` - Profile picture container reference
- `useCarouselRefs()` - Multiple slide references for carousel exports

#### 4. AI & Content Generation (`hooks/useAITextGeneration.ts`)

- `useGenerateAssetVariants()` - Primary AI content generation
- UUID-based temporary user tracking
- localStorage integration for session persistence

#### 5. Image Processing (`hooks/useBackgroundRemoval.ts`)

- Progress tracking with callback system
- Request cancellation with AbortController
- File validation and processing

#### 6. Payment Integration (`hooks/usePaddleCheckout.ts`)

- Paddle checkout overlay management
- Event-driven payment flow

#### 7. Unified Data Config (`hooks/useUnifiedDataConfig.ts`)

- Smart data routing between assets and carousel slides
- Backward compatibility with individual field updaters

#### 8. User Management (`hooks/user.ts`)

- `useGetCurrentUser()` - User profile retrieval
- `useUserDependencies()` - Post-auth dependency processing
- `useUserAccessChecks()` - Template access validation

### Common Hook Patterns

#### Return Patterns

```typescript
// Tuple Pattern (most common)
const [actionFunction, { data?, loading, error }] = useHook();

// Object Pattern (for complex hooks)
const { actionFunction, data, loading, error, utilities } = useHook();
```

#### Error Handling

- Standardized Error objects with meaningful messages
- Axios error processing with custom handling
- Silent failures for non-critical operations
- Context state error synchronization

#### API Integration

- `useApi` hook for REST endpoints with automatic auth headers
- Direct Supabase client for database operations
- External API integration with timeout handling

#### Context Integration

- Deep integration with AppContext, BrandContext, AssetContext
- Automatic state synchronization after operations
- Bi-directional data flow

### Data Flow Architecture

```
API Layer → Hook Layer → Context Layer → Components
```

- **APIs**: Handle data persistence and external services
- **Hooks**: Business logic, error handling, loading states
- **Contexts**: Global state management and data distribution
- **Components**: UI rendering and user interactions

### Performance & Security

- **Caching**: Design summaries, localStorage for temp users
- **Resource Management**: AbortController, reference cleanup
- **Authentication**: Supabase user validation, anonymous user protection
- **Access Control**: Plan-based permissions, RLS awareness

## Complete Application Architecture Guide

### Understanding the App Flow

The InstantBranding application follows a structured flow from user authentication to template creation and export:

1. **User Authentication** (`app/auth/`) - Supabase Auth with Google OAuth support
2. **Brand Creation** (`modules/Brand/`) - Users create/select brands with custom colors, fonts, and assets
3. **Template Selection** (`components/instant-branding/`) - Choose from 7+ template categories
4. **Content Editing** (`modules/ControlPanel/`) - Edit text, images, and styling via form controls
5. **Canvas Rendering** (`modules/Canvas/`) - Real-time preview with brand application
6. **Export/Download** (`modules/StylePanel/`) - Generate PNG, JPG, PDF, ZIP exports

### Comprehensive File Structure

```
instant-branding-web/
├── app/                          # Next.js 15 App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── brands/               # Brand CRUD operations
│   │   ├── designs/              # Design management
│   │   ├── generate-text/        # AI text generation
│   │   ├── remove-background/    # AI background removal
│   │   ├── user/                 # User profile management
│   │   └── webhooks/             # Payment webhooks
│   ├── auth/                     # Auth pages (login, callback, reset)
│   ├── dashboard/                # Main app dashboard
│   ├── onboarding/               # New user onboarding
│   └── brandkit/                 # LinkedIn brandkit feature
├── components/
│   ├── ui/                       # shadcn/ui components (buttons, dialogs, etc.)
│   ├── instant-branding/         # Template system
│   │   ├── social-banner/        # 11 banner templates + styles
│   │   ├── social-post/          # 4 post templates + styles
│   │   ├── quote-card/           # 6 quote templates + styles
│   │   ├── featured-post/        # 6 featured templates + styles
│   │   ├── mockup-post/          # 4 mockup templates + styles
│   │   ├── textimg-post/         # 6 text+image templates + styles
│   │   ├── social-carousel/      # 4 carousel templates + styles
│   │   └── components/           # Shared template elements
│   ├── AssetBento/               # Template selection grid
│   ├── DraggerWithCrop/          # Image upload and cropping
│   ├── SideBar/                  # Navigation sidebar
│   └── [Other UI Components]/    # Various utility components
├── contexts/                     # React Context API state management
│   ├── AppContext/               # Global app state, auth, headshots
│   ├── BrandContext/             # Brand colors, fonts, configuration
│   └── AssetContext/             # Template data, styles, carousel
├── hooks/                        # Custom React hooks
│   ├── brand.ts                  # Brand CRUD operations
│   ├── designs.ts                # Design management
│   ├── canvas.ts                 # Canvas references for export
│   ├── user.ts                   # User profile and access control
│   ├── useAITextGeneration.ts    # AI content generation
│   ├── useBackgroundRemoval.ts   # Image processing
│   ├── useUnifiedDataConfig.ts   # Unified data handling
│   └── [Other hooks]/            # Specialized functionality
├── modules/                      # Main application modules
│   ├── Main/                     # App shell and layout
│   ├── Auth/                     # Authentication forms
│   ├── Brand/                    # Brand management UI
│   ├── Canvas/                   # Template rendering engine
│   │   └── components/           # Template wrappers for each category
│   ├── ControlPanel/             # Content editing forms
│   │   ├── components/           # Form controls (text, image, style)
│   │   └── RichTextEditor/       # WYSIWYG text editing
│   ├── StylePanel/               # Export and styling controls
│   └── LinkedInBrandkit/         # LinkedIn-specific features
├── lib/                          # Utilities and configurations
│   ├── api.ts                    # API client setup
│   ├── aws-s3.ts                 # S3 asset management
│   ├── fonts.ts                  # Google Fonts integration
│   ├── supabase/                 # Database clients
│   └── utils.ts                  # General utilities
├── common/                       # Shared constants and data
│   └── constants/
│       ├── template-data.ts      # Default template content
│       ├── gradients.ts          # Gradient definitions
│       └── unified-bento-config.ts # Template grid configuration
├── supabase/                     # Database schema and migrations
│   ├── migrations/               # SQL migration files
│   └── seed.sql                  # Initial data
├── types/                        # TypeScript type definitions
└── utils/                        # Utility functions
```

### State Management Deep Dive

#### AppContext - Global Application State
- **Purpose**: Authentication, user data, global loading states, headshot management
- **Key State**:
  - `currentUser`: User profile with plan information
  - `isSignedIn/isPremiumUser`: Authentication flags
  - `headshot`: Profile image positioning and scaling
  - `sectionsData`: Section configurations for layouts
  - `loadingCategories/loadingTemplates`: UI loading states

#### BrandContext - Brand Configuration
- **Purpose**: Manage brand identity across all templates
- **Key State**:
  - `brand`: Current active brand with colors, typography, assets
  - `brands`: Array of all user brands
  - `isDirty`: Tracks unsaved changes
- **Brand Structure**:
  ```typescript
  interface Brand {
    id?: string;
    name: string;
    config: {
      colors: { primaryColor, secondaryColor, highlightColor, textColor };
      typography: { primaryFont, secondaryFont, highlightFont + weights };
      isDarkMode: boolean;
      monochrome: boolean;
    };
    socialLinks: Record<string, string>;
    brandImages: string[];
    brandMark: { name, socialHandle, website, logoUrl, headshotUrl };
  }
  ```

#### AssetContext - Template and Content Management
- **Purpose**: Template selection, styling, content data, carousel management
- **Key State**:
  - `currentAssetType`: Active template category ('social-banner', 'quote-card', etc.)
  - `currentStyle/styleId/templateId`: Active template configuration
  - `dataConfig`: Content data (title, description, images, etc.)
  - `slides`: Carousel slide data for multi-slide templates
- **Template Style System**:
  ```typescript
  interface Style {
    config: {
      backgroundBackdropConfig: { color, pattern, position };
      highlightedTextStyle: { buttonType, color, radius };
      headshotBackdropConfig: { color, shape, position };
      backgroundStyle: { type, gradient };
    };
  }
  ```

### Template System Architecture

#### Template Categories and Counts
1. **social-banner**: 11 templates - LinkedIn/social media headers
2. **social-post**: 4 templates - General social media posts
3. **quote-card**: 6 templates - Quote and testimonial cards
4. **featured-post**: 6 templates - Call-to-action focused posts
5. **mockup-post**: 4 templates - Device mockup presentations
6. **textimg-post**: 6 templates - Text and image combinations
7. **social-carousel**: 4 templates - Multi-slide carousel posts

#### Template Data Flow
1. **Default Data**: `common/constants/template-data.ts` provides base content
2. **Style Application**: Each category has a `-styles.ts` file with visual configurations
3. **Template Components**: Individual `.tsx` files render the templates
4. **Wrapper Components**: `modules/Canvas/components/` handle template-specific logic
5. **Brand Integration**: Colors and fonts from BrandContext are dynamically applied

#### Template Creation Pattern
When adding new templates:
1. Create template component in appropriate category folder
2. Add template data to `template-data.ts`
3. Configure styles in category `-styles.ts` file
4. Update wrapper component to handle new template
5. Add to template grid configuration

### Database Schema Overview

Key tables from Supabase migrations:

#### Users Table
- `id`, `email`, `firstName`, `lastName`, `profileUrl`
- `supabaseUserId` - Links to Supabase Auth
- `planId` - References user's subscription plan
- `onboardingStatus` - Track completion status
- `createdAt`, `updatedAt`

#### Brand Table
- `id`, `name`, `userId` - Basic brand info
- `config` - JSONB column storing brand configuration
  - colors, typography, isDarkMode, monochrome
- `social_links` - JSONB for social media URLs
- `brand_images` - Array of uploaded brand image URLs
- `info_questions` - JSONB for additional brand data
- `brand_mark` - JSONB for logo, headshot, and brand mark data

#### Design Table
- `id`, `name`, `userId`, `brandId`
- `assetType` - Template category
- `templateId` - Specific template number
- `data` - JSONB storing design content
- `style` - JSONB storing visual styling
- `isCarousel` - Boolean for carousel-type designs

#### Plan and Subscription Tables
- Plan limits and feature access control
- Template restrictions for free vs premium users
- Usage tracking for AI features

### API Architecture Patterns

#### Authentication Flow
All API routes use consistent authentication:
```typescript
const supabase = await createClient();
const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
if (authError || !authUser) {
  return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
}
```

#### Response Standardization
- Success: `{ success: true, data: any, message?: string }`
- Error: `{ success: false, error: string, details?: any }`

#### Key API Endpoints
- **Brand Management**: Full CRUD with upsert functionality
- **Design Management**: Save/load user designs
- **AI Integration**: Text generation and background removal
- **User Management**: Profile and dependency setup
- **Webhooks**: Paddle payment processing

### Hook System Patterns

#### Standard Hook Return Pattern
```typescript
// Tuple pattern for simple operations
const [executeAction, { data, loading, error }] = useHook();

// Object pattern for complex hooks
const { executeAction, data, loading, error, utilities } = useHook();
```

#### Error Handling Strategy
- Standardized Error objects across all hooks
- Axios error interceptors for API communication
- Context state synchronization on errors
- Silent failures for non-critical operations

#### State Integration
- All hooks integrate with relevant contexts
- Automatic state updates after successful operations
- Optimistic updates where appropriate

### Styling and Theming

#### Tailwind CSS Configuration
- Custom design tokens for brand colors
- Responsive breakpoints optimized for design tools
- Dark mode support through context
- Component-specific utility classes

#### Font Management
- Google Fonts integration via `lib/fonts.ts`
- Dynamic font loading based on brand selection
- 40+ supported font families with weight variations
- Fallback font stacks for reliability

#### Color System
- Brand colors applied via CSS custom properties
- Template color tokens: `{{primaryColor}}`, `{{secondaryColor}}`, etc.
- Monochrome mode for accessibility
- Dark/light mode compatibility

### Export and Canvas System

#### Canvas References
- `useCanvasRef()` for main template export
- `useHeadshotRef()` for profile image positioning
- `useCarouselRefs()` for multi-slide exports

#### Export Formats
- PNG/JPG: High-resolution template exports
- PDF: Multi-page carousel exports
- ZIP: Bulk template downloads
- Platform-specific sizing (LinkedIn, Instagram, etc.)

#### Image Processing
- HTML-to-image conversion for exports
- AWS S3 integration for asset storage
- AI-powered background removal
- Dynamic image cropping and positioning

### Performance Optimization

#### Caching Strategy
- Design summaries cached in localStorage
- Template data memoization
- Font loading optimization
- API response caching where appropriate

#### Code Splitting
- Template components loaded dynamically
- Module-based code organization
- Next.js automatic code splitting

#### Resource Management
- AbortController for API requests
- Memory cleanup in useEffect hooks
- Optimized re-renders through proper dependencies

### Security Implementation

#### Authentication & Authorization
- Supabase Row Level Security (RLS) policies
- User ownership verification on all operations
- Plan-based feature access control
- Secure cookie-based sessions

#### Data Protection
- API rate limiting on AI endpoints
- Input validation and sanitization
- Secure file upload handling
- HTTPS enforcement

### Development Workflow

#### Making Changes to Templates
1. **Adding New Templates**:
   - Create component in appropriate category folder
   - Add data to `template-data.ts`
   - Configure styles in `-styles.ts`
   - Update wrapper component
   - Test across brand configurations

2. **Modifying Existing Templates**:
   - Update component code
   - Modify template data if needed
   - Adjust styles configuration
   - Test with different brands
   - Verify export functionality

3. **Brand System Changes**:
   - Update BrandContext types
   - Modify brand creation/editing forms
   - Test color/font application across templates
   - Verify database schema compatibility

#### Testing Strategy
- Manual testing across all template categories
- Brand configuration validation
- Export functionality verification
- Cross-browser compatibility testing
- Mobile responsiveness checks

### Deployment and Environment Management

#### Environment Configuration
- `.env.local` for local development
- `.env.dev` for development deployment
- `.env.production` for production
- Branch-based deployment workflow

#### Cloudflare Workers Deployment
- OpenNext.js adapter for Worker compatibility
- R2 storage for incremental cache
- Domain routing: dev branch → dev subdomain, main → production

### Monitoring and Analytics

#### PostHog Integration
- User behavior tracking
- Feature usage analytics
- Error monitoring and reporting
- A/B testing capabilities

#### Performance Monitoring
- Core Web Vitals tracking
- API response time monitoring
- Database query performance
- Export generation metrics

## How to Extend and Modify

### Adding New Features

1. **New Template Category**:
   - Create folder in `components/instant-branding/`
   - Add to AssetContext types
   - Create wrapper in `modules/Canvas/components/`
   - Add to template data constants
   - Update routing and navigation

2. **New Brand Properties**:
   - Update BrandContext types
   - Modify brand forms in `modules/Brand/`
   - Update database schema
   - Add to brand creation/editing flows

3. **New Export Formats**:
   - Extend export utilities in `modules/StylePanel/`
   - Add format-specific processing
   - Update canvas reference system
   - Test across template types

### Common Patterns to Follow

1. **Component Structure**:
   - Use TypeScript with strict mode
   - Follow existing naming conventions
   - Implement proper error boundaries
   - Use context for global state

2. **API Development**:
   - Follow standard response format
   - Implement proper authentication
   - Use TypeScript for request/response types
   - Add proper error handling

3. **Database Changes**:
   - Create Supabase migrations
   - Update TypeScript types
   - Maintain RLS policies
   - Test data consistency

This comprehensive architecture guide provides the foundation for understanding and extending the InstantBranding application. Whether adding new templates, modifying existing functionality, or implementing new features, this structure ensures maintainable and scalable development.
