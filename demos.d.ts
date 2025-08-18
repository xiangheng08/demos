declare module 'virtual:demos' {
  export interface DemoConfigAsComponentWithPlugin {
    type: 'component'
    title: string
    description?: string
    component: string
    importFnText: string
  }

  export interface DemoConfigAsComponent {
    type: 'component'
    title: string
    description?: string
    component: string
    importFn: () => Promise<any>
  }

  export interface DemoConfigAsHTML {
    type: 'html'
    title: string
    description?: string
    html: string
  }

  export type DemoConfig = DemoConfigAsComponent | DemoConfigAsHTML

  export const configs: DemoConfig[]
}
