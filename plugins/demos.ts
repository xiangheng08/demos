import { PluginOption, ResolvedConfig, ViteDevServer, normalizePath } from 'vite'
import { join, relative } from 'node:path'
import { existsSync, readdirSync, statSync, readFileSync } from 'node:fs'
import type {
  DemoConfig,
  DemoConfigAsHTML,
  DemoConfigAsComponentWithPlugin,
  DemoConfigAsComponent,
} from 'virtual:demos'

const demosPlugin = (): PluginOption => {
  const virtualModuleId = 'virtual:demos'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  /**
   * 所有的 demo 配置
   */
  const configs: DemoConfig[] = []

  let resolvedConfig: ResolvedConfig
  let _server: ViteDevServer

  let demosModuleContent = 'export const configs = []'

  const generateDemosModule = () => {
    const configsAsString =
      '[' +
      configs
        .map((config) => {
          if (config.type === 'html') {
            return JSON.stringify(config)
          } else {
            const { importFnText, ...rest } = config as unknown as DemoConfigAsComponentWithPlugin
            // 将 "XXX" 替换为函数体
            return JSON.stringify({ ...rest, importFn: 'XXX' }).replace(/"XXX"/, importFnText)
          }
        })
        .join(',') +
      ']'

    const mewDemosModuleContent = `export const configs = ${configsAsString}`

    if (mewDemosModuleContent !== demosModuleContent) {
      demosModuleContent = mewDemosModuleContent
      if (_server) {
        // 重新加载虚拟模块
        // _server.restart()
      }
    }
  }

  const readDemos = () => {
    // 清空之前的配置
    configs.splice(0)

    const rootPath = join(resolvedConfig.root, 'demos')
    if (!existsSync(rootPath)) return

    for (const file of readdirSync(rootPath)) {
      const demoDirPath = join(rootPath, file)
      if (!isDirectory(demoDirPath)) continue

      const htmlPath = join(demoDirPath, 'index.html')
      const componentPath = join(demoDirPath, 'index.vue')
      const demoConfigFilePath = join(demoDirPath, '.config.json')

      let demoConfig: DemoConfig

      if (existsSync(demoConfigFilePath) && isFile(demoConfigFilePath)) {
        demoConfig = JSON.parse(readFileSync(demoConfigFilePath, 'utf-8'))
      }

      if (isFile(htmlPath)) {
        const htmlDemoConfig: DemoConfigAsHTML = {
          ...demoConfig!,
          type: 'html',
          html: normalizePath(relative(rootPath, htmlPath)),
        }
        configs.push(htmlDemoConfig)
      } else if (isFile(componentPath)) {
        const componentDemoConfig: DemoConfigAsComponentWithPlugin = {
          ...demoConfig!,
          type: 'component',
          component: normalizePath(relative(rootPath, componentPath)),
          importFnText: `() => import('/${normalizePath(relative(resolvedConfig.root, componentPath))}')`,
        }
        configs.push(componentDemoConfig as unknown as DemoConfigAsComponent)
      } else {
        continue
      }
    }

    generateDemosModule()
  }

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
      console.log('configResolved')
      resolvedConfig = config
    },
    configureServer(server) {
      _server = server
      server.middlewares.use((req, res, next) => {
        console.log('URL:', req.url)
        next()
      })

      server.watcher.add(join(resolvedConfig.root, 'demos')).on('all', (event, path) => {
        console.log('watcher:', event, path)
        readDemos()
      })
    },
    buildStart() {
      console.log('buildStart')
      readDemos()
    },
    buildEnd() {
      console.log('buildEnd')
    },
  }
}

const isDirectory = (path: string) => {
  if (!existsSync(path)) return false
  try {
    return statSync(path).isDirectory()
  } catch (_) {
    return false
  }
}

const isFile = (path: string) => {
  if (!existsSync(path)) return false
  try {
    return statSync(path).isFile()
  } catch (_) {
    return false
  }
}

export default demosPlugin
