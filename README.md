# Digital Solutions website

The front end of [e4digitalsolutions.com](https://e4digitalsolutions.com). It is a Next.js (App Router) app whose content comes from a headless WordPress CMS through WPGraphQL. The coding standards are in [CLAUDE.md](CLAUDE.md) and [.claude/rules/](.claude/rules/).

## Getting started

The package manager is Yarn. Don't use npm, pnpm or bun.

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

| Task | Command |
|---|---|
| Dev server | `yarn dev` |
| Lint | `yarn lint` |
| Type check | `yarn tsc --noEmit` |
| Standalone production build | `yarn build:standalone` |
| Run the standalone build locally | `yarn production:run` |

## Environment variables

None are required yet. Server-only secrets go in `.env.local` locally and in `/opt/digital-solutions-website/.env` on the server. Both are kept out of git and out of the Docker image. When a variable is added, list its name (never its value) here, and keep a backup of the values in a password manager: they exist only in those two files.

## Deploying

The app runs in a Docker container on an Ubuntu server, behind an Apache reverse proxy that handles HTTPS. The container listens on `127.0.0.1:3000` only. Images are stored in GitHub Container Registry (GHCR) as `ghcr.io/edwinb24/digital-solutions-website`, tagged with the short commit SHA and `latest`. The package is public, like this repository, so the server pulls it without a login. The image contains only the committed `.next/standalone` folder, never a `.env` file.

### Release a new version

Run these on your computer, in Git Bash, in the project root.

1. Build the standalone app:
   ```bash
   yarn build:standalone
   ```
2. Commit your changes **together with the `.next/standalone` folder**, and push to `main`.

   > **CAUTION:** The image is made from the committed `.next/standalone` folder. If you skip step 1, the previous build goes to production again.

3. On GitHub, open **Actions → Deploy to production** and wait for the run to finish. It builds the image, pushes it to GHCR and replaces the container on the server.

The workflow runs only when `.next/standalone/**`, `Dockerfile`, `.dockerignore` or `.github/workflows/deploy.yml` change. To run it again without a new commit, use **Run workflow** on the same page.

> **NOTE:** The build runs on Windows, but the container runs Linux. Don't add packages with native binaries (such as `sharp`) to the runtime code: the Windows binary would be copied into the Linux image. This is why `next.config.ts` sets `images: {unoptimized: true}`.

### Roll back to an earlier version

Use this when the live version doesn't work. There are two ways.

#### Option A: re-run an earlier deploy in GitHub Actions

1. On GitHub, open **Actions → Deploy to production**.
2. Open the run of the last commit that worked, and click **Re-run all jobs**. The workflow packages that commit's `.next/standalone` again and deploys it with its own SHA tag.
3. Do the steps in [Verify production](#verify-production).

> **CAUTION:** After a re-run, `main` still points to the bad commit, and the next push deploys from `main` again. Fix the problem or run `git revert <bad_sha>` first. Replace `<bad_sha>` with the SHA of the commit that broke production.

#### Option B: on the server

Use this if GitHub Actions isn't available. Nothing is rebuilt: GHCR keeps every image.

1. Find the short SHA of the last version that worked, from `git log --oneline` or from the package page at https://github.com/edwinb24?tab=packages → **digital-solutions-website**.
2. Connect to the server with SSH as your own user, then switch to the deploy user, which is logged in to GHCR:
   ```bash
   sudo -iu <deploy_user>
   ```
   Make sure to replace `<deploy_user>` with the name of the deploy user from your private server notes.
3. Start the version that worked:
   ```bash
   sha=<last_good_sha>
   docker pull ghcr.io/edwinb24/digital-solutions-website:$sha
   docker rm -f digital-solutions-website
   docker run -d --name digital-solutions-website --restart unless-stopped -p 127.0.0.1:3000:3000 --env-file /opt/digital-solutions-website/.env ghcr.io/edwinb24/digital-solutions-website:$sha
   exit
   ```
   Make sure to replace `<last_good_sha>` with the short SHA from step 1.
4. Do the steps in [Verify production](#verify-production).

> **CAUTION:** A rollback changes only the server. `main` and the `latest` tag still point to the bad commit. Fix the problem or run `git revert <bad_sha>` before the next release. Replace `<bad_sha>` with the SHA of the commit that broke production.

> **WARNING:** Always keep `127.0.0.1:` in the `-p` option. Without it, port 3000 is open to the internet and visitors can bypass Apache and HTTPS.

### Verify production

On the server, as your own user:

```bash
docker ps --format '{{.Names}} {{.Image}} {{.Status}}'
curl -I http://127.0.0.1:3000
```

The container must show `Up` with the SHA you expect, and `curl` must return `200`. Then open https://e4digitalsolutions.com in a browser.

### Maintenance

- **GHCR token:** the deploy user pulls images with a classic GitHub token that has only `read:packages`. When it expires, deploys fail at `docker pull`. Make a new token and log the deploy user in again with `docker login ghcr.io`.
- **Docker updates:** Docker comes from Docker's own apt repository, which automatic security updates don't cover. Update it now and then with `sudo apt-get update && sudo apt-get install --only-upgrade docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin`. The container restarts by itself afterwards.
- **Container logs** are capped at 30 MB per container (Docker's `json-file` driver, 3 files of 10 MB).
