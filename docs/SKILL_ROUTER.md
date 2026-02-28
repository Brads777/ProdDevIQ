# **Claude Skill Router & Registry**

**System Instruction:** This file serves as the master registry for available Claude Skills. When a user request matches a **Description** or **Trigger Intent**, load the context from the corresponding **Local Path**. If the skill involves a specific file type (e.g., PDF, CSV), prioritize the specialized skill over general purpose tools.

## **📂 1\. Document Intelligence & Creation**

*Skills for creating, editing, and extracting data from office documents.*

| Skill Name | Trigger Intents | Description | Local Path |
| :---- | :---- | :---- | :---- |
| **docx** | create word doc, edit docx, track changes, add comments | Create/edit Word docs with professional formatting, comments, and tracked changes. | ./docx |
| **pdf** | read pdf, fill form, merge pdfs, extract table from pdf | Parse PDF content, fill interactive forms, merge documents, and extract tables. | ./pdf |
| **pptx** | make slides, create powerpoint, edit presentation | Generate and modify PowerPoint slides, layouts, and speaker notes. | ./pptx |
| **xlsx** | analyze excel, create spreadsheet, pivot table, excel formula | sophisticated Excel operations including formulas, charts, and pivot tables. | ./xlsx |
| **markitdown** | convert to markdown, parse file, read strange format | Universal converter that turns PDF, Office, and other formats into clean Markdown. | ./markitdown |
| **pdf-processing-pro** | ocr, scanned pdf, batch pdf | Advanced PDF handling including OCR for scanned docs and batch processing. | ./pdf-processing-pro |

## **💻 2\. Software Engineering & DevOps**

*Skills for coding workflows, testing, infrastructure, and git management.*

| Skill Name | Trigger Intents | Description | Local Path |
| :---- | :---- | :---- | :---- |
| **test-driven-development** | tdd, write tests first, implement feature | Enforces writing failing tests before implementation code. | ./test-driven-development |
| **webapp-testing** | test web app, playwright, browser test | End-to-end web testing using Playwright for UI verification. | ./webapp-testing |
| **git-advanced-workflows** | rebase, bisect, fix git history | Handles complex git operations like rebasing, bisecting, and history cleanup. | ./git-advanced-workflows |
| **using-git-worktrees** | switch branch, parallel work, new feature context | Manages git worktrees to keep feature work isolated without context switching. | ./using-git-worktrees |
| **terraform-module-library** | infrastructure as code, terraform, aws setup | Generates and manages Terraform modules for cloud infrastructure. | ./terraform-module-library |
| **k8s-manifest-generator** | kubernetes, k8s yaml, deploy app | Creates production-ready Kubernetes manifests (Deployments, Services). | ./k8s-manifest-generator |
| **api-test-generator** | test api, validate endpoint, pytest | Generates comprehensive pytest suites for REST API endpoints. | ./api-test-generator |
| **code-review-excellence** | review code, cr, pull request | Performs detailed code reviews focusing on bugs, security, and style. | ./code-review-excellence |

## **🔬 3\. Scientific Research & Data**

*Skills for biomedical research, chemical analysis, and academic workflows.*

| Skill Name | Trigger Intents | Description | Local Path |
| :---- | :---- | :---- | :---- |
| **biomni** | biomedical research, gene analysis, crispr | Autonomous agent for complex biomedical tasks (CRISPR, RNA-seq, etc). | ./biomni |
| **literature-review** | survey papers, find research, summarize literature | Conducts systematic literature reviews across scientific databases. | ./literature-review |
| **exploratory-data-analysis** | eda, analyze dataset, data summary | Automated exploratory data analysis on CSV/scientific formats with reporting. | ./exploratory-data-analysis |
| **chembl-database** | find molecule, drug data, bioactivity | Query ChEMBL for bioactive molecules and drug discovery data. | ./chembl-database |
| **paper-2-web** | summarize paper, paper to html, visualize study | Converts static academic papers into interactive web summaries/visuals. | ./paper-2-web |
| **visualize-molecules** | rdkit, draw molecule, 3d structure | Generates 2D/3D visualizations of chemical structures using RDKit. | ./rdkit |

## **🛡️ 4\. Security & Compliance**

*Skills for auditing, security scanning, and regulatory compliance.*

| Skill Name | Trigger Intents | Description | Local Path |
| :---- | :---- | :---- | :---- |
| **security-audit** | audit code, find vulnerabilities, security check | Automated security auditing for common vulnerabilities (OWASP). | ./security-audit |
| **sast-configuration** | setup sast, static analysis, sonar | Configures Static Application Security Testing tools for the repo. | ./sast-configuration |
| **solidity-security** | audit smart contract, check solidity, web3 security | specialized security audit for Solidity/Blockchain smart contracts. | ./solidity-security |
| **pci-compliance** | pci check, payment security, compliance audit | Verifies code and config against PCI-DSS payment security standards. | ./pci-compliance |

## **🎨 5\. Design & Content Creation**

*Skills for visuals, branding, and content generation.*

| Skill Name | Trigger Intents | Description | Local Path |
| :---- | :---- | :---- | :---- |
| **brand-guidelines** | check branding, apply style, marketing copy | Enforces brand voice, colors, and typography on generated content. | ./brand-guidelines |
| **slack-gif-creator** | make gif, slack animation | Creates optimized animated GIFs specifically for Slack dimensions. | ./slack-gif-creator |
| **content-research-writer** | write article, blog post, content strategy | Researches and drafts high-quality content with citations and hooks. | ./content-research-writer |
| **email-composer** | draft email, write reply, professional email | Drafts context-aware professional emails for various business scenarios. | ./email-composer |

## **🤖 6\. Meta & Utility**

*Skills for managing the agent itself or general utilities.*

| Skill Name | Trigger Intents | Description | Local Path |
| :---- | :---- | :---- | :---- |
| **skill-creator** | create new skill, make skill | Interactive wizard to generate new SKILL.md files and folder structures. | ./skill-creator |
| **file-organizer** | organize files, cleanup folder, sort directory | Intelligently sorts and organizes messy directories by file content. | ./file-organizer |
| **cost-optimization** | check aws cost, reduce cloud spend | Analyzes infrastructure resources to identify waste and suggest savings. | ./cost-optimization |
| **video-downloader** | download youtube, save video | Downloads video content for offline analysis or archival. | ./video-downloader |

