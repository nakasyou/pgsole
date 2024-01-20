import { defineConfig } from 'vite'
import devServer, { defaultOptions } from '@hono/vite-dev-server'
import { svelte } from '@sveltejs/vite-plugin-svelte'

console.log(defaultOptions)
export default defineConfig({
  plugins: [
    svelte(),
    devServer({
      entry: './src/main.tsx',
      exclude: [
        ...defaultOptions.exclude,
        /.*\.css.*$/,
        /.*\.svelte.*$/
      ]
    })
  ]
})