# Gemini Project Context

This document provides a detailed breakdown of the Instant Branding web application, mapping functionalities to the corresponding files and directories.

## 1. Core Technologies

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Package Manager**: Bun
- **UI**: Tailwind CSS, shadcn/ui, Radix UI
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase
- **File Storage**: AWS S3
- **Payments**: Paddle
- **Deployment**: Cloudflare Workers

## 2. Directory and File Functionality Map

### 📂 `app/` - Routing & Core Pages
This directory uses the Next.js App Router. Each subdirectory represents a URL route.

- **`app/layout.tsx`**: The root layout for the entire application.
- **`app/page.tsx`**: The main landing page.
- **`app/api/`**: Backend API endpoints.
  - **`auth/`**: Handles user authentication.
    - `GET /api/auth`: Placeholder route.
  - **`brands/`**: Manages brand assets.
    - `GET /api/brands`: Fetches all brands for the authenticated user.
  - **`designs/`**: Manages user-created designs.
    - `GET /api/designs`: Fetches all designs for the authenticated user.
  - **`generate-text/`**: AI-powered text generation.
    - `POST /api/generate-text`: Generates asset variants based on user prompts.
    - `GET /api/generate-text`: Retrieves generated content for a user.
  - **`remove-background/`**: Image background removal.
    - `POST /api/remove-background`: Removes the background from an uploaded image.
  - **`upload/`**: Handles file uploads to S3.
    - `POST /api/upload`: Generates a pre-signed URL for file uploads.
  - **`user/`**: Manages user profiles.
    - `GET /api/user`: Fetches the current user's profile information.
    - `PUT /api/user`: Updates the current user's profile information.
- **`app/auth/`**: Frontend pages for the authentication flow (login, reset password).
- **`app/brand-setup/`**: The multi-step UI for users to set up their initial brand profile.
- **`app/dashboard/`**: The main dashboard view for logged-in users, containing the `AssetBentoContainer`.
- **`app/editor/[type]/`**: The core design editor. The `[type]` is a dynamic parameter for the type of template being edited (e.g., `social-post`). This page is composed of the `Canvas`, `ControlPanel`, and `StylePanel` modules.
- **`app/onboarding/`**: The user onboarding flow after signing up.

### 📂 `components/` - Reusable React Components

- **`components/ui/`**: Base UI elements (Button, Input, Card, etc.) from `shadcn/ui`.
- **`components/instant-branding/`**: Contains the actual React components for the different design templates. These are the visual templates users can edit.
  - **`featured-post/`**: A component for creating featured posts with a title, description, CTA, and main image.
  - **`quote-card/`**: A component for displaying a quote with an author's name, title, and image.
- **`components/AITextGeneratorDialog/`**: A modal component for interacting with the AI text generation feature.
- **`components/AssetBento/`**: A grid component for displaying and managing user assets (logos, images). It uses a unified configuration to render different asset types and handles user interactions for selecting and editing assets.
- **`components/DraggerWithCrop/`**: A sophisticated image upload component that includes drag-and-drop, cropping, and background removal functionalities. It also handles S3 uploads.
- **`components/SideBar/`**: The main navigation sidebar for the application. It includes user authentication status, user menu, and navigation links.

### 📂 `modules/` - Feature Modules
These directories group components and logic for a major feature area, often composing smaller components from `components/`.

- **`modules/Canvas/`**: Manages the main design canvas in the editor. It dynamically renders the selected component based on the `type` parameter and applies the current brand and style context.
- **`modules/ControlPanel/`**: The panel in the editor that contains controls for manipulating elements on the canvas. It uses a dynamic form based on the selected asset type and allows users to edit text fields, toggle brand marks, and adjust image properties.
- **`modules/StylePanel/`**: The panel in the editor for managing styles, colors, and fonts. It displays a list of available styles for the current asset type and allows users to switch between them. It also includes the export functionality.

### 📂 `lib/` - Core Libraries & External Services

- **`lib/api.ts`**: Client-side helper functions for making requests to the backend API routes.
- **`lib/serverApi.ts`**: Server-side API helpers.
- **`lib/axios.ts`**: Configuration for the Axios instance used for HTTP requests.
- **`lib/aws-s3.ts`**: Contains functions for interacting with AWS S3 for file storage.
- **`lib/paddle/`**: Code for integrating with the Paddle payment service.
- **`lib/supabase/`**: Supabase client initialization and helper functions for database and auth interactions.
- **`lib/utils.ts`**: General utility functions used throughout the application.

### 📂 `hooks/` - Custom React Hooks

- **`hooks/useS3Upload.ts`**: Handles the logic for uploading files to S3 using pre-signed URLs from the `/api/upload` endpoint.
- **`hooks/useAITextGeneration.ts`**: Manages state and API calls for the AI text generation feature.
- **`hooks/useBackgroundRemoval.ts`**: Manages state and API calls for the background removal feature.
- **`hooks/brand.ts`, `designs.ts`, `user.ts`**: Data-fetching and state management hooks for their respective resources.

### 📂 `contexts/` - Global State Management

- **`contexts/AppContext/`**: Provides global application state, including loading states, user information, and authentication status.
- **`contexts/BrandContext/`**: Holds the current user's brand information, such as colors, fonts, and logos, making it accessible to all components.
- **`contexts/AssetContext/`**: Manages the state of the user's uploaded assets, including the current asset type, style, and data configuration.

### 📂 `providers/` - React Context Providers

- **`providers/PaddleProvider.tsx`**: Initializes and provides the Paddle SDK for handling payments.
- **`providers/PostHogProvider.tsx`**: Initializes and provides the PostHog analytics service for tracking user behavior.

### 📂 `supabase/` - Database Configuration

- **`supabase/migrations/`**: Contains SQL files for database schema migrations, managed by the Supabase CLI.
  - **`20250617095316_create_brand_table.sql`**: Creates the `Brand` table with columns for `id`, `brand_name`, `brand_config`, `user_id`, `created_at`, and `updated_at`.
  - **`20250620075244_create_designs_table.sql`**: Creates the `Designs` table with columns for `id`, `brand_id`, `user_id`, `asset_type`, `style_id`, `template_id`, `data`, `created_at`, and `updated_at`.
  - **`20250728071203_update_brand_table_structure.sql`**: Adds `social_links`, `brand_images`, `info_questions`, and `brand_mark` to the `Brand` table.
- **`supabase/seed.sql`**: A script to populate the database with initial seed data.
- **`supabase/config.toml`**: Configuration file for the Supabase project.

### 📂 `types/` - TypeScript Definitions

- **`types/index.ts`**: General-purpose TypeScript types.
- **`types/supabase.ts`**: Auto-generated TypeScript types based on the Supabase database schema. This is crucial for type safety when interacting with the database.

## 3. Important Commands

- **`bun run dev`**: Starts the development server with Supabase services.
- **`bun run build`**: Creates a production build of the application.
- **`bun run lint`**: Lints the codebase for errors and style issues.
- **`bun run db:push:local`**: Applies database migrations to the local Supabase instance.
- **`bun run db:types`**: Generates TypeScript types from your database schema into `types/supabase.ts`.
