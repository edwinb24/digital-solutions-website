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
| Run the standalone build locally | `node .next/standalone/server.js` |

> **NOTE:** The standalone server listens on port 3000 on all network addresses by default, the same as in the container. Run `yarn build:standalone` first if the code changed: the server runs the last build.

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
2. Commit your changes **together with the `.next/standalone` folder**, and push to `main`:
   ```bash
   git add -A .next/standalone <changed_files>
   git commit -m "<commit_message>"
   git push
   ```
   Make sure to replace `<changed_files>` with the files you edited, and `<commit_message>` with a short description of the change. `-A` also stages the build files that the new build deleted.

   > **CAUTION:** The image is made from the committed `.next/standalone` folder. If you skip step 1, the previous build goes to production again.

3. On GitHub, open **Actions → Deploy to production** and wait for the run to finish. It builds the image, pushes it to GHCR and replaces the container on the server. The last line of the "Deploy on the server" step shows `Deployed ghcr.io/edwinb24/digital-solutions-website:<short_sha>`.

The workflow runs only when `.next/standalone/**`, `Dockerfile`, `.dockerignore` or `.github/workflows/deploy.yml` change, so a change to only `README.md` doesn't deploy. To run it again without a new commit, use **Run workflow** on the same page.

> **NOTE:** The build runs on Windows, but the container runs Linux. Don't add packages with native binaries (such as `sharp`) to the runtime code: the Windows binary would be copied into the Linux image. This is why `next.config.ts` sets `images: {unoptimized: true}`.

### Deploy manually (without GitHub Actions)

Use this only when GitHub Actions isn't available. You build and push the image from your computer, then replace the container on the server yourself.

#### One-time setup on your computer

1. Install [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/).
2. On GitHub, go to profile picture → **Settings → Developer settings → Personal access tokens → Tokens (classic)**, and make a classic token with only the `write:packages` scope. GHCR doesn't accept fine-grained tokens.
3. Start Docker Desktop. In Git Bash, log in to GHCR and paste the token at the `Password:` prompt:
   ```bash
   docker login ghcr.io -u edwinb24
   ```
   You must see `Login Succeeded`. The token expires on the date you chose: make a new one and log in again when it does.

#### Your computer

Run these in Git Bash, in the project root.

1. Start Docker Desktop and wait until it shows **Engine running**.
2. Build the standalone app and commit it, as in steps 1 and 2 of [Release a new version](#release-a-new-version). Push to `main` too, so that `main` matches production. If GitHub Actions comes back later, it deploys the same commit again, which is harmless.
3. Save the short SHA of the new commit:
   ```bash
   sha=$(git rev-parse --short HEAD)
   echo $sha
   ```
   Record the value, because you need it on the server.

   > **NOTE:** Do this after the commit. Otherwise the tag points to the previous commit. A new terminal doesn't have the `sha` variable, so set it again there.

4. Build the image with two tags. Don't forget the `.` at the end:
   ```bash
   docker build --platform linux/amd64 --label org.opencontainers.image.source=https://github.com/edwinb24/digital-solutions-website -t ghcr.io/edwinb24/digital-solutions-website:$sha -t ghcr.io/edwinb24/digital-solutions-website:latest .
   ```
5. Make sure that both tags exist and have the same IMAGE ID:
   ```bash
   docker images ghcr.io/edwinb24/digital-solutions-website
   ```
6. Push both tags:
   ```bash
   docker push ghcr.io/edwinb24/digital-solutions-website:$sha
   docker push ghcr.io/edwinb24/digital-solutions-website:latest
   ```

#### The server

1. Connect to the server with SSH as your own user, not root. Your user is in the `docker` group, so run `docker` without `sudo`.
2. Record the tag that runs now, in case you must roll back:
   ```bash
   docker ps --format '{{.Image}}'
   ```
3. Set the SHA from step 3 on your computer, and pull the image:
   ```bash
   sha=<sha>
   docker pull ghcr.io/edwinb24/digital-solutions-website:$sha
   ```
   Make sure to replace `<sha>` with the short SHA you recorded.
4. Replace the container. The site is down from `docker rm` until `docker run` finishes, usually a few seconds:
   ```bash
   docker rm -f digital-solutions-website
   docker run -d --name digital-solutions-website --restart unless-stopped -p 127.0.0.1:3000:3000 --env-file /opt/digital-solutions-website/.env ghcr.io/edwinb24/digital-solutions-website:$sha
   ```
5. Delete images that no container uses and that have no tag:
   ```bash
   docker image prune -f
   ```
6. Do the steps in [Verify production](#verify-production).

> **WARNING:** Don't run `docker` with `sudo`. You don't need it, and the commands are meant to run as your own user. Always keep `127.0.0.1:` in the `-p` option. Without it, port 3000 is open to the internet and visitors can bypass Apache and HTTPS.

### Roll back to an earlier version

Use this when the live version doesn't work. There are two ways.

#### Option A: re-run an earlier deploy in GitHub Actions

1. On GitHub, open **Actions → Deploy to production**.
2. Open the run of the last commit that worked, and click **Re-run all jobs**. The workflow packages that commit's `.next/standalone` again and deploys it with its own SHA tag. It also moves the `latest` tag back to that commit.
3. Do the steps in [Verify production](#verify-production).

> **CAUTION:** After a re-run, `main` still points to the bad commit, and the next push deploys from `main` again. Fix the problem or run `git revert <bad_sha>` first. Replace `<bad_sha>` with the SHA of the commit that broke production.

#### Option B: on the server

Use this if GitHub Actions isn't available. Nothing is rebuilt: GHCR keeps every image.

1. Find the short SHA of the last version that worked. Use the tag you recorded in step 2 of the server part of [Deploy manually](#deploy-manually-without-github-actions), `git log --oneline`, or the package page at <https://github.com/edwinb24?tab=packages> → **digital-solutions-website**.
2. Connect to the server with SSH as your own user, not root.
3. Start the version that worked:
   ```bash
   sha=<last_good_sha>
   docker pull ghcr.io/edwinb24/digital-solutions-website:$sha
   docker rm -f digital-solutions-website
   docker run -d --name digital-solutions-website --restart unless-stopped -p 127.0.0.1:3000:3000 --env-file /opt/digital-solutions-website/.env ghcr.io/edwinb24/digital-solutions-website:$sha
   ```
   Make sure to replace `<last_good_sha>` with the short SHA from step 1.
4. Do the steps in [Verify production](#verify-production).

> **CAUTION:** A rollback on the server changes only the server. `main` and the `latest` tag still point to the bad commit. Fix the problem or run `git revert <bad_sha>` before the next release. Replace `<bad_sha>` with the SHA of the commit that broke production.

### Verify production

On the server, as your own user:

```bash
docker ps --format '{{.Names}} {{.Image}} {{.Status}}'
curl -I http://127.0.0.1:3000
```

The container must show `Up` with the SHA you expect, and `curl` must return `200`. Then open <https://e4digitalsolutions.com> in a browser.

### Maintenance

- **GHCR tokens:** the server needs none while the package is public. Only your computer's `write:packages` token, used for manual deploys, expires. If the package is ever made private, the deploy user on the server must log in to GHCR with a `read:packages` token, and deploys fail when that token expires.
- **Docker updates:** Docker comes from Docker's own apt repository, which automatic security updates don't cover. Update it now and then with `sudo apt-get update && sudo apt-get install --only-upgrade docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin`. The container restarts by itself afterwards.
- **Container logs** are capped at 30 MB per container (Docker's `json-file` driver, 3 files of 10 MB).
- **Old images:** `docker image prune -f` removes only untagged images, so every release leaves its SHA-tagged image on the server. Now and then, list them with `docker images ghcr.io/edwinb24/digital-solutions-website` and remove old ones with `docker rmi ghcr.io/edwinb24/digital-solutions-website:<old_sha>`. Keep the current one and the one before it for a quick rollback. Replace `<old_sha>` with the tag of an image you no longer need.
