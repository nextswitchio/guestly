# Guestly Deployment Guide

## Prerequisites

- Node.js 20.x
- npm
- PostgreSQL (for production)

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm start
```

## Deploy to Netlify

The project includes `netlify.toml` configuration:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Steps:

1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

## Deploy to Custom Server

```bash
npm run build
NODE_ENV=production node server.js
```

## SSL/HTTPS

Use a reverse proxy (nginx, Caddy) or deploy behind a CDN with SSL termination.
