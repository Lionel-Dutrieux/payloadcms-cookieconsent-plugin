export interface Script {
  category: { name: string; required: boolean }
  enabled: boolean
  html: string
  service: string
}
