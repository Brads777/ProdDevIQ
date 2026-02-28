#!/usr/bin/env node
// ©2026 Brad Scheller
// Bulk import pending skillpository items into index.yaml

import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const PENDING_DIR = 'E:\\GODMODEDEV\\skillpository\\PENDING';
const INDEX_PATH = 'E:\\GODMODEDEV\\skillpository\\index.yaml';

// Categorization rules for skills
const SKILL_CATEGORIES = {
  'scientific-biotech': ['alphafold', 'biopython', 'pubchem', 'rdkit', 'uniprot', 'deepchem', 'esm', 'biotech', 'biology'],
  'data-science-ml': ['scikit-learn', 'pytorch', 'plotly', 'statsmodels', 'machine-learning', 'ml-', 'training', 'fine-tuning', 'model'],
  'ai-llm': ['prompt', 'rag', 'langchain', 'llm', 'agent', 'swarm', 'embedding', 'multimodal', 'agentic'],
  'testing': ['test', 'tdd', 'playwright', 'e2e', 'bats', 'qa', 'testing'],
  'code-review': ['code-review', 'lint', 'sast', 'verification', 'reviewer'],
  'document-processing': ['pdf', 'docx', 'pptx', 'xlsx', 'document'],
  'frontend-design': ['frontend', 'ui', 'canvas', 'brand', 'theme', 'landing', 'react', 'vue', 'angular', 'component', 'tailwind', 'css', 'design-system'],
  'devops-cicd': ['github-actions', 'gitlab-ci', 'helm', 'k8s', 'deploy', 'cicd', 'pipeline', 'deployment'],
  'cloud-infrastructure': ['terraform', 'cloud', 'aws', 'azure', 'infrastructure', 'kubernetes', 'k8s', 'istio', 'linkerd', 'mesh', 'multi-cloud', 'hybrid-cloud'],
  'security': ['security', 'pci', 'secrets', 'defense', 'pentest', 'gdpr', 'compliance', 'solidity-security'],
  'database': ['postgresql', 'database', 'sql', 'migration', 'postgres', 'neon', 'mongo', 'mysql', 'optimization'],
  'backend-api': ['backend', 'fastapi', 'api', 'microservice', 'nodejs', 'express', 'hono', 'dotnet', 'architecture'],
  'javascript-typescript': ['javascript', 'typescript', 'react-native', 'expo', 'nextjs', 'svelte', 'modern-javascript'],
  'python': ['python', 'async-python', 'django', 'flask', 'temporal-python'],
  'git-vcs': ['git', 'worktree', 'monorepo', 'branch', 'github', 'turborepo', 'nx-workspace', 'bazel'],
  'observability': ['grafana', 'prometheus', 'tracing', 'slo', 'observability', 'kpi-dashboard'],
  'payment-commerce': ['stripe', 'paypal', 'billing', 'shopify', 'nft', 'defi', 'commerce', 'web3'],
  'productivity': ['brainstorm', 'planning', 'skill-creator', 'template', 'productivity', 'writing', 'content', 'blog', 'seo', 'changelog', 'context-driven'],
  'communication-media': ['slack', 'email', 'video', 'image', 'media', 'gif', 'data-storytelling'],
  'problem-solving': ['debugging', 'root-cause', 'problem-solving', 'error'],
  'plugin-development': ['plugin', 'skill-develop', 'mcp', 'hook-develop', 'agent-development', 'command-development'],
  'research-search': ['research', 'search', 'perplexity', 'brightdata'],
  'mobile-development': ['mobile', 'react-native', 'flutter', 'ios', 'android'],
  'game-development': ['game', 'unity', 'unreal', 'godot'],
  'business-product': ['business', 'product', 'marketing', 'legal', 'sales', 'employment', 'incident', 'postmortem', 'on-call'],
  'integrations': ['n8n', 'integration', 'automation', 'workflow', 'airflow', 'dag', 'dbt', 'spark', 'data-quality'],
  'design-ux': ['design', 'ux', 'ui-design', 'figma', 'accessibility', 'wcag'],
  'workflows': ['saga', 'cqrs', 'event-store', 'projection', 'orchestration', 'workflow-patterns', 'track-management'],
};

// Categorization rules for agents
const AGENT_CATEGORIES = {
  'orchestration': ['orchestrat', 'coordinat', 'swarm', 'consensus', 'multi-agent', 'task-distributor', 'workflow', 'team-composition', 'team-communication', 'task-coordination'],
  'data-ai': ['agentdb', 'vector', 'memory', 'data-', 'ml-', 'nlp'],
  'development': ['dev', 'code', 'frontend', 'backend', 'architect', 'explorer', 'simplifier', 'creator'],
  'quality-security': ['security', 'pentest', 'audit', 'review', 'test', 'analyzer', 'wcag', 'screen-reader', 'multi-reviewer', 'validator'],
  'infrastructure': ['infra', 'cloud', 'deploy', 'devops'],
  'business-product': ['business', 'product', 'marketing'],
};

// Parse simple YAML (key: value format)
function parseSimpleYAML(content) {
  const lines = content.split('\n');
  const obj = {};

  for (const line of lines) {
    if (line.trim().startsWith('#') || !line.includes(':')) continue;

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();

    // Remove quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.substring(1, value.length - 1);
    }

    obj[key] = value;
  }

  return obj;
}

// Auto-categorize based on name and description
function categorizeItem(name, description, type) {
  const searchText = `${name} ${description}`.toLowerCase();

  if (type === 'agent') {
    for (const [category, keywords] of Object.entries(AGENT_CATEGORIES)) {
      if (keywords.some(kw => searchText.includes(kw))) {
        return category;
      }
    }
    return 'general';
  } else {
    for (const [category, keywords] of Object.entries(SKILL_CATEGORIES)) {
      if (keywords.some(kw => searchText.includes(kw))) {
        return category;
      }
    }
    return 'general';
  }
}

// Truncate description to max length
function truncateDescription(desc, maxLength = 200) {
  if (desc.length <= maxLength) return desc;
  return desc.substring(0, maxLength - 3) + '...';
}

// Rename generic names to something descriptive based on source_path or description
function fixGenericName(item) {
  const genericNames = ['skill', 'agent', 'readme', 'index', 'main'];
  const name = (item.name || '').toLowerCase().trim();

  if (!genericNames.includes(name)) return item.name;

  // Try to derive from source_path
  const srcPath = item.source_path || '';
  const parts = srcPath.replace(/\\/g, '/').split('/').filter(Boolean);

  // Walk backwards to find a meaningful directory name
  for (let i = parts.length - 2; i >= 0; i--) {
    const part = parts[i].toLowerCase();
    if (!['skills', 'agents', 'plugins', '.agents', 'components', 'cli-tool'].includes(part)) {
      // Build name from parent directories for context
      const parentParts = [];
      for (let j = Math.max(0, i - 1); j <= i; j++) {
        const p = parts[j].toLowerCase();
        if (!['skills', 'agents', 'plugins', '.agents', 'components', 'cli-tool'].includes(p)) {
          parentParts.push(p);
        }
      }
      const derived = parentParts.join('-').replace(/[^a-z0-9-]/g, '');
      if (derived.length > 2) {
        console.log(`  Renamed generic "${item.name}" → "${derived}" (from path: ${srcPath})`);
        return derived;
      }
    }
  }

  // Fallback: derive from first few words of description
  if (item.description) {
    const words = item.description.toLowerCase().split(/\s+/).slice(0, 3)
      .map(w => w.replace(/[^a-z0-9]/g, '')).filter(w => w.length > 2);
    if (words.length >= 2) {
      const derived = words.join('-');
      console.log(`  Renamed generic "${item.name}" → "${derived}" (from description)`);
      return derived;
    }
  }

  return item.name;
}

// Main execution
console.log('Starting bulk import of pending skillpository items...\n');

// 1. Read all YAML files from PENDING
const files = readdirSync(PENDING_DIR).filter(f =>
  f.endsWith('.yaml') && f !== '.last-scan.yaml'
);

console.log(`Found ${files.length} YAML files in PENDING directory`);

// 2. Parse each file
const pendingItems = [];
for (const file of files) {
  try {
    const content = readFileSync(join(PENDING_DIR, file), 'utf8');
    const item = parseSimpleYAML(content);

    if (item.name && item.type) {
      pendingItems.push(item);
    }
  } catch (err) {
    console.error(`Error parsing ${file}:`, err.message);
  }
}

console.log(`Parsed ${pendingItems.length} items from PENDING\n`);

// 3. Read existing index.yaml
let indexContent = readFileSync(INDEX_PATH, 'utf8');
const hasBOM = indexContent.charCodeAt(0) === 0xFEFF;
if (hasBOM) {
  indexContent = indexContent.substring(1);
}

// Extract existing names
const existingNames = new Set();
const nameRegex = /^\s*-\s+name:\s+(.+)$/gm;
let match;
while ((match = nameRegex.exec(indexContent)) !== null) {
  existingNames.add(match[1].trim());
}

console.log(`Found ${existingNames.size} existing entries in index.yaml`);

// 4. Filter new items and categorize
const newSkills = [];
const newAgents = [];
const skipped = [];
const categoryStats = {};

for (const item of pendingItems) {
  // Fix generic names like "SKILL", "readme", etc.
  item.name = fixGenericName(item);

  if (existingNames.has(item.name)) {
    skipped.push(item.name);
    continue;
  }

  const category = categorizeItem(item.name, item.description || '', item.type);
  const description = truncateDescription(item.description || 'No description available');

  const entry = {
    name: item.name,
    type: item.type,
    category: category,
    description: description,
    source: `PENDING/${item.name}`
  };

  if (item.type === 'agent') {
    entry.model = 'sonnet';
    newAgents.push(entry);
  } else {
    newSkills.push(entry);
  }

  categoryStats[category] = (categoryStats[category] || 0) + 1;
}

console.log(`New items to import: ${newSkills.length} skills, ${newAgents.length} agents`);
console.log(`Skipped (already in index): ${skipped.length}\n`);

if (newSkills.length === 0 && newAgents.length === 0) {
  console.log('Nothing to import. Exiting.');
  process.exit(0);
}

// 5. Generate YAML entries
const date = new Date().toISOString().split('T')[0];

function generateYAMLEntry(item) {
  const lines = [
    `  - name: ${item.name}`,
    `    type: ${item.type}`,
    `    category: ${item.category}`,
  ];

  if (item.model) {
    lines.push(`    model: ${item.model}`);
  }

  lines.push(`    description: "${item.description}"`);
  lines.push(`    source: ${item.source}`);

  return lines.join('\n');
}

// 6. Find insertion points and insert new entries
let updatedContent = indexContent;

// Insert skills before "# --- godmodedev-new"
if (newSkills.length > 0) {
  const skillsSection = `  # --- pending-imports (${newSkills.length}) --- Imported ${date}\n` +
    newSkills.map(generateYAMLEntry).join('\n\n') + '\n\n';

  const skillMarker = '  # --- godmodedev-new';
  const skillMarkerIndex = updatedContent.indexOf(skillMarker);

  if (skillMarkerIndex !== -1) {
    updatedContent = updatedContent.substring(0, skillMarkerIndex) +
      skillsSection +
      updatedContent.substring(skillMarkerIndex);
  } else {
    console.warn('Warning: Could not find "# --- godmodedev-new" marker for skills');
  }
}

// Append agents at the end
if (newAgents.length > 0) {
  const agentsSection = `\n  # --- pending-imports (${newAgents.length}) --- Imported ${date}\n` +
    newAgents.map(generateYAMLEntry).join('\n\n') + '\n';

  updatedContent = updatedContent.trimEnd() + agentsSection;
}

// 7. Update total counts in header
const currentSkillsMatch = updatedContent.match(/^total_skills:\s+(\d+)/m);
const currentAgentsMatch = updatedContent.match(/^total_agents:\s+(\d+)/m);

if (currentSkillsMatch) {
  const newTotal = parseInt(currentSkillsMatch[1]) + newSkills.length;
  updatedContent = updatedContent.replace(
    /^total_skills:\s+\d+/m,
    `total_skills: ${newTotal}`
  );
}

if (currentAgentsMatch) {
  const newTotal = parseInt(currentAgentsMatch[1]) + newAgents.length;
  updatedContent = updatedContent.replace(
    /^total_agents:\s+\d+/m,
    `total_agents: ${newTotal}`
  );
}

// 8. Write back with BOM if needed
const finalContent = (hasBOM ? '\ufeff' : '') + updatedContent;
writeFileSync(INDEX_PATH, finalContent, 'utf8');

// 9. Print summary
console.log('✓ Import complete!\n');
console.log(`Imported: ${newSkills.length} skills, ${newAgents.length} agents\n`);

if (Object.keys(categoryStats).length > 0) {
  console.log('Categories assigned:');
  const sortedCategories = Object.entries(categoryStats)
    .sort((a, b) => b[1] - a[1]);

  for (const [category, count] of sortedCategories) {
    console.log(`  - ${category}: ${count}`);
  }
  console.log();
}

if (skipped.length > 0) {
  console.log(`Skipped (already in index): ${skipped.length}`);
  if (skipped.length <= 10) {
    skipped.forEach(name => console.log(`  - ${name}`));
  }
}
