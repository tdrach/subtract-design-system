import type { NextConfig } from 'next'
import path from 'node:path'

const workspaceRoot = path.resolve(__dirname, '..')

const config: NextConfig = {
  transpilePackages: ['@subtract/ds'],
  sassOptions: {
    includePaths: [path.join(__dirname, 'node_modules')],
  },
  turbopack: {
    root: workspaceRoot,
  },
}

export default config
