---
name: azure-deploy
description: >
  Guided Azure deployment for full-stack web apps. Walks through Azure for
  Students signup, cheapest service selection, and step-by-step deployment
  of frontend + backend + database. Trigger: /azure-deploy
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task, AskUserQuestion
context: fork
---
# ©2026 Brad Scheller

# Azure Deploy

Guided Azure deployment for full-stack web apps targeting the cheapest possible stack — $0/month for most student projects using Azure free tiers.

## When to Use This Skill

Use when a student says:
- "deploy to Azure", "put my app online", "host on Azure"
- `/azure-deploy`
- "I need a live URL for my project"
- "deploy my app for free"

## Architecture: Cheapest Azure Stack for Students

| Component | Azure Service | Tier | Cost |
|-----------|--------------|------|------|
| Frontend (React/Next) | Azure Static Web Apps | Free | $0 |
| Backend API (Node/Python) | Azure App Service | Free F1 | $0 |
| Database (NoSQL) | Azure Cosmos DB | Free tier (1000 RU/s) | $0 |
| Database (SQL) | Azure SQL | Basic (5 DTU) | ~$5/mo |
| Full-stack alternative | Azure Container Apps | Consumption | Pay-per-use (pennies) |

**Total: $0/month** for most student projects within free tier limits.

## Step 1: Azure Account Setup

### Check Azure CLI

Run `az --version` to check if Azure CLI is installed.

**If not installed**, guide the student to install it:

- **Windows**: `winget install -e --id Microsoft.AzureCLI`
- **macOS**: `brew install azure-cli`
- **Linux/WSL**: `curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash`
- **npm (any platform)**: `npm install -g azure-cli`

### Check Login Status

Run `az account show` to see if already logged in.

**If not logged in**, guide through Azure for Students signup:

1. Go to https://azure.microsoft.com/en-us/free/students/
2. Sign in with `.edu` email address
3. Get **$100 free credit** — no credit card required
4. Alternative: Azure free account at https://azure.microsoft.com/en-us/free/ ($200 credit for 30 days, requires credit card)

Then run:
```bash
az login
```
This opens a browser for authentication.

### Verify Subscription

```bash
az account list --output table
```

Confirm the student sees their subscription (Azure for Students or Free Trial).

## Step 2: Interview — What Are You Deploying?

Use `AskUserQuestion` to determine the project's tech stack:

**Question 1: Frontend framework?**
- Next.js
- React (Vite/CRA)
- Vue
- Static HTML/CSS/JS

**Question 2: Backend?**
- Node.js / Express
- Node.js / Hono
- Python / FastAPI
- Python / Flask
- None (frontend only)

**Question 3: Database?**
- Yes — SQL (PostgreSQL/MySQL)
- Yes — NoSQL (MongoDB-like)
- No database needed

### Architecture Recommendations

Based on answers, recommend:

| Stack | Recommended Architecture |
|-------|-------------------------|
| **Next.js full-stack** | Azure Static Web Apps (handles SSR + API routes) |
| **React + Node API** | Static Web Apps (frontend) + App Service (backend) |
| **React + Python API** | Static Web Apps (frontend) + App Service (backend) |
| **Vue + any backend** | Static Web Apps (frontend) + App Service (backend) |
| **Static site only** | Static Web Apps (simplest, one service) |

## Step 3: Prepare the App for Deployment

### Verify Local Build

```bash
npm run build
```

If the build fails, fix errors before proceeding. Common issues:
- Missing dependencies: `npm install`
- TypeScript errors: fix or add `// @ts-ignore` temporarily
- Environment variables: create `.env.production` with required values

### Application Checklist

- [ ] `package.json` has a `start` script
- [ ] `package.json` has a `build` script
- [ ] No hardcoded `localhost` URLs in production code
- [ ] API URLs use environment variables (`process.env.NEXT_PUBLIC_API_URL` or similar)
- [ ] `.env.production` exists (no secrets committed to git)
- [ ] `.gitignore` includes `.env*` files

### Framework-Specific Prep

**Next.js:**
- If using App Router with Static Web Apps, add to `next.config.js`:
  ```js
  const nextConfig = {
    output: 'standalone', // for App Service
    // OR
    output: 'export',     // for Static Web Apps (static export)
  }
  ```

**Express/Node backend:**
- Ensure the app listens on `process.env.PORT`:
  ```js
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
  ```

**Python/FastAPI backend:**
- Ensure `requirements.txt` exists
- Add startup command: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app`

## Step 4: Create Azure Resources

Set the app name variable (used throughout):
```bash
APP_NAME="your-app-name"
```

### Create Resource Group

```bash
az group create --name ${APP_NAME}-rg --location eastus
```

All resources will live in this group for easy management and cleanup.

Then proceed to the relevant deployment path based on Step 2 interview results.

## Step 5a: Deploy Frontend (Azure Static Web Apps)

### Option A: GitHub-Connected Deployment (Recommended)

```bash
az staticwebapp create \
  --name ${APP_NAME}-frontend \
  --resource-group ${APP_NAME}-rg \
  --source https://github.com/USERNAME/REPO \
  --branch main \
  --app-location "/" \
  --output-location "dist" \
  --login-with-github
```

Adjust `--output-location` based on framework:
- React (Vite): `"dist"`
- React (CRA): `"build"`
- Next.js (export): `"out"`
- Vue: `"dist"`

This auto-creates a GitHub Actions workflow for CI/CD.

### Option B: Manual CLI Deployment

```bash
# Build first
npm run build

# Deploy with SWA CLI
npm install -g @azure/static-web-apps-cli
swa deploy ./dist --deployment-token <TOKEN>
```

Get the deployment token:
```bash
az staticwebapp secrets list \
  --name ${APP_NAME}-frontend \
  --resource-group ${APP_NAME}-rg
```

### Verify Frontend

```bash
az staticwebapp show \
  --name ${APP_NAME}-frontend \
  --resource-group ${APP_NAME}-rg \
  --query "defaultHostname" --output tsv
```

The live URL will be: `https://<generated-name>.azurestaticapps.net`

## Step 5b: Deploy Backend (Azure App Service)

### Create App Service Plan (Free Tier)

```bash
az appservice plan create \
  --name ${APP_NAME}-plan \
  --resource-group ${APP_NAME}-rg \
  --sku F1 \
  --is-linux
```

### Create Web App

**For Node.js:**
```bash
az webapp create \
  --name ${APP_NAME}-api \
  --resource-group ${APP_NAME}-rg \
  --plan ${APP_NAME}-plan \
  --runtime "NODE:20-lts"
```

**For Python:**
```bash
az webapp create \
  --name ${APP_NAME}-api \
  --resource-group ${APP_NAME}-rg \
  --plan ${APP_NAME}-plan \
  --runtime "PYTHON:3.11"
```

### Set Environment Variables

```bash
az webapp config appsettings set \
  --name ${APP_NAME}-api \
  --resource-group ${APP_NAME}-rg \
  --settings \
    NODE_ENV=production \
    DATABASE_URL="your-connection-string" \
    CORS_ORIGIN="https://${APP_NAME}-frontend.azurestaticapps.net"
```

### Deploy the Code

**Option A: az webapp up (simplest)**
```bash
cd backend/
az webapp up \
  --name ${APP_NAME}-api \
  --resource-group ${APP_NAME}-rg \
  --runtime "NODE:20-lts"
```

**Option B: Zip deploy**
```bash
# Create zip of backend code
zip -r app.zip . -x "node_modules/*" ".git/*"

# Deploy
az webapp deploy \
  --name ${APP_NAME}-api \
  --resource-group ${APP_NAME}-rg \
  --src-path app.zip \
  --type zip
```

### Verify Backend

```bash
az webapp show \
  --name ${APP_NAME}-api \
  --resource-group ${APP_NAME}-rg \
  --query "defaultHostName" --output tsv
```

The live API URL will be: `https://${APP_NAME}-api.azurewebsites.net`

## Step 5c: Deploy Database (If Needed)

### Option A: Cosmos DB (NoSQL — Free Tier)

```bash
# Create Cosmos DB account with free tier
az cosmosdb create \
  --name ${APP_NAME}-db \
  --resource-group ${APP_NAME}-rg \
  --enable-free-tier true \
  --default-consistency-level Session

# Create a database
az cosmosdb sql database create \
  --account-name ${APP_NAME}-db \
  --resource-group ${APP_NAME}-rg \
  --name appdata

# Create a container
az cosmosdb sql container create \
  --account-name ${APP_NAME}-db \
  --resource-group ${APP_NAME}-rg \
  --database-name appdata \
  --name items \
  --partition-key-path "/id"
```

Get the connection string:
```bash
az cosmosdb keys list \
  --name ${APP_NAME}-db \
  --resource-group ${APP_NAME}-rg \
  --type connection-strings \
  --query "connectionStrings[0].connectionString" --output tsv
```

### Option B: Azure SQL (Relational)

```bash
# Create SQL server
az sql server create \
  --name ${APP_NAME}-sql \
  --resource-group ${APP_NAME}-rg \
  --admin-user sqladmin \
  --admin-password "YourSecurePassword123!"

# Create database (Basic tier — ~$5/mo)
az sql db create \
  --name ${APP_NAME}-sqldb \
  --resource-group ${APP_NAME}-rg \
  --server ${APP_NAME}-sql \
  --service-objective Basic

# Allow Azure services to access
az sql server firewall-rule create \
  --name AllowAzureServices \
  --resource-group ${APP_NAME}-rg \
  --server ${APP_NAME}-sql \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### Set Database Connection String in App Service

```bash
# For Cosmos DB
CONN_STR=$(az cosmosdb keys list --name ${APP_NAME}-db --resource-group ${APP_NAME}-rg --type connection-strings --query "connectionStrings[0].connectionString" --output tsv)

# For Azure SQL
CONN_STR="Server=tcp:${APP_NAME}-sql.database.windows.net,1433;Database=${APP_NAME}-sqldb;User ID=sqladmin;Password=YourSecurePassword123!;Encrypt=true"

az webapp config appsettings set \
  --name ${APP_NAME}-api \
  --resource-group ${APP_NAME}-rg \
  --settings DATABASE_URL="$CONN_STR"
```

## Step 6: Connect Frontend to Backend

### Configure CORS on App Service

```bash
az webapp cors add \
  --name ${APP_NAME}-api \
  --resource-group ${APP_NAME}-rg \
  --allowed-origins "https://${APP_NAME}-frontend.azurestaticapps.net"
```

### Set API URL in Frontend

For React/Next.js, set the environment variable:
```bash
# In .env.production
NEXT_PUBLIC_API_URL=https://${APP_NAME}-api.azurewebsites.net
# or
VITE_API_URL=https://${APP_NAME}-api.azurewebsites.net
```

### Static Web Apps API Proxy (Optional)

Create `staticwebapp.config.json` in the frontend root:
```json
{
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["anonymous"]
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/images/*.{png,jpg,gif}", "/css/*"]
  },
  "globalHeaders": {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY"
  }
}
```

## Step 7: Custom Domain (Optional)

### For Static Web Apps

```bash
az staticwebapp hostname set \
  --name ${APP_NAME}-frontend \
  --hostname yourdomain.com
```

Free SSL is automatic with Static Web Apps.

### For App Service

```bash
az webapp config hostname add \
  --webapp-name ${APP_NAME}-api \
  --resource-group ${APP_NAME}-rg \
  --hostname api.yourdomain.com
```

## Step 8: Verify & Celebrate

### Test the Deployment

1. Open the frontend URL in a browser
2. Test API endpoints directly
3. Verify frontend can call the backend
4. Check database connectivity (if applicable)

### Show Cost Summary

```bash
az consumption usage list \
  --query "[].{Service:consumedService, Cost:pretaxCost}" \
  --output table
```

Expected result for free tier: **$0.00**

### Monitor Your App

```bash
# View App Service logs
az webapp log tail --name ${APP_NAME}-api --resource-group ${APP_NAME}-rg

# View metrics
az monitor metrics list \
  --resource /subscriptions/{sub-id}/resourceGroups/${APP_NAME}-rg/providers/Microsoft.Web/sites/${APP_NAME}-api \
  --metric "Http2xx,Http5xx,AverageResponseTime" \
  --output table
```

### Tear Down (When Done)

Delete everything in one command:
```bash
az group delete --name ${APP_NAME}-rg --yes --no-wait
```

This removes all resources in the group — frontend, backend, database, everything.

## Troubleshooting

### "az: command not found"
Install Azure CLI — see Step 1 for platform-specific instructions.

### Build Fails on Azure
- Check Node.js version matches local: `az webapp config set --name ${APP_NAME}-api --linux-fx-version "NODE:20-lts"`
- Missing dependencies: ensure `package.json` lists all required packages
- Check build logs: `az webapp log download --name ${APP_NAME}-api --resource-group ${APP_NAME}-rg`

### CORS Errors
```bash
az webapp cors add \
  --name ${APP_NAME}-api \
  --resource-group ${APP_NAME}-rg \
  --allowed-origins "https://your-frontend-url.azurestaticapps.net"
```

### 503 Service Unavailable
Check application logs:
```bash
az webapp log tail --name ${APP_NAME}-api --resource-group ${APP_NAME}-rg
```

Common causes:
- App crashed on startup — check `start` script in `package.json`
- Port misconfiguration — ensure app uses `process.env.PORT`
- Missing environment variables — check App Service settings

### Free Tier Limits Hit
- **App Service F1**: 60 min CPU/day, 1 GB RAM, 1 GB storage — app may stop during high usage
- **Static Web Apps Free**: 100 GB bandwidth/month, 2 custom domains
- **Cosmos DB Free**: 1000 RU/s, 25 GB storage — sufficient for student projects

When limits are hit, the app may become slow or temporarily unavailable. It resets daily (App Service) or monthly (Static Web Apps, Cosmos DB).

## Cost Management

### Check Current Spend

```bash
az consumption usage list \
  --query "[].{Service:consumedService, Cost:pretaxCost}" \
  --output table
```

### Set Budget Alert

```bash
az consumption budget create \
  --amount 5 \
  --budget-name "student-budget" \
  --category cost \
  --time-grain monthly \
  --start-date 2026-01-01 \
  --end-date 2027-01-01
```

### Clean Up Resources

```bash
# Delete everything when your project is done
az group delete --name ${APP_NAME}-rg --yes --no-wait
```

Always tear down resources you're no longer using to avoid unexpected charges.
