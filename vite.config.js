/* eslint-disable no-plusplus */
import react from '@vitejs/plugin-react'
import detectPort from 'detect-port'
import fs from 'node:fs'
import path from 'path'
import { defineConfig, normalizePath } from 'vite'
// import { viteStaticCopy } from "vite-plugin-static-copy";

let chunkCount = 0

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'

  return {
    root: 'frontend/src',
    base: isDev ? '/' : '',
    assetsDir: 'assets',
    plugins: [
      react(),
      copyStatics(mode),
      setDevelopmentServerConfig()
    ],
    build: {
      outDir: '../../assets',
      emptyOutDir: true,

      // emit manifest so PHP can find the hashed files
      manifest: true,

      target: 'es2015',
      // minify: 'terser',

      // sourcemap: true,
      rollupOptions: {
        input: path.resolve(__dirname, 'frontend/src/main.jsx'),
        output: {
          entryFileNames: `main.${getVersion()}.js`,
          compact: true,
          validate: true,
          generatedCode: {
            arrowFunctions: true
            // objectShorthand: true
          },
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'react-router-dom': ['react-router-dom']
          },
          chunkFileNames: () => `[name].[hash].js`,
          assetFileNames: fInfo => {
            const pathArr = fInfo.name.split('/')
            const fileName = pathArr[pathArr.length - 1]

            // if (fileName === 'main.css') {
            //   return `main-${newBuildHash}.css`
            // }
            if (fileName === 'logo.svg') {
              return 'logo.svg'
            }

            const fileExt = fileName.split('.').pop()

            if (
              fileExt === 'webp' ||
              fileExt === 'svg' ||
              fileExt === 'jpg' ||
              fileExt === 'jpeg' ||
              fileExt === 'png' ||
              fileExt === 'ttf' ||
              fileExt === 'woff' ||
              fileExt === 'eot' ||
              fileExt === 'gif'
            ) {
              return fileName
            }

            // if (fileExt === 'css') {
            //   return `${fileName}.[hash].[ext]`
            // }

            return `[name].[hash].[ext]`
          }
        }
      },
      commonjsOptions: { transformMixedEsModules: true }
    },
    server: {
      watch: {
        ignored: ['**/.git/**', '**/node_modules/**', '**/.port/**'],
        usePolling: true,
        interval: 100,
        include: ['**/*.js', '**/*.jsx', '**/*.css', '**/*.scss']
      },
      cors: true,
      strictPort: true,
      port: 3000,
      hmr: {
        // host: 'localhost',
        overlay: true
      },
      commonjsOptions: { transformMixedEsModules: true }
    }
  }
})

function copyStatics(mode) {
  const staticDir = path.resolve(__dirname, 'frontend/static')
  const assetsDir = path.resolve(__dirname, 'assets')

  return {
    name: 'copy-static-files',
    closeBundle() {
      if (!fs.existsSync(staticDir)) return

      if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true })
      }

      fs.readdirSync(staticDir).forEach(file => {
        fs.copyFileSync(path.join(staticDir, file), path.join(assetsDir, file))
      })
    }
  }
}

function getVersion() {
  let version = '1.0.0'
  if (fs.existsSync('readme.txt')) {
    const readme = fs.readFileSync('readme.txt').toString()
    const regex = /Stable\s+tag:\s+(\d+\.\d+(\.?\d+)*)/
    const match = readme.match(regex)
    version = match ? match[1] : '1.0.0'
  }
  return version
}

function setDevelopmentServerConfig() {
  return {
    async config(_, environment) {
      if (environment?.mode === 'development') {
        let port = getStoredPort()
        if (!port) {
          port = await detectPort(3000).then(detectedPort => detectedPort)
          updateStoredPort(port)
        }
        return { server: { origin: `http://localhost:${port}`, port } }
      }
      removeStoredPort()
    },
    configureServer(server) {
      if (server.httpServer) {
        server.httpServer.once('listening', () => {
          const { port } = server.httpServer?.address()
          const storedPort = getStoredPort()
          if (port !== storedPort) {
            updateStoredPort(port)
          }
        })

        // server.watcher.add(['.port'])
        // server.watcher.on('change', file => {
        //   if (file === '.port') {
        //     server.config.logger.warnOnce('Server restarting for origin mismatch', { timestamp: true })
        //     server.restart()
        //   }
        // })

        server.httpServer.close(() => {
          removeStoredPort()
        })
      }
    },
    name: 'vite-plugin-set-dev-server-config'
  }
}

const portFile = path.resolve(import.meta.dirname, './.port')

function getStoredPort() {
  let port = 0
  if (fs.existsSync(portFile)) {
    port = Number(fs.readFileSync(portFile))
  }

  return port
}

function updateStoredPort(port) {
  fs.writeFileSync(portFile, String(port))
}

function removeStoredPort() {
  if (fs.existsSync(portFile)) {
    fs.rmSync(portFile)
  }
}
