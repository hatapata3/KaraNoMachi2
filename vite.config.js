import { defineConfig } from 'vite'
import restart from 'vite-plugin-restart'
import glsl from 'vite-plugin-glsl'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  server: {
    mimeTypes: {
      "model/gltf-binary": ["glb"],
      "model/gltf+json": ["gltf"],
      "video/mp4": ["mp4"],
      "audio/mp3": ["mp3"],
    }
  },
  plugins: 
  [
    restart({ restart: ['../static/**',] }),
    react(),
    glsl(),
    svgr({
      exportAsDefault: true,}),
  ],
  assetsInclude: ['**/*.glb'],
})
