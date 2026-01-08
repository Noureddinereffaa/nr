# Deployment Guide for NR-OS

This guide covers the steps to deploy the NR-OS application to production environments.

## Prerequisites

- **Node.js**: v18 or higher
- **Supabase Project**: You need a valid Supabase project URL and Anon Key.
- **Gemini API Key**: For AI features.

## Environment Variables

Create a `.env` or `.env.local` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## Build Process

To build the application for production:

```bash
npm run build
```

This command will:
1.  Run the TypeScript compiler (`tsc`) to check for errors.
2.  Use `vite` to build the optimized bundle in the `dist` directory.
3.  Minify assets and split chunks for performance.

## Deployment Options

### 1. Vercel (Recommended)

The project is configured with a `vercel.json` file for easy deployment.

1.  Push your code to a GitHub repository.
2.  Log in to [Vercel](https://vercel.com) and add a "New Project".
3.  Import your repository.
4.  Vercel will detect Vite. Ensure the *Build Command* is `npm run build` and *Output Directory* is `dist`.
5.  Add your Environment Variables in the project settings.
6.  Click **Deploy**.

### 2. Netlify

1.  Log in to Netlify and "Add new site" -> "Import an existing project".
2.  Connect your Git provider.
3.  Build command: `npm run build`.
4.  Publish directory: `dist`.
5.  Add Environment Variables in "Site settings" -> "Build & deploy" -> "Environment".
6.  Deploy.

### 3. Docker (Optional)

You can containerize the app using Nginx to serve the static files.

```dockerfile
# Build Stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production Stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Post-Deployment Verification

After deployment:
1.  **Check Console**: Open browser dev tools to ensure no 404s or script errors.
2.  **Verify Supabase Connection**: Log in and check if data loads.
3.  **Test AI Features**: Try generating a small text snippet to verify the Gemini API key.
