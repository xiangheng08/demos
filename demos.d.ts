declare module 'virtual:demos' {
  export interface DemoConfigAsComponentWithPlugin {
    id: string
    type: 'component'
    dir: string
    title: string
    description?: string
    component: string
    importFnText: string
    onlyDev?: boolean
  }

  export interface DemoConfigAsHTMLWithPlugin {
    id: string
    type: 'html'
    dir: string
    title: string
    description?: string
    html: string
    onlyDev?: boolean
  }

  export type DemoConfigWithPlugin = DemoConfigAsComponentWithPlugin | DemoConfigAsHTMLWithPlugin

  export interface DemoConfigAsComponent {
    id: string
    type: 'component'
    title: string
    description?: string
    component: () => Promise<any>
  }

  export interface DemoConfigAsHTML {
    id: string
    type: 'html'
    title: string
    description?: string
    html: string
  }

  export type DemoConfig = DemoConfigAsComponent | DemoConfigAsHTML

  export const configs: DemoConfig[]
}
