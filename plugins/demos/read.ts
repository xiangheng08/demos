import { normalizePath } from 'vite'
import { join, relative } from 'node:path'
import { DemoConfigWithPlugin } from 'virtual:demos'
import { DEMO_DIR_CONFIG_FILE_NAME } from './config'
import { isDirectory, isFile, isObject } from './utils'
import { existsSync, readdirSync, readFileSync } from 'node:fs'

export const readDemoConfigs = (
  demosDir: string,
  root: string,
  isBuild: boolean,
): DemoConfigWithPlugin[] => {
  const demoConfigs: DemoConfigWithPlugin[] = []
  if (!existsSync(demosDir)) return demoConfigs

  for (const file of readdirSync(demosDir)) {
    const demoDirPath = join(demosDir, file)
    if (!isDirectory(demoDirPath)) continue

    const htmlPath = join(demoDirPath, 'index.html')
    const componentPath = join(demoDirPath, 'index.vue')
    const demoConfigFilePath = join(demoDirPath, DEMO_DIR_CONFIG_FILE_NAME)

    let demoConfigFile: DemoConfigWithPlugin

    if (existsSync(demoConfigFilePath) && isFile(demoConfigFilePath)) {
      try {
        // 读取配置文件
        demoConfigFile = JSON.parse(readFileSync(demoConfigFilePath, 'utf-8'))

        if (!isObject(demoConfigFile)) {
          // 配置文件不是对象
          throw new Error(`[${demoConfigFilePath}] is not a object.`)
        }

        // 过滤掉仅开发环境的 demo
        if (demoConfigFile.onlyDev && isBuild) continue
      } catch (error) {
        console.error(`[${demoConfigFilePath}] ${error}`)
      }
    }

    if (isFile(htmlPath)) {
      demoConfigs.push({
        ...demoConfigFile!,
        id: file,
        type: 'html',
        dir: demoDirPath,
        // 构建时相对与 demos，开发时相对与根目录
        html: isBuild
          ? normalizePath('./' + relative(demosDir, htmlPath))
          : normalizePath('./' + relative(root, htmlPath)),
      })
    } else if (isFile(componentPath)) {
      demoConfigs.push({
        ...demoConfigFile!,
        id: file,
        type: 'component',
        dir: demoDirPath,
        component: normalizePath(relative(demosDir, componentPath)),
        importFnText: `() => import('/${normalizePath(relative(root, componentPath))}')`,
      })
    } else {
      continue
    }
  }

  return demoConfigs
}
