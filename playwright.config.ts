import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:4173', browserName: 'chromium' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'tablet', use: { viewport: { width: 768, height: 1024 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: 'npm run preview -- --base /prueba-pages/ --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173/prueba-pages/',
    reuseExistingServer: false,
  },
})
