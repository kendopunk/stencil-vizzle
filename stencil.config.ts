/**
 * stencil.config.ts
 */
import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'

export const config: Config = {
  namespace: 'stencil-vizzle',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      copy: [
        {src: 'pages'},
        {src: 'js'},
        {src: 'css'},
        {src: 'assets'}
      ],
      serviceWorker: null // disable service workers
    },
    {
      type: 'www',
      dir: 'demo',
      copy: [
        {src: 'pages'},
        {src: 'js'},
        {src: 'css'},
        {src: 'assets'}
      ],
      serviceWorker: null // disable service workers
    }
  ],
  excludeSrc: [
    '**/*.spec.ts',
    '**/*.e2e.ts'
  ],
  plugins: [
    sass()
  ],
  testing: {
    collectCoverageFrom: [
      "src/utils/**/*.ts"
    ]
  }
}
