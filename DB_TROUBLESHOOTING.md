# Supabase Connection Troubleshooting

If you are seeing `Can't reach database server` errors, follow these steps to diagnose and fix the issue.

## 1. Check Project Status (Dashboard)
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project.
3. Check if the project is **Paused**. Free tier projects pause after inactivity.
   - If paused, click **"Restore Project"**. It may take a few minutes to wake up.

## 2. Verify Connection Settings
Go to **Project Settings > Database > Connection String** in the Supabase dashboard.

- Ensure you are using the correct **Mode**:
    - **Transaction Mode (Port 6543)**: Recommended for serverless environments (like Vercel).
    - **Session Mode (Port 5432)**: Direct connection, good for local development and migrations.

## 3. Update `.env` (Local) and **Deployment Settings** (Remote)
Your current `.env` uses port `5432`. If you are having trouble connecting directly, try the **Supavisor Connection Pooler** (IPv4 compatible).

Go to **Settings > Database > Connection Pooling** and copy the string. It usually looks like this:

```env
# Replace [YOUR-PASSWORD] with your actual database password
DATABASE_URL="postgres://postgres.dwijmxwibwzdnuqtgrft:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

> [!CAUTION]
> **COMMON MISTAKE:**
> The string from Supabase contains `[YOUR-PASSWORD]` as a placeholder.
> You **MUST** replace `[YOUR-PASSWORD]` with your **actual database password**.
> If your password has special characters (like `$`, `#`, `@`), you might need to URL-encode them (e.g., `$` becomes `%24`), though usually putting the password as-is works if it's in quotes.

> [!IMPORTANT]
> **If you deployed to Vercel/Render:**
> changing the local `.env` file **DOES NOT** update the server.
> You must go to your Vercel/Render Project Settings > Environment Variables and update `DATABASE_URL` there with the new Connection Pooler string, then **Redeploy**.

## 4. Test Connectivity Locally
Run this command in your terminal to see if you can reach the server:

```bash
# Windows PowerShell
Test-NetConnection db.dwijmxwibwzdnuqtgrft.supabase.co -Port 5432
```
If this fails (TcpTestSucceeded: False), your network might be blocking the connection or the database is down.

## 5. IPv6 vs IPv4
The error logs showed your machine resolving `db.dwijmxwibwzdnuqtgrft.supabase.co` to an **IPv6 address**.
Some networks or tools struggle with IPv6. Using the connection pooler URL (Step 3) forces an IPv4 connection, which often solves this.
