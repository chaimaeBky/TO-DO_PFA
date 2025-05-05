import { defineConfig } from 'cypress'
export default defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite'
    },
    specPattern: 'tests/integration/**/*.test.{js,jsx}'
  }
})