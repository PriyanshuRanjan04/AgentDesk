# Deployment & Hosting Performance Guide

## Why is hosting slow?

You are likely experiencing two types of "slowness":

1.  **Slow Builds (Deployment Time):**
    *   **Cause:** The previous configuration ran `npm install` every time, which resolves all dependencies from scratch.
    *   **Fix:** We switched to `npm ci` in `render.yaml`. This performs a "clean install" directly from your `package-lock.json`, which is significantly faster and more reliable for automated builds.

2.  **Slow Response/Startup (Cold Starts):**
    *   **Cause:** Render's **Free Tier** spins down services after 15 minutes of inactivity.
    *   **Effect:** The first request after a period of inactivity can take 50-60 seconds while the server "wakes up."
    *   **Solution:**
        *   **Upgrade:** The simplest fix is upgrading to a paid instance ($7/month), which never sleeps.
        *   **Keep-Alive:** You can set up a free uptime monitor (like UptimeRobot) to ping your `https://<your-app>.onrender.com/health` endpoint every 10 minutes. This prevents the agent from idling out.

## How to Apply These Changes

1.  **Push the code:** `git push` the changes to your repository.
2.  **Render Sync:** If you created your service using this `render.yaml` (Blueprint), Render will automatically pick up the changes.
    *   If you set up the service manually in the dashboard, you may need to manually update the "Build Command" in your Render service settings to:
        `npm ci && npx turbo run build --filter=api...`
