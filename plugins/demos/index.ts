import { readDemoConfigs } from './read'
import { debounce, isSubPath } from './utils'
import { readdirSync, readFileSync } from 'node:fs'
import { basename, isAbsolute, join, relative } from 'node:path'
import { PluginOption, ResolvedConfig, ViteDevServer, normalizePath } from 'vite'
import { generateDefaultDemosModuleContent, generateDemosModuleContent } from './virtual_module'
import { DEMO_DIR_CONFIG_FILE_NAME, RESOLVED_VIRTUAL_MODULE_ID, VIRTUAL_MODULE_ID } from './config'
import type { DemoConfigWithPlugin } from 'virtual:demos'

export const demos = (): PluginOption => {
  let _resolvedConfig: ResolvedConfig
  let _server: ViteDevServer

  /**
   * demos 目录
   */
  let demosDir: string
  /**
   * 所有的 demo 配置
   */
  let demoConfigs: DemoConfigWithPlugin[] = []
  /**
   * demos 虚拟模块内容
   */
  let demosModuleContent = generateDefaultDemosModuleContent()
  /**
   * ViteDevServer WebSocket 是否连接
   */
  let wsConnected = false

  const updateDemosModule = (first = false) => {
    demoConfigs = readDemoConfigs(
      demosDir,
      _resolvedConfig.root,
      _resolvedConfig.command === 'build',
    )

    if (_resolvedConfig.command === 'build') {
      Reflect.defineProperty(_resolvedConfig, 'demoConfigs', {
        value: demoConfigs,
        writable: false,
        enumerable: true,
        configurable: false,
      })
    }

    const mewDemosModuleContent = generateDemosModuleContent({ configs: demoConfigs })

    if (mewDemosModuleContent !== demosModuleContent) {
      demosModuleContent = mewDemosModuleContent

      if (!first && _server) {
        // 重新加载虚拟模块
        _server.watcher.emit('change', RESOLVED_VIRTUAL_MODULE_ID)
        _server.watcher.emit('all', 'change', RESOLVED_VIRTUAL_MODULE_ID)
      }
    }
  }

  const debounceUpdateDemosModule = debounce(updateDemosModule, 100)

  return {
    name: 'demos-plugin',
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID
      }
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        return demosModuleContent
      }
    },
    configResolved(config) {
      _resolvedConfig = config
      demosDir = join(config.root, 'demos')
    },
    configureServer(server) {
      _server = server

      server.middlewares.use((req, res, next) => {
        // console.log('URL:', req.url)
        if (req.method !== 'GET' || !req.url?.startsWith('/demos')) return next()
        const filePath = join(_resolvedConfig.root, req.url)
        if (
          demoConfigs.some((config) => config.type === 'html' && isSubPath(config.dir, filePath))
        ) {
          // 手动读取文件返回
          // vite 返回的 html 会可能会包含 vueDevTools，从而导致页面上出现两个 vueDevTools
          const file = readFileSync(filePath)
          res.end(file)
        } else {
          next()
        }
      })

      // 监听 demos 目录下的文件变化
      server.watcher.add(demosDir).on('all', (event, path) => {
        if (isAbsolute(path) && isSubPath(demosDir, path)) {
          if (event !== 'change' || path.endsWith(DEMO_DIR_CONFIG_FILE_NAME)) {
            // 如果是 demos 目录下的文件变更，更新 demos 模块内容
            debounceUpdateDemosModule()
          }
          if (wsConnected) {
            const demoConfig = demoConfigs.find(
              (config) => config.type === 'html' && isSubPath(config.dir, path),
            )
            // html demo 文件变更，发送更新消息给客户端
            if (demoConfig) {
              server.ws.send('demos:html-demo-changed', { id: demoConfig.id })
            }
          }
        }
      })

      server.ws.on('connection', () => {
        wsConnected = true
      })
    },
    buildStart() {
      updateDemosModule(true)
    },
  }
}

export const demosBuild = (): PluginOption => {
  let _resolvedConfig: ResolvedConfig

  return {
    name: 'demos-build-plugin',
    apply: 'build',
    enforce: 'post',
    configResolved(config) {
      _resolvedConfig = config
    },
    buildEnd() {
      const demoConfigs = Reflect.get(_resolvedConfig, 'demoConfigs') as DemoConfigWithPlugin[]

      const dfs = (dir: string, dirName: string, baseDir: string) => {
        const entries = readdirSync(dir, { withFileTypes: true })

        for (const entry of entries) {
          // 跳过配置文件
          if (entry.name === DEMO_DIR_CONFIG_FILE_NAME) continue

          const fullPath = join(dir, entry.name)
          const relativePath = join(dirName, relative(baseDir, fullPath))

          if (entry.isDirectory()) {
            dfs(fullPath, dirName, baseDir)
          } else {
            // 读取并发出文件内容并让 Vite 处理
            const fileContent = readFileSync(fullPath)
            this.emitFile({
              type: 'asset',
              fileName: normalizePath(relativePath),
              source: fileContent,
            })
          }
        }
      }

      for (const demoConfig of demoConfigs) {
        // 仅处理 html 类型的 demo 目录
        if (demoConfig.type !== 'html') continue
        // 递归处理目录下的所有文件
        const dirName = basename(demoConfig.dir)
        dfs(demoConfig.dir, dirName, demoConfig.dir)
      }
    },
  }
}

export default demos
