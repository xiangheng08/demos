import { DemoConfigWithPlugin } from 'virtual:demos'

export const template = `export const configs = __configs__`

export const formatDomeConfigModuleContent = (demoConfig: DemoConfigWithPlugin) => {
  if (demoConfig.type === 'html') {
    return `  {
    id: ${formatStringProperty(demoConfig.id)},
    type: 'html',
    title: ${formatStringProperty(demoConfig.title)},
    description: ${formatStringProperty(demoConfig.description)},
    html: ${formatStringProperty(demoConfig.html)}
  }`
  } else {
    return `  {
    id: ${formatStringProperty(demoConfig.id)},
    type: 'component',
    title: ${formatStringProperty(demoConfig.title)},
    description: ${formatStringProperty(demoConfig.description)},
    component: ${demoConfig.importFnText},
  }`
  }
}

export const formatStringProperty = (value: unknown) => {
  if (typeof value === 'string') {
    return `'${value}'`
  } else {
    return String(value)
  }
}

interface DemosModuleContent {
  configs: DemoConfigWithPlugin[]
}

export const generateDemosModuleContent = (content: DemosModuleContent) => {
  const formattedConfigs = content.configs.map(formatDomeConfigModuleContent).join(',\n')
  return template.replace('__configs__', `[\n${formattedConfigs}\n]`)
}

export const generateDefaultDemosModuleContent = () => {
  return generateDemosModuleContent({
    configs: [],
  })
}
