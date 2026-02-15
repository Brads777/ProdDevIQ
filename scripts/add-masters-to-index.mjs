// ©2026 Brad Scheller
// Script to add 21 master skills to skillpository index.yaml

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INDEX_PATH = path.join(__dirname, '..', 'skillpository', 'index.yaml');

const MASTERS = [
  { name: 'testing-master', replaces: 'testing-patterns', category: 'testing', desc: 'Comprehensive testing guide: TDD, unit/integration/E2E with Playwright, patterns across JS/Python/Bash. Consolidates 15 testing skills.' },
  { name: 'database-master', replaces: 'databases', category: 'database', desc: 'Comprehensive database guide: schema design, PostgreSQL, migrations, NoSQL, query optimization, Neon/Supabase. Consolidates 13 skills.' },
  { name: 'security-master', replaces: 'security-best-practices', category: 'security', desc: 'Comprehensive security guide: OWASP Top 10, threat modeling, secure coding, API security, dependency auditing, compliance. Consolidates 12 skills.' },
  { name: 'python-master', replaces: 'python-patterns', category: 'python', desc: 'Comprehensive Python guide: design patterns, async programming, type safety, project structure, error handling, performance. Consolidates 11 skills.' },
  { name: 'prompt-master', replaces: 'prompt-engineering', category: 'ai-llm', desc: 'Comprehensive prompt engineering guide: techniques, structured output (DSPy/Instructor/Outlines), caching, prompt library. Consolidates 10 skills.' },
  { name: 'agentdb-master', replaces: 'agentdb-advanced', category: 'ai-llm', desc: 'Comprehensive AgentDB guide: vector search, memory patterns, QUIC sync, learning plugins, ReasoningBank. Consolidates 12 skills.' },
  { name: 'react-master', replaces: 'react-best-practices', category: 'frontend-design', desc: 'Comprehensive React guide: component patterns, hooks, state management, React Native, Server Components. Consolidates 8 skills.' },
  { name: 'api-master', replaces: 'api-design-principles', category: 'backend-api', desc: 'Comprehensive API guide: REST design, GraphQL, OpenAPI specs, type-safe clients, security, testing. Consolidates 8 skills.' },
  { name: 'backend-master', replaces: 'backend-development', category: 'backend-api', desc: 'Comprehensive backend guide: Node.js/Python/.NET patterns, architecture, auth, error handling, frontend handoff. Consolidates 7 skills.' },
  { name: 'ui-design-master', replaces: 'ui-ux-pro-max', category: 'frontend-design', desc: 'Comprehensive UI/UX guide: design systems, Tailwind CSS, component libraries, accessibility, responsive design. Consolidates 7 skills.' },
  { name: 'rag-master', replaces: 'rag-implementation', category: 'ai-llm', desc: 'Comprehensive RAG guide: vector databases (Chroma/FAISS/Pinecone/Qdrant), embeddings, chunking, retrieval strategies. Consolidates 7 skills.' },
  { name: 'performance-master', replaces: 'performance-analysis', category: 'general', desc: 'Comprehensive performance guide: Web Vitals, JS/Python optimization, database tuning, profiling tools, monitoring. Consolidates 6 skills.' },
  { name: 'ml-master', replaces: 'ml-pipeline-workflow', category: 'data-science-ml', desc: 'Comprehensive ML/MLOps guide: pipeline workflows, experiment tracking (MLflow/TensorBoard/W&B), deployment, paper writing. Consolidates 5 skills.' },
  { name: 'github-master', replaces: 'github-automation', category: 'git-vcs', desc: 'Comprehensive GitHub guide: Actions CI/CD, release management, multi-repo workflows, project management, automation. Consolidates 5 skills.' },
  { name: 'pdf-master', replaces: 'pdf-anthropic', category: 'document-processing', desc: 'Comprehensive PDF guide: text extraction, Claude integration, generation, OCR, manipulation, RAG pipelines. Consolidates 5 skills.' },
  { name: 'game-master', replaces: 'game-development', category: 'general', desc: 'Comprehensive game development guide: design, art pipelines, audio, engines (Godot/Phaser/Pygame), web games. Consolidates 5 skills.' },
  { name: 'frontend-master', replaces: 'frontend-development', category: 'frontend-design', desc: 'Comprehensive frontend guide: architecture, state management, build tooling, accessibility, modern CSS. Consolidates 4 skills.' },
  { name: 'code-review-master', replaces: 'code-review-excellence', category: 'code-review', desc: 'Comprehensive code review guide: checklists, giving/receiving feedback, automated checks, AI-assisted review. Consolidates 4 skills.' },
  { name: 'documentation-master', replaces: 'technical-documentation', category: 'general', desc: 'Comprehensive documentation guide: README templates, API docs, ADRs, tech specs, quality management, tools. Consolidates 4 skills.' },
  { name: 'mobile-master', replaces: 'mobile-design', category: 'frontend-design', desc: 'Comprehensive mobile guide: React Native/Expo, iOS/Android design, UX patterns, performance, app store submission. Consolidates 4 skills.' },
  { name: 'seo-master', replaces: 'seo-fundamentals', category: 'frontend-design', desc: 'Comprehensive SEO guide: technical SEO, content optimization, Core Web Vitals, structured data, Next.js SEO. Consolidates 3 skills.' },
];

function parseYamlLines(content) {
  const lines = content.split('\n');
  const entries = [];
  let currentEntry = null;
  let currentIndent = 0;
  let inSkillsSection = false;
  let headerEndIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Track header end
    if (trimmed === 'skills:') {
      inSkillsSection = true;
      headerEndIndex = i;
      continue;
    }

    if (!inSkillsSection) continue;

    // Detect new entry
    if (trimmed.startsWith('- name:')) {
      if (currentEntry) {
        entries.push(currentEntry);
      }
      const name = trimmed.replace('- name:', '').trim();
      currentEntry = {
        startLine: i,
        endLine: i,
        name,
        lines: [line],
        indent: line.match(/^\s*/)[0].length,
      };
      currentIndent = currentEntry.indent;
    } else if (currentEntry && line.match(/^\s*\w+:/)) {
      // Property line
      const propIndent = line.match(/^\s*/)[0].length;
      if (propIndent > currentIndent) {
        currentEntry.lines.push(line);
        currentEntry.endLine = i;

        // Parse properties
        if (trimmed.startsWith('type:')) {
          currentEntry.type = trimmed.replace('type:', '').trim();
        } else if (trimmed.startsWith('category:')) {
          currentEntry.category = trimmed.replace('category:', '').trim();
        } else if (trimmed.startsWith('description:')) {
          currentEntry.description = trimmed.replace('description:', '').trim().replace(/^"|"$/g, '');
        } else if (trimmed.startsWith('source:')) {
          currentEntry.source = trimmed.replace('source:', '').trim().replace(/^"|"$/g, '');
        }
      } else {
        // New top-level property, finish current entry
        if (currentEntry) {
          entries.push(currentEntry);
          currentEntry = null;
        }
      }
    } else if (currentEntry && line.trim() === '') {
      // Empty line within entry
      currentEntry.lines.push(line);
      currentEntry.endLine = i;
    } else if (currentEntry && line.match(/^\s+\S/)) {
      // Continuation line (description, etc.)
      currentEntry.lines.push(line);
      currentEntry.endLine = i;
    } else if (trimmed.startsWith('#')) {
      // Comment - finish current entry
      if (currentEntry) {
        entries.push(currentEntry);
        currentEntry = null;
      }
    }
  }

  if (currentEntry) {
    entries.push(currentEntry);
  }

  return { entries, lines, headerEndIndex };
}

function createEntryLines(master, indent = 2) {
  const spaces = ' '.repeat(indent);
  return [
    `${spaces}- name: ${master.name}`,
    `${spaces}  type: skill`,
    `${spaces}  category: ${master.category}`,
    `${spaces}  description: "${master.desc}"`,
    `${spaces}  source: IDETOOLS/skills/${master.name}`,
  ];
}

function main() {
  console.log('Reading index.yaml...');
  const content = fs.readFileSync(INDEX_PATH, 'utf8');

  const { entries, lines, headerEndIndex } = parseYamlLines(content);
  console.log(`Parsed ${entries.length} skill entries`);

  let addedCount = 0;
  let updatedCount = 0;
  let redirectCount = 0;

  // Build a map of entries by name for quick lookup
  const entryMap = new Map();
  entries.forEach(entry => {
    entryMap.set(entry.name, entry);
  });

  // Process each master
  MASTERS.forEach(master => {
    const existingMaster = entryMap.get(master.name);
    const replacedEntry = entryMap.get(master.replaces);

    if (existingMaster) {
      // Update existing master entry
      console.log(`  Updating existing: ${master.name}`);
      const updatedLines = createEntryLines(master, existingMaster.indent);

      // Replace lines
      for (let i = 0; i < updatedLines.length && i < existingMaster.lines.length; i++) {
        lines[existingMaster.startLine + i] = updatedLines[i];
      }

      // If new entry has more lines, insert them
      if (updatedLines.length > existingMaster.lines.length) {
        const insertAt = existingMaster.startLine + existingMaster.lines.length;
        lines.splice(insertAt, 0, ...updatedLines.slice(existingMaster.lines.length));
      }

      updatedCount++;
    } else {
      // Add new master entry
      console.log(`  Adding new: ${master.name} (after ${master.replaces})`);

      if (replacedEntry) {
        // Insert right after the replaced entry
        const insertAt = replacedEntry.endLine + 1;
        const newLines = [
          '', // Empty line before
          ...createEntryLines(master, replacedEntry.indent),
        ];
        lines.splice(insertAt, 0, ...newLines);
        addedCount++;
      } else {
        console.log(`    Warning: Could not find '${master.replaces}' to insert after`);
      }
    }

    // Update the replaced entry to redirect to master
    if (replacedEntry && replacedEntry.source !== `IDETOOLS/skills/${master.name}`) {
      console.log(`  Redirecting: ${master.replaces} -> ${master.name}`);

      // Find and update the source line
      for (let i = replacedEntry.startLine; i <= replacedEntry.endLine; i++) {
        if (lines[i].trim().startsWith('source:')) {
          const indent = lines[i].match(/^\s*/)[0];
          lines[i] = `${indent}source: IDETOOLS/skills/${master.name}`;
          redirectCount++;
          break;
        }
      }
    }
  });

  // Count total skills (entries with type: skill)
  const totalSkills = entries.filter(e => e.type === 'skill').length + addedCount;

  // Update total_skills in header
  for (let i = 0; i <= headerEndIndex; i++) {
    if (lines[i].trim().startsWith('total_skills:')) {
      lines[i] = `total_skills: ${totalSkills}`;
      console.log(`\nUpdated total_skills to ${totalSkills}`);
      break;
    }
  }

  // Write back
  console.log('\nWriting updated index.yaml...');
  fs.writeFileSync(INDEX_PATH, lines.join('\n'), 'utf8');

  console.log('\n=== Summary ===');
  console.log(`Added: ${addedCount} new master skills`);
  console.log(`Updated: ${updatedCount} existing master skills`);
  console.log(`Redirected: ${redirectCount} replaced entries to masters`);
  console.log(`Total skills in index: ${totalSkills}`);
  console.log('\nDone!');
}

main();
