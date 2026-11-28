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

The live version is the `prod` branch. Work is merged into `main` through pull requests, and merging into `main` never deploys. A release is a pull request from `main` into `prod`.

### Release a new version

Run steps 1 and 2 on your computer, in Git Bash, in the project root, on a task branch.

1. Build the standalone app:
   ```bash
   yarn build:standalone
   ```
2. Commit your changes **together with the `.next/standalone` folder**, push the task branch, open a pull request into `main` and merge it:
   ```bash
   git add -A .next/standalone <changed_files>
   git commit -m "<commit_message>"
   git push -u origin <branch_name>
   ```
   Make sure to replace `<changed_files>` with the files you edited, `<commit_message>` with a short description of the change, and `<branch_name>` with your task branch. `-A` also stages the build files that the new build deleted.

   > **CAUTION:** The image is made from the committed `.next/standalone` folder. If you skip step 1, the previous build goes to production again.

3. Open a release pull request from `main` into `prod`. On GitHub, go to **Pull requests → New pull request**, set **base** to `prod` and **compare** to `main`. Or run:
   ```bash
   gh pr create --base prod --head main --title "Release <release_date>" --body "Release main to prod"
   ```
   Make sure to replace `<release_date>` with today's date, for example `2026-11-28`.
4. Merge it with **Create a merge commit**. Don't squash or rebase it: that rewrites the commits, so `prod` drifts away from `main` and the next release pull request shows old changes again or conflicts.
5. On GitHub, open **Actions → Deploy to production** and wait for the run to finish. It builds the image, pushes it to GHCR and replaces the container on the server. The last line of the "Deploy on the server" step shows `Deployed ghcr.io/edwinb24/digital-solutions-website:<short_sha>`. The tag is the short SHA of the release's merge commit on `prod`.

The workflow runs only when `.next/standalone/**`, `Dockerfile`, `.dockerignore` or `.github/workflows/deploy.yml` change, so a change to only `README.md` doesn't deploy. To run it again without a new commit, use **Run workflow** on the same page and choose `prod`. A run started from any other branch skips the deploy job.

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
2. Do steps 1 to 4 of [Release a new version](#release-a-new-version), so that `prod` holds what you deploy. If GitHub Actions comes back later, it deploys the same commit again, which is harmless. Then check out the latest `prod`:
   ```bash
   git checkout prod
   git pull --ff-only origin prod
   ```
   Switch back with `git checkout main` when you're done.
3. Save the short SHA of the `prod` commit:
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

> **CAUTION:** After a re-run, `prod` still points to the bad commit, and the next release deploys from `prod` again. Fix the problem first, or revert the bad commit on a task branch (`git revert <bad_sha>`) and release the fix through `main` into `prod`. Replace `<bad_sha>` with the SHA of the commit that broke production.

#### Option B: on the server

Use this if GitHub Actions isn't available. Nothing is rebuilt: GHCR keeps every image.

1. Find the short SHA of the last version that worked. Use the tag you recorded in step 2 of the server part of [Deploy manually](#deploy-manually-without-github-actions), `git log --oneline origin/prod`, or the package page at <https://github.com/edwinb24?tab=packages> → **digital-solutions-website**.
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

> **CAUTION:** A rollback on the server changes only the server. `prod` and the `latest` tag still point to the bad commit. Fix the problem, or revert the bad commit on a task branch (`git revert <bad_sha>`) and release the fix through `main` into `prod`, before the next release. Replace `<bad_sha>` with the SHA of the commit that broke production.

### Verify production

On the server, as your own user:

1. Make sure that the container shows `Up` with the SHA you expect:
   ```bash
   docker ps --format '{{.Names}} {{.Image}} {{.Status}}'
   ```
2. Make sure that the app returns `200`:
   ```bash
   curl -I http://127.0.0.1:3000
   ```
3. Make sure that the logs show `Ready` and no errors:
   ```bash
   docker logs digital-solutions-website
   ```
   A new container's log is short, so check it right after the deploy.

   > **NOTE:** Lines like `Error: The Server Reference ID did not match the expected format` come from internet scanners that send fake server-action requests. Next.js rejects them. They don't mean the deploy failed.
4. Open <https://e4digitalsolutions.com> in a browser.

### Common errors

| Where | Error | Fix |
|---|---|---|
| GitHub Actions | `.next/standalone/server.js is missing` or `.next/standalone/.next/static is missing` | The standalone build isn't committed. Run `yarn build:standalone`, then `git add -A .next/standalone`, commit and push |
| GitHub Actions | `The SSH_HOST repository secret is missing or empty` (or `SSH_USER`), or `usage: ssh ...` | A repository secret is missing or empty. Set it in **Settings → Secrets and variables → Actions → Repository secrets**, then use **Run workflow** |
| Your computer | `failed to connect to the docker API` | Start Docker Desktop and wait for **Engine running** |
| Your computer | `bash: =: command not found` | You used PowerShell syntax in Git Bash. Use `sha=$(git rev-parse --short HEAD)` |
| Your computer | `tag does not exist` on `docker push` | The build didn't make that tag. Check `echo $sha`, then run `docker build` again |
| Your computer | `denied` or `unauthorized` on `docker push` | Your `write:packages` token has expired or isn't logged in. Make a new one and run `docker login ghcr.io -u edwinb24` again |
| The server | `denied` or `unauthorized` on `docker pull` | The package is public, so no login is needed. An old login may be getting in the way: run `docker logout ghcr.io` and pull again. If it still fails, check that the package page still shows **Public** |
| The server | `syntax error near unexpected token 'newline'` | You typed a placeholder such as `<sha>`. Use the real value |
| The server | `.env: permission denied` | Your user can't read `/opt/digital-solutions-website/.env`. Don't run `docker` with `sudo`. Check the file with `ls -l`: it must belong to the `docker` group with mode `640`, and your user must be in that group |
| The server | `container name "/digital-solutions-website" is already in use` | Run `docker rm -f digital-solutions-website`, then `docker run` again |

### Maintenance

- **GHCR tokens:** the server needs none while the package is public. Only your computer's `write:packages` token, used for manual deploys, expires. If the package is ever made private, the deploy user on the server must log in to GHCR with a `read:packages` token, and deploys fail when that token expires.
- **Docker updates:** Docker comes from Docker's own apt repository, which automatic security updates don't cover. Update it now and then with `sudo apt-get update && sudo apt-get install --only-upgrade docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin`. The container restarts by itself afterwards.
- **Container logs** are capped at 30 MB per container (Docker's `json-file` driver, 3 files of 10 MB).
- **Old images:** `docker image prune -f` removes only untagged images, so every release leaves its SHA-tagged image on the server. Now and then, list them with `docker images ghcr.io/edwinb24/digital-solutions-website` and remove old ones with `docker rmi ghcr.io/edwinb24/digital-solutions-website:<old_sha>`. Keep the current one and the one before it for a quick rollback. Replace `<old_sha>` with the tag of an image you no longer need.
