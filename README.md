# Instant branding

A modern web application for creating professional personal brand content with ease. Build memorable personal brands without hiring a team using our comprehensive design tool with ready-to-use templates and AI-powered content generation.

## 🚀 Features

- **Template Library**: 100+ professional templates for social banners, posts, quote cards, and more
- **AI Content Generation**: Generate brand content with AI-powered prompts
- **Brand Customization**: Comprehensive brand configuration with colors, typography, and styles
- **Real-time Editor**: Interactive canvas for editing designs with live preview
- **Authentication**: Secure user authentication with Supabase (email/password and Google OAuth)
- **Subscription Management**: Paddle integration for premium plan upgrades
- **Background Removal**: AI-powered background removal for images
- **Export & Download**: High-quality exports of your designs
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase
- **Payment Processing**: Paddle
- **State Management**: Context API
- **UI Components**: Radix UI + shadcn/ui
- **Deployment**: Cloudflare Workers
- **Package Manager**: Bun
- **Analytics**: PostHog

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (LTS version)
- **Bun** package manager
- **Git**

You'll also need accounts for:

- **Supabase** (authentication)
- **Supabase** (database)
- **Cloudflare** (deployment)
- **Paddle** (payments - optional)
- **PostHog** (analytics - optional)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/instantbranding/instant-branding-web.git
cd instant-branding-web
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Environment Setup

Copy the environment template and fill in your values:

```bash
cp .env.sample .env.local
```

### 4. Database Setup

Start Supabase locally and run migrations:

```bash
# Start Supabase (if using local development)
bun run db:start

# Push database schema
bun run db:push:local

# Generate TypeScript types
bun run db:types
```

### 5. Run Development Server

```bash
bun run dev
```

The application will be available at `http://localhost:3000`

## 🔧 Development

### Available Scripts

```bash
# Development
bun run dev                      # Start development server
bun run build                    # Build for production
bun run start                    # Start production server
bun run lint                     # Run ESLint

# Database
bun run db:start                 # Start Supabase locally
bun run db:stop                  # Stop Supabase
bun run db:reset                 # Reset local database
bun run db:push:local           # Push schema to local DB
bun run db:types                # Generate TypeScript types

```

### Environment-Specific Deployment

The project supports multiple environments:

- **Development**: `dev` branch → `app.dev.instantbranding.ai`
- **Production**: `main` branch → `app.instantbranding.ai`

Each environment has its own configuration and database.

## 🔐 Authentication

The app uses Supabase for authentication with support for:

- Email/password authentication
- Google OAuth
- Email verification
- Password reset functionality

### Environment Variables

Each environment requires its own set of environment variables stored in GitHub Secrets:

- `DEV_ENV_FILE`: Development environment variables
- `PROD_ENV_FILE`: Production environment variables

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing code style and conventions
- Add tests for new functionality
- Update documentation as needed
- Ensure responsive design compatibility

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**:

   - Verify Supabase environment variables
   - Check if Supabase is running locally

2. **Authentication Problems**:

   - Confirm Supabase configuration
   - Check redirect URLs in Supabase dashboard

3. **Build Errors**:

   - Clear `.next` directory: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && bun install`

4. **Font Loading Issues**:
   - Verify font files are in `/public/fonts/`
   - Check font imports in `lib/fonts.ts`

Built with ❤️ by the Instant branding team
