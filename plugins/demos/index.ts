import { debounce, isSubPath } from './utils'
import { readDemoConfigs } from './read'
import { basename, isAbsolute, join, relative } from 'node:path'
import { PluginOption, ResolvedConfig, ViteDevServer, normalizePath } from 'vite'
import { generateDefaultDemosModuleContent, generateDemosModuleContent } from './virtual_module'
import type { DemoConfigWithPlugin } from 'virtual:demos'
import { readdirSync, readFileSync } from 'node:fs'
import { DEMO_DIR_CONFIG_FILE_NAME } from './config'

export const demos = (): PluginOption => {
  const virtualModuleId = 'virtual:demos'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

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
        _server.watcher.emit('change', resolvedVirtualModuleId)
        _server.watcher.emit('all', 'change', resolvedVirtualModuleId)
      }
    }
  }

  const debounceUpdateDemosModule = debounce(updateDemosModule, 100)

  return {
    name: 'demos-plugin',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
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
        if (
          req.url?.startsWith('/demos') &&
          req.method === 'GET' &&
          demoConfigs.some(
            (config) =>
              config.type === 'html' && isSubPath(config.dir, join(_resolvedConfig.root, req.url!)),
          )
        ) {
        }
        next()
      })

      server.watcher.add(demosDir).on('all', (event, path) => {
        if (isAbsolute(path) && isSubPath(demosDir, path)) {
          // 如果是 demos 目录下的文件变更，更新 demos 模块内容
          debounceUpdateDemosModule()
        }
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
            // 读取文件内容并让 Vite 处理
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
        if (demoConfig.type !== 'html') continue
        // 递归处理目录下的所有文件
        const dirName = basename(demoConfig.dir)
        dfs(demoConfig.dir, dirName, demoConfig.dir)
      }
    },
  }
}

export default demos
