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
        {src: 'pages'}
      ],
      serviceWorker: null // disable service workers
    }
  ],
  plugins: [
    sass()
  ]
}
