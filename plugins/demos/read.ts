import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { DemoConfigWithPlugin } from 'virtual:demos'
import { isDirectory, isFile } from './utils'
import { normalizePath } from 'vite'
import { DEMO_DIR_CONFIG_FILE_NAME } from './config'

export const readDemoConfigs = (demosDir: string, root: string): DemoConfigWithPlugin[] => {
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
      demoConfigFile = JSON.parse(readFileSync(demoConfigFilePath, 'utf-8'))
    }

    if (isFile(htmlPath)) {
      demoConfigs.push({
        ...demoConfigFile!,
        type: 'html',
        dir: demoDirPath,
        html: normalizePath(relative(demosDir, htmlPath)),
      })
    } else if (isFile(componentPath)) {
      demoConfigs.push({
        ...demoConfigFile!,
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
