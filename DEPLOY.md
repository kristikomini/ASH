# Deploying A.S.H. to Hetzner + Coolify

This app ships a production-ready **Dockerfile** using Next.js
[standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output).
Coolify builds and runs that image directly — no Nixpacks, no `next start`.

## 1. Server (Hetzner)

1. Create a Hetzner Cloud VPS (a CPX21 / 3 vCPU · 4 GB is comfortable for a
   Three.js + GSAP build; the build step is the memory-hungry part).
2. Install Coolify on it:
   ```bash
   curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
   ```
3. Open `http://<server-ip>:8000` and finish the Coolify onboarding.

## 2. Application (Coolify)

1. **+ New → Application → Public/Private Repository**, and point it at your
   GitHub repo (connect the GitHub App for private repos + auto-deploy).
2. **Build Pack:** select **Dockerfile** (Coolify auto-detects the `Dockerfile`
   at the repo root).
3. **Port:** set the exposed port to **3000**.
4. **Branch:** `master`.
5. Deploy.

## 3. Domain & HTTPS

- Point your domain's DNS **A record** at the Hetzner server IP.
- In the app's **Domains** field, enter `https://your-domain.com`. Coolify's
  built-in Traefik proxy issues a Let's Encrypt certificate automatically.

## 4. Environment variables

This project currently needs none. When you add any, set them in Coolify under
the app's **Environment Variables** tab — do **not** commit `.env` files
(`.dockerignore` and `.gitignore` already exclude them). Remember Next.js inlines
`NEXT_PUBLIC_*` vars at **build time**, so add those before the build runs.

## Local sanity check (optional)

```bash
docker build -t ash .
docker run --rm -p 3000:3000 ash
# open http://localhost:3000
```
