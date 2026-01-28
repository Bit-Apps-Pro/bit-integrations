#!/usr/bin/env node

/**
 * Production ZIP builder for Bit Integrations
 * Builds both bit-integrations (free) and bit-integrations-pro plugins
 * Uses the existing .github/build scripts and creates ZIP archives
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Configuration
const PLUGIN_DIR = path.resolve(__dirname, '../..')
const PLUGINS_DIR = path.join(PLUGIN_DIR, '..')
const BUILD_DIR_SLUG = 'bit-integrations'

const PLUGINS = [
  {
    name: 'bit-integrations',
    slug: 'bit-integrations',
    dir: PLUGIN_DIR
  },
  {
    name: 'bit-integrations-pro',
    slug: 'bit-integrations-pro',
    dir: path.join(PLUGINS_DIR, 'bit-integrations-pro')
  }
]

console.log('🚀 Starting production ZIP build for both plugins...\n')

// Build each plugin
PLUGINS.forEach((plugin, index) => {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`📦 Building ${plugin.name} (${index + 1}/${PLUGINS.length})`)
  console.log('='.repeat(60))

  const buildScript = path.join(plugin.dir, '.github', 'build')
  const pluginBuildDir = path.join(plugin.dir, 'build')
  const buildPluginDir = path.join(pluginBuildDir, plugin.slug)
  const centralBuildDir = path.join(PLUGIN_DIR, 'build')

  // Step 1: Check if plugin directory exists
  if (!fs.existsSync(plugin.dir)) {
    console.warn(`⚠️  Plugin directory not found: ${plugin.dir}`)
    console.warn(`   Skipping ${plugin.name}...\n`)
    return
  }

  // Step 2: Check if build script exists
  if (!fs.existsSync(buildScript)) {
    console.warn(`⚠️  Build script not found at: ${buildScript}`)
    console.warn(`   Skipping ${plugin.name}...\n`)
    return
  }

  // Step 3: Make build script executable
  console.log('🔧 Preparing build script...')
  try {
    execSync(`chmod +x "${buildScript}"`, { stdio: 'inherit' })
  } catch (error) {
    console.warn('⚠️  Could not make build script executable')
  }

  // Step 4: Run the existing build script
  console.log('🔨 Running build script...')
  try {
    execSync(`bash "${buildScript}"`, {
      cwd: plugin.dir,
      stdio: 'inherit',
      shell: '/bin/bash'
    })
  } catch (error) {
    console.error(`❌ Build script failed for ${plugin.name}`)
    process.exit(1)
  }

  // Step 5: Verify build directory exists
  if (!fs.existsSync(buildPluginDir)) {
    console.error(`❌ Build directory not found at: ${buildPluginDir}`)
    process.exit(1)
  }

  // Step 6: Create central build directory if it doesn't exist
  if (!fs.existsSync(centralBuildDir)) {
    fs.mkdirSync(centralBuildDir, { recursive: true })
  }

  // Step 7: Create ZIP file
  console.log('🗜️  Creating ZIP archive...')
  const zipFileName = `${plugin.slug}.zip`
  const zipFilePath = path.join(centralBuildDir, zipFileName)

  // Remove old ZIP if exists
  if (fs.existsSync(zipFilePath)) {
    fs.unlinkSync(zipFilePath)
  }

  try {
    execSync(`cd "${pluginBuildDir}" && zip -r "${zipFilePath}" "${plugin.slug}" -q`, {
      stdio: 'pipe',
      shell: '/bin/bash'
    })
  } catch (error) {
    console.error(`❌ ZIP creation failed for ${plugin.name}`)
    process.exit(1)
  }

  // Step 8: Success message for this plugin
  console.log(`\n✅ ${plugin.name} ZIP created successfully!`)
  console.log(`📦 Location: ${zipFilePath}`)

  // Get file size
  const stats = fs.statSync(zipFilePath)
  const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2)
  console.log(`📊 Size: ${fileSizeInMB} MB`)
})

// Final summary
console.log('\n' + '='.repeat(60))
console.log('✅ All production ZIPs created successfully!')
console.log('='.repeat(60) + '\n')
