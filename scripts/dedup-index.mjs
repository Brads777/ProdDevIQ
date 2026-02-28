#!/usr/bin/env node
// ©2026 Brad Scheller
// Deduplicates skillpository index.yaml by clustering similar entries

import fs from 'fs';
import path from 'path';

const INDEX_PATH = 'E:/GODMODEDEV/skillpository/index.yaml';

const CLUSTERS = {
  // SKILLS
  'testing-master': {
    keep: 'testing-patterns',
    patterns: ['playwright', 'tdd', 'test-driven', 'testing-patterns', 'testing-anti', 'testing-skills', 'e2e-testing', 'test-fixing', 'qa-test', 'javascript-testing', 'python-testing', 'bats-testing'],
    type: 'skill'
  },
  'database-master': {
    keep: 'databases',
    patterns: ['database-design', 'database-migration', 'database-schema', 'databases', 'postgres-best', 'postgres-schema', 'postgresql', 'postgresql-table', 'neon-postgres', 'neon-instagres', 'nosql-expert', 'supabase-postgres', 'sql-optimization'],
    exclude: ['sql-injection', 'sqlmap'],
    type: 'skill'
  },
  'security-master': {
    keep: 'security-best-practices',
    patterns: ['security-audit', 'security-best', 'security-compliance', 'security-ownership', 'security-requirement', 'security-threat', 'cc-skill-security', 'information-security', 'v3-security', 'api-security', 'k8s-security'],
    type: 'skill'
  },
  'api-master': {
    keep: 'api-design-principles',
    patterns: ['api-design', 'api-patterns', 'openapi-spec', 'openapi-to-typescript', 'api-documentation', 'api-integration', 'api-fuzzing', 'api-security-best'],
    exclude: ['moodle'],
    type: 'skill'
  },
  'python-master': {
    keep: 'python-patterns',
    patterns: ['python-anti', 'python-background', 'python-code-style', 'python-design', 'python-error', 'python-patterns', 'python-project', 'python-resource', 'python-type-safety', 'async-python', 'python-performance'],
    type: 'skill'
  },
  'prompt-master': {
    keep: 'prompt-engineering',
    patterns: ['prompt-engineering', 'prompt-improver', 'prompt-library', 'prompt-caching', 'senior-prompt'],
    type: 'skill'
  },
  'performance-master': {
    keep: 'performance-analysis',
    patterns: ['performance-analysis', 'performance-profiling', 'python-performance', 'web-performance', 'v3-performance'],
    type: 'skill'
  },
  'agentdb-master': {
    keep: 'agentdb-advanced',
    patterns: ['agentdb-', 'AgentDB', 'reasoningbank-agentdb'],
    type: 'skill'
  },
  'react-master': {
    keep: 'react-best-practices',
    patterns: ['react-best', 'react-dev', 'react-native-arch', 'react-native-design', 'react-patterns', 'react-state', 'react-ui-patterns', 'react-useeffect'],
    exclude: ['vercel-react'],
    type: 'skill'
  },
  'ml-master': {
    keep: 'ml-pipeline-workflow',
    patterns: ['ml-pipeline', 'ml-paper', 'mlops-mlflow', 'mlops-tensorboard', 'mlops-weights'],
    exclude: ['html-injection', 'xss'],
    type: 'skill'
  },
  'backend-master': {
    keep: 'backend-development',
    patterns: ['backend-development', 'backend-dev-guidelines', 'cc-skill-backend', 'nodejs-backend', 'dotnet-backend', 'backend-to-frontend', 'frontend-to-backend'],
    type: 'skill'
  },
  'documentation-master': {
    keep: 'technical-documentation',
    patterns: ['documentation-templates', 'technical-documentation', 'quality-documentation', 'notion-research-documentation'],
    exclude: ['api-documentation', 'claude-docs', 'docs-seeker'],
    type: 'skill'
  },
  'pdf-master': {
    keep: 'pdf-anthropic',
    patterns: ['^pdf$', 'pdf-anthropic', 'pdf-official', 'pdf-processing', 'pdf-processing-pro'],
    exclude: ['data-export-pdf'],
    type: 'skill'
  },
  'ui-design-master': {
    keep: 'ui-ux-pro-max',
    patterns: ['ui-design-review', 'ui-design-system', 'ui-styling', 'ui-ux-pro', 'design-system-patterns', 'design-system-starter', 'tailwind-design'],
    exclude: ['react-ui'],
    type: 'skill'
  },
  'rag-master': {
    keep: 'rag-implementation',
    patterns: ['rag-chroma', 'rag-faiss', 'rag-pinecone', 'rag-qdrant', 'rag-implementation', 'rag-engineer', 'rag-sentence'],
    type: 'skill'
  },
  'github-master': {
    keep: 'github-automation',
    patterns: ['github-multi-repo', 'github-project-management', 'github-release', 'github-automation', 'github-actions-templates'],
    type: 'skill'
  },
  'frontend-master': {
    keep: 'frontend-development',
    patterns: ['frontend-development', 'frontend-dev-guidelines', 'frontend-design', 'cc-skill-frontend'],
    exclude: ['vercel-'],
    type: 'skill'
  },
  'code-review-master': {
    keep: 'code-review-excellence',
    patterns: ['code-review$', 'code-review-excellence', 'code-review-checklist', 'receiving-code', 'requesting-code'],
    type: 'skill'
  },
  'mobile-master': {
    keep: 'mobile-design',
    patterns: ['mobile-design', 'mobile-android', 'mobile-ios', 'mobile-games'],
    type: 'skill'
  },
  'game-master': {
    keep: 'game-development',
    patterns: ['game-development', 'game-design', 'game-art', 'game-audio', 'game-changing'],
    type: 'skill'
  },
  'seo-master': {
    keep: 'seo-fundamentals',
    patterns: ['seo-audit', 'seo-fundamentals', 'seo-optimizer'],
    type: 'skill'
  },
  // AGENTS
  'agent-performance': {
    keep: 'agent-performance-optimizer',
    patterns: ['agent-performance-analyzer', 'agent-performance-benchmarker', 'agent-performance-monitor', 'agent-performance-optimizer', 'agent-v3-performance'],
    type: 'agent'
  },
  'agent-coordinator': {
    keep: 'agent-hierarchical-coordinator',
    patterns: ['agent-coordinator-swarm', 'agent-consensus-coordinator', 'agent-hierarchical-coordinator', 'agent-mesh-coordinator', 'agent-queen-coordinator', 'agent-quorum-manager', 'agent-raft-manager', 'agent-v3-queen'],
    type: 'agent'
  },
};

// Parse entry name from a line like "  - name: something"
function parseEntryName(line) {
  const match = line.match(/^\s*-\s*name:\s*(.+)$/);
  return match ? match[1].trim() : null;
}

// Check if name matches a pattern
function matchesPattern(name, pattern) {
  if (pattern.startsWith('^')) {
    const regex = new RegExp(pattern);
    return regex.test(name);
  }
  return name.includes(pattern);
}

// Check if name should be excluded
function shouldExclude(name, excludePatterns) {
  if (!excludePatterns) return false;
  return excludePatterns.some(pattern => matchesPattern(name, pattern));
}

// Parse entry block to extract source path and description
function parseEntryBlock(lines, startIndex) {
  let source = null;
  let description = '';

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];

    // Stop at next entry
    if (i > startIndex && line.match(/^\s*-\s*name:/)) break;
    if (line.match(/^\s*#\s*---/)) break;

    // Extract source
    const sourceMatch = line.match(/^\s*source:\s*["']?(.+?)["']?$/);
    if (sourceMatch) {
      source = sourceMatch[1].trim();
    }

    // Extract description
    const descMatch = line.match(/^\s*description:\s*["']?(.+?)["']?$/);
    if (descMatch) {
      description = descMatch[1].trim();
    }
  }

  return { source, description };
}

// Check if source is from IDETOOLS
function isIdetoolsSource(source) {
  return source && source.startsWith('IDETOOLS/');
}

// Main deduplication logic
function deduplicateIndex() {
  console.log('Reading index.yaml...');
  const content = fs.readFileSync(INDEX_PATH, 'utf8');
  const lines = content.split('\n');

  // Track all entries by name with their metadata
  const allEntries = new Map();
  let currentSection = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track section (skills or agents)
    if (line.includes('# SKILLS')) currentSection = 'skill';
    if (line.includes('# AGENTS')) currentSection = 'agent';

    const name = parseEntryName(line);
    if (name) {
      const { source, description } = parseEntryBlock(lines, i);
      allEntries.set(name, {
        name,
        lineIndex: i,
        type: currentSection,
        source,
        description
      });
    }
  }

  console.log(`Found ${allEntries.size} total entries\n`);

  // Process each cluster
  const toRemove = new Set();
  const clusterResults = {};

  for (const [clusterName, cluster] of Object.entries(CLUSTERS)) {
    const matches = [];

    // Find all entries matching this cluster
    for (const [entryName, entry] of allEntries) {
      if (entry.type !== cluster.type) continue;

      // Check if matches any pattern
      const matchesAnyPattern = cluster.patterns.some(pattern =>
        matchesPattern(entryName, pattern)
      );

      if (!matchesAnyPattern) continue;

      // Check exclusions
      if (shouldExclude(entryName, cluster.exclude)) continue;

      matches.push(entry);
    }

    if (matches.length === 0) {
      clusterResults[clusterName] = { kept: null, removed: [], count: 0 };
      continue;
    }

    // Find the keeper
    const keeper = matches.find(e => e.name === cluster.keep);

    if (!keeper) {
      // Keeper not found, try to find best IDETOOLS entry
      const idetoolsEntries = matches.filter(e => isIdetoolsSource(e.source));
      if (idetoolsEntries.length > 0) {
        // Pick the one with longest description
        const bestEntry = idetoolsEntries.reduce((best, current) =>
          (current.description?.length || 0) > (best.description?.length || 0) ? current : best
        );

        clusterResults[clusterName] = {
          kept: bestEntry.name,
          removed: matches.filter(e => e.name !== bestEntry.name).map(e => e.name),
          count: matches.length
        };

        matches.filter(e => e.name !== bestEntry.name).forEach(e => toRemove.add(e.name));
      } else {
        // No IDETOOLS entries, just log and skip
        console.log(`⚠️  ${clusterName}: keeper '${cluster.keep}' not found, no IDETOOLS alternatives`);
        clusterResults[clusterName] = { kept: null, removed: [], count: matches.length };
      }
    } else {
      // Remove all except keeper
      const removed = matches.filter(e => e.name !== keeper.name);

      clusterResults[clusterName] = {
        kept: keeper.name,
        removed: removed.map(e => e.name),
        count: matches.length
      };

      removed.forEach(e => toRemove.add(e.name));
    }
  }

  // Remove entries by rebuilding the file
  console.log('Removing duplicate entries...\n');
  const newLines = [];
  let i = 0;
  let inRemovalBlock = false;
  let removalBlockStart = -1;

  while (i < lines.length) {
    const line = lines[i];
    const name = parseEntryName(line);

    if (name && toRemove.has(name)) {
      // Start of removal block
      inRemovalBlock = true;
      removalBlockStart = i;
      i++;
      continue;
    }

    if (inRemovalBlock) {
      // Check if we've hit the next entry or section
      if (line.match(/^\s*-\s*name:/) || line.match(/^\s*#\s*---/)) {
        // End of removal block
        inRemovalBlock = false;
        // Don't skip this line, process it normally
        newLines.push(line);
        i++;
        continue;
      }
      // Skip this line (part of removed entry)
      i++;
      continue;
    }

    newLines.push(line);
    i++;
  }

  // Count entries in new content
  let newSkillCount = 0;
  let newAgentCount = 0;
  let inSkills = false;
  let inAgents = false;

  for (const line of newLines) {
    if (line.includes('# SKILLS')) inSkills = true;
    if (line.includes('# AGENTS')) { inSkills = false; inAgents = true; }

    if (parseEntryName(line)) {
      if (inSkills) newSkillCount++;
      if (inAgents) newAgentCount++;
    }
  }

  // Update counts in header
  const finalLines = newLines.map(line => {
    if (line.match(/^total_skills:/)) {
      return `total_skills: ${newSkillCount}`;
    }
    if (line.match(/^total_agents:/)) {
      return `total_agents: ${newAgentCount}`;
    }
    return line;
  });

  // Print summary
  console.log('='.repeat(70));
  console.log('DEDUPLICATION SUMMARY');
  console.log('='.repeat(70));

  for (const [clusterName, result] of Object.entries(clusterResults)) {
    if (result.count === 0) continue;

    console.log(`\n${clusterName}:`);
    console.log(`  Total matched: ${result.count}`);
    console.log(`  Kept: ${result.kept || 'NONE'}`);
    console.log(`  Removed: ${result.removed.length}`);
    if (result.removed.length > 0) {
      result.removed.forEach(name => console.log(`    - ${name}`));
    }
  }

  const originalSkillCount = [...allEntries.values()].filter(e => e.type === 'skill').length;
  const originalAgentCount = [...allEntries.values()].filter(e => e.type === 'agent').length;

  console.log('\n' + '='.repeat(70));
  console.log('FINAL COUNTS');
  console.log('='.repeat(70));
  console.log(`Skills:  ${originalSkillCount} → ${newSkillCount} (removed ${originalSkillCount - newSkillCount})`);
  console.log(`Agents:  ${originalAgentCount} → ${newAgentCount} (removed ${originalAgentCount - newAgentCount})`);
  console.log(`Total:   ${allEntries.size} → ${newSkillCount + newAgentCount} (removed ${toRemove.size})`);
  console.log('='.repeat(70));

  // Write back to file
  console.log('\nWriting cleaned index.yaml...');
  fs.writeFileSync(INDEX_PATH, finalLines.join('\n'), 'utf8');
  console.log('✓ Done!');
}

// Run
try {
  deduplicateIndex();
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
