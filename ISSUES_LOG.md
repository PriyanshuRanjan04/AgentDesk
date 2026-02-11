# Project Issues Log

This document tracks the technical challenges encountered during the setup and deployment of AgentDesk.

## 1. Environment & Setup
- **PowerShell Execution Policy**: `npm install` failed due to restrictions. Solved by running in `cmd` or changing policy.
- **TurboRepo Installation**: `turbo` command was not found initially. Solved by installing dependencies first or using `npx turbo`.

## 2. Database (Prisma & PostgreSQL)
- **Seeding Failure**: `db:seed` failed because `dotenv` couldn't find the `.env` file in the root directory.
  - *Fix*: Updated `seed.ts` to explicitly look for `.env` in `../../.env`.
- **CommonJS vs ESM**: The API (CommonJS) couldn't import the Database package (TypeScript/ESM) in production.
  - *Fix*: Configured `@agentdesk/db` to compile to JavaScript (`dist/index.js`) using `tsc` and updated `package.json` `main` entry.

## 3. Frontend (Vercel Deployment)
- **Build Stuck**: Vercel deployment timed out.
  - *Cause*: The `apps/api` build script was running `tsx src/index.ts` (starting the server) instead of compiling. Vercel waited forever for the server to exit.
  - *Fix*: Changed `build` script to `tsc`.
- **Missing Dependencies**: `chat-interface.tsx` failed to build due to missing `@radix-ui/*` and `tailwindcss-animate` packages.
  - *Fix*: Installed missing dependencies in `apps/web`.
- **Type Errors**: `useChat` hook had an invalid property `keepLastMessageOnError`.
  - *Fix*: Removed the property.
- **404 Not Found**: Deployed site showed 404.
  - *Cause*: Vercel "Root Directory" was set to project root instead of `apps/web`.
  - *Fix*: Updated Vercel Project Settings to point to `apps/web`.
- **API Connection**: Frontend couldn't talk to Backend.
  - *Cause*: `vercel.json` rewrite was missing the wildcard path or pointing to the wrong URL.
  - *Fix*: Updated `destination` to `https://agent-desk-api.onrender.com/api/:match*`.

## 4. Backend (Render Deployment)
- **Type Mismatch**: TypeScript error `Type 'OpenAIChatLanguageModel' is not assignable to type 'LanguageModelV1'`.
  - *Cause*: Version mismatch between `ai` and `@ai-sdk/openai`.
  - *Fix*: Updated dependencies and used type casting (`as any`) as a temporary workaround.
- **Internal Server Error**: Generic 500 error on chat request.
  - *Fix*: Updated error handling in `index.ts` to return full error message and stack trace for debugging.

## 5. Deployment Configuration
- **Monorepo Structure**: Needed to configure `render.yaml` and `vercel.json` carefully to handle the monorepo structure (building dependencies like `@agentdesk/db` before the app).
