import { BasePayload } from 'payload'

export function buildCorsHeader(config: BasePayload['config']): [string, string] | null {
  if (config.cors == '*') return ['access-control-allow-origin', '*']
  else if (Array.isArray(config.cors)) return ['access-control-allow-origin', config.cors.join(',')]
  return null
}
