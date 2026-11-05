I want you to analyze the reference project named blackcat_adventures_front_end and create a complete set of reusable coding, formatting, and architectural rules for the subagents in my current project.

The blackcat_adventures_front_end project is the source of truth for the coding conventions and formatting standards I want to replicate

Phase 1: Analyze the reference project

Locate and inspect the blackcat_adventures_front_end project.

Review its structure and representative files to identify:

Technologies, frameworks, and libraries

Component organization and application architecture

Naming conventions. Notice in particular the naming conventions and the preferences for longer names

What libraries are used

Naming conventions

Code formatting, indentation, and whitespace

File and folder organization

Component and function structure

State management patterns

API integration patterns

Error handling and logging

Testing practices

Documentation conventions

Reusable components and design patterns

Do not assume conventions. Derive them from the actual project files. Pay special attention to where the shared types, constants and util functions are located.

Phase 2: Suplement the finding with the following rules

For the general-rules:

- Make a list of the libraries in blackcat_adventures_front_end and add React Testing Library and Playwright to it. Any library that is not installing as a dependency for a different library requires approval before installation.
- Add the following rules:
  - Before recommending or installing any new npm package, evaluate its adoption, maintenance, reliability, security, and compatibility.
  - Only suggest libraries with 10,000+ weekly downloads. If no library is found with these requirements, ask for suggestions instead of guessing.
  	 - Everytime a function is created include a 1 line comment indicating what the function is trying to archieve

For the back-end and databases:

- Make an exception, since blackcat_adventures_front_end does not contain a back-end, instead of referencing the project, consider that the back-end is a headless CMS application with WPGraphQl and assume best practices.

For the frontend agent add the following rules:

- Do not use any front-end libraries or framework, just CSS.
- The only @media query to be use for the css should be @media only screen and (max-width: 850px)

For the testing agent use the following guidelines:

- Jest for unit testing.
- Jest for component testing.
- React Testing Library for React components.
- Playwright for end-to-end testing.

Phase 2: Create shared project standards

Update all the files in the .claude directory with the new standards. When rules are more general such as code styles shared between multiple parts of the application, make sure to write them in the general-rules.md file in the rules directory instead of in the individual agent directories. For example, coding standards such as spacing, use of brackets, and semi-colon should be in this file. Make sure all the agents documents reference this file.

The objective is to make the subagents produce code that looks and behaves structurally consistent with the reference project.

Phase 3: Add a Code review agent

This agent is going to make sure all the other agents work as intended and follow the code best practices defined in the general-rules directory and in their specific directories. For example, the code reviewer should ensure the frontend subagent follows the rules in both the general-rules.md file and on the rules/frontend directory.

Phase 4: Configure Subagents

Each subagent must include:

A clear name and responsibility

A description of when Claude should use it

Instructions derived from blackcat_adventures_front_end

Relevant coding and formatting standards

Appropriate tool permissions

Clear boundaries for what it may modify

Instructions for reporting findings and changes

Each agent should reference the shared project standards rather than duplicating large amounts of identical instructions.

Do not create unnecessary agents or assign responsibilities that do not apply to the current project.

Phase 5: Configure the main Claude agent

update the root claude.md file.

It should explain:

Where each project standard is located and where the general-rules.md file is located

Which subagents are available

When to delegate tasks to each subagent

That all generated code must follow the established conventions

Phase 6: Validate the configuration

Before completing the task:

Verify that all subagent files use the correct Claude Code format.

Verify that all subagent avide by general-rules.md.

Ensure shared standards are consistent across all agents.

Eliminate contradictory instructions. Remember the one source of true above anything else is blackcat_adventures_front_end.

Ensure the main Claude agent can identify when to use each subagent.

Ensure no application code was modified.

Confirm that the reference project was not modified.

Scope and safety requirements

blackcat_adventures_front_end is strictly a read-only reference project.

My current project is the only project in which configuration files may be created or modified.

No references to files or to the directory blackcat_adventures_front_end should be made anywhere.

Do not copy proprietary application code from the reference project.

Do not make application code changes.

Do not install packages or modify dependencies.

Do not assume the reference project is in the current working directory. Locate it if necessary.

If you cannot access the reference project, stop and ask me to provide its location.

Approval process

First, analyze the reference project and give me a sample of the different sections one of the configuration files will have.

Show me:

The key formatting and architectural conventions you discovered

Wait for my approval before creating or modifying any files.

The final result should be a reusable Claude Code configuration that enables specialized subagents to consistently follow the coding style, formatting, and architectural conventions of blackcat_adventures_front_end.
