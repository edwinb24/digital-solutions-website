# This document contains the details of the different trade-offs for this setup

For more information, see the documents in the `project_documents` directory. This directory contains the business needs for the project and a breakdown of the company's objectives.

0. Why decide these instead of letting the agent decide?
   AI lacks the full context of what I'm familiar with and what I know to be true about my client and about myself as a developer. I could give it the context, but it would still not be enough, as it doesn't contain the full knowledge of what I can't express: things that I can't think of ahead of time and verbalize to it. It lacks the full real context of what I know of the real world, my future plans, my knowledge base, and my clients' profiles.
1. Why a CMS?
   We want the information on the page to be easy for non-technical users to modify without the need for an AI. This is one of our core requirements.
2. Why WordPress?
   WordPress provides four main differentiators:

   - It has been in use for a long time, which translates to very extensive documentation for WP and PHP. While there may be other CMSs that are faster or provide more bells and whistles, when it comes to solving issues, WP is by far the best documented one, which helps an agent have more sources of truth for its decision-making process when solving issues.
   - It is a non-subscription-based editor, which helps keep costs low.
   - Familiarity for the developer. I have 6 years of professional experience with WP and 8 with PHP. My familiarity with the codebase helps me feel comfortable jumping into the code, reading it, and assisting the agent with clarifications when needed.
   - Ease of use for the client. The WYSIWYG editor provides a familiar environment for users.

3. Why a standalone release with a local build instead of a build on the server on push?
   Building this way allows us to keep the load on the servers low. That way, the servers don't have to go through the effort of actually building the release, and this also allows us to use Docker for our releases.
4. Why Docker?
   Containers allow us to provide consistency between builds, so the release we test locally is the same one that runs on the server. Since WordPress lives on the same server, Docker also keeps the Node.js application separated from Apache and PHP, so updating one doesn't break the other. Every release is an image tagged with its commit, which makes rolling back a simple process and makes it easier to move to something like an EC2 instance on AWS if we outgrow DigitalOcean in the future.
5. Why DigitalOcean?
   A popular alternative would be using something like Vercel for hosting the Next.js application. In that case, we would need to ditch WordPress or pay for two different servers. While it would simplify the CI/CD process, the ability to have full control over the Linux machine and change the architecture as needed is very valuable. After setup, most of the deployment process is rather simple. Also, DigitalOcean provides more scaling options, and being closer to the server allows us to be better prepared if we outgrow it and want to migrate to something like an EC2 instance on AWS in the future.
6. Why a Linux Ubuntu server?
   This one mainly comes down to preference and the ubiquity of Ubuntu. I have worked with Ubuntu servers for more than 10 years in one way or another. For a couple of years, an Ubuntu system was even my main day-to-day driver. In addition, it is the most popular one and the best documented, which helps a lot when trying to troubleshoot issues.
7. Why GitHub Actions?
   With the repositories already on GitHub, using Actions allows us to easily deploy them to our DigitalOcean servers. We don't need to reinvent the wheel; we just want secure, consistent Docker deployments.
8. Why use Next.js?
   While we want WordPress to be the main way to write content, its HTML, CSS, JS and PHP stack limits what we can do with the site. Using React and Next.js gives us a wide variety of libraries at our disposal, some of which can add very cool effects we want on our pages, like Three.js and GSAP.
9. Why use Apollo GraphQL?
   Mainly, it's just a system and setup that I'm familiar with. The speed trade-off is small enough that it's more worthwhile for me to simply stick with something I'm familiar with in this scenario. While other systems can provide an easier implementation, the knowledge I have gathered from 3 years of using Apollo helps me implement it faster than those systems and have an easier time maintaining the codebase.
