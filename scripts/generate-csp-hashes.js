#!/usr/bin/env node

/**
 * CSP Hash Generator for Static Sites
 *
 * This script scans built HTML files for inline scripts and styles,
 * computes their SHA-256 hashes, and generates a Content Security Policy
 * header file with those hashes instead of 'unsafe-inline'.
 *
 * This allows removal of 'unsafe-inline' from CSP while maintaining
 * site functionality on static hosts like GitHub Pages.
 *
 * Usage: node scripts/generate-csp-hashes.js
 * Should be run after `astro build` completes.
 */

/* eslint-disable no-console */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const DIST_DIR = join(__dirname, '..', 'dist');
const HEADERS_TEMPLATE = join(__dirname, '..', 'public', '_headers');
const OUTPUT_HEADERS = join(DIST_DIR, '_headers');
const USE_STRICT_CSP = process.env.GITHUB_PAGES === 'true';

console.log('🔒 Generating CSP hashes for inline scripts and styles...');
console.log(`📁 Scanning directory: ${DIST_DIR}`);
console.log(`🏗️  GitHub Pages mode: ${USE_STRICT_CSP ? 'YES (strict CSP)' : 'NO (dev mode)'}`);

/**
 * Recursively find all HTML files in a directory
 */
function findHtmlFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      findHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Extract inline script and style content from HTML
 */
function extractInlineContent(html) {
  const scripts = [];
  const styles = [];

  // Match <script> tags without src attribute (inline scripts)
  const scriptRegex = /<script(?![^>]*\bsrc\b)[^>]*>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = scriptRegex.exec(html)) !== null) {
    const content = match[1].trim();
    if (content) {
      scripts.push(content);
    }
  }

  // Match <style> tags (inline styles)
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;

  while ((match = styleRegex.exec(html)) !== null) {
    const content = match[1].trim();
    if (content) {
      styles.push(content);
    }
  }

  return { scripts, styles };
}

/**
 * Compute SHA-256 hash for content and format as CSP hash
 */
function computeHash(content) {
  const hash = createHash('sha256').update(content, 'utf8').digest('base64');
  return `'sha256-${hash}'`;
}

/**
 * Scan all HTML files and collect unique hashes
 */
function collectHashes() {
  const htmlFiles = findHtmlFiles(DIST_DIR);
  const scriptHashes = new Set();
  const styleHashes = new Set();

  console.log(`📄 Found ${htmlFiles.length} HTML files`);

  let inlineScriptCount = 0;
  let inlineStyleCount = 0;

  htmlFiles.forEach((filePath) => {
    const html = readFileSync(filePath, 'utf8');
    const { scripts, styles } = extractInlineContent(html);

    scripts.forEach((script) => {
      scriptHashes.add(computeHash(script));
      inlineScriptCount++;
    });

    styles.forEach((style) => {
      styleHashes.add(computeHash(style));
      inlineStyleCount++;
    });

    const relativePath = relative(DIST_DIR, filePath);
    if (scripts.length > 0 || styles.length > 0) {
      console.log(`  ✓ ${relativePath}: ${scripts.length} scripts, ${styles.length} styles`);
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`  - Total inline scripts: ${inlineScriptCount}`);
  console.log(`  - Total inline styles: ${inlineStyleCount}`);
  console.log(`  - Unique script hashes: ${scriptHashes.size}`);
  console.log(`  - Unique style hashes: ${styleHashes.size}`);

  return {
    scriptHashes: Array.from(scriptHashes),
    styleHashes: Array.from(styleHashes),
  };
}

/**
 * Generate CSP header with computed hashes
 */
function generateCSPHeader(scriptHashes, styleHashes) {
  if (!USE_STRICT_CSP) {
    // Development mode: keep unsafe-inline for easier development
    console.log('\n⚠️  Development mode: keeping unsafe-inline for local development');
    return null; // Use template as-is
  }

  // Build script-src directive
  const scriptSrc = ["'self'", ...scriptHashes];

  // Add 'strict-dynamic' if there are hashed scripts
  // This allows hashed scripts to load additional scripts dynamically
  if (scriptHashes.length > 0) {
    scriptSrc.push("'strict-dynamic'");
  }

  // Build style-src directive
  const styleSrc = ["'self'", ...styleHashes, 'https://fonts.googleapis.com'];

  // Construct full CSP
  return [
    `default-src 'self'`,
    `script-src ${scriptSrc.join(' ')}`,
    `style-src ${styleSrc.join(' ')}`,
    `font-src 'self' https://fonts.gstatic.com`,
    `img-src 'self' data: https:`,
    `connect-src 'self' https://sentry.io`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
  ].join('; ');
}

/**
 * Generate the _headers file
 */
function generateHeadersFile(csp) {
  // Read template
  const template = readFileSync(HEADERS_TEMPLATE, 'utf8');

  if (!csp) {
    // Use template as-is for development
    writeFileSync(OUTPUT_HEADERS, template);
    console.log(`\n✅ Copied template headers to ${OUTPUT_HEADERS}`);
    return;
  }

  // Replace the CSP line with our computed CSP
  const lines = template.split('\n');
  const newLines = lines.map((line) => {
    if (line.trim().startsWith('Content-Security-Policy:')) {
      return `  Content-Security-Policy: ${csp}`;
    }
    return line;
  });

  const output = newLines.join('\n');
  writeFileSync(OUTPUT_HEADERS, output);

  console.log(`\n✅ Generated ${OUTPUT_HEADERS} with hash-based CSP`);
  console.log(`\n🔐 Content Security Policy:`);
  console.log(`   ${csp.substring(0, 100)}...`);
  console.log(`\n✨ CSP no longer uses 'unsafe-inline' - XSS protection enabled!`);
}

/**
 * Main execution
 */
try {
  const { scriptHashes, styleHashes } = collectHashes();
  const csp = generateCSPHeader(scriptHashes, styleHashes);
  generateHeadersFile(csp);

  console.log('\n🎉 CSP generation complete!\n');
} catch (error) {
  console.error('\n❌ Error generating CSP hashes:', error.message);
  console.error('   Falling back to template _headers file\n');

  // Copy template as fallback
  try {
    const template = readFileSync(HEADERS_TEMPLATE, 'utf8');
    writeFileSync(OUTPUT_HEADERS, template);
    console.log('✅ Copied fallback headers\n');
  } catch (fallbackError) {
    console.error('❌ Failed to copy fallback headers:', fallbackError.message);
    process.exit(1);
  }
}
