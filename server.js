import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 80;

// Proxy API requests to the backend
app.use('/api', createProxyMiddleware({ 
  target: 'http://backend.mangaio.it:9999', 
  changeOrigin: true,
  pathRewrite: { '^/api': '' }
}));

// Serve static files from Vite build
app.use(express.static(path.join(__dirname, 'dist')));

// React Router SPA fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Scogna Manga Reader is running in production mode on port ${PORT}`);
});
