import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === 'true'
const isUserPagesRepository = repositoryName?.toLowerCase().endsWith('.github.io')
const base = isGitHubPagesBuild && repositoryName
  ? isUserPagesRepository ? '/' : `/${repositoryName}/`
  : '/'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
})
