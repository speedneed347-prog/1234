import express, { Request, Response } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { quizRouter } from './server/routes/quizRoutes.ts';
import { adminRouter } from './server/routes/adminRoutes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Upload directory for custom photo attachments
  const uploadDir = path.resolve(process.cwd(), 'data', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadDir));

  // Custom photo upload endpoint
  app.post('/api/upload', (req: Request, res: Response) => {
    try {
      const { dataUrl, filename } = req.body;
      if (!dataUrl || typeof dataUrl !== 'string') {
        return res.status(400).json({ success: false, error: 'Missing image data' });
      }

      // Check base64 dataUrl format
      const match = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (!match) {
        // If it's already an HTTP URL, return as-is
        if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://')) {
          return res.json({ success: true, url: dataUrl });
        }
        return res.status(400).json({ success: false, error: 'Invalid image format. Expected data URL or HTTP URL.' });
      }

      const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
      const base64Data = match[2];
      const safeName = `photo-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const filePath = path.join(uploadDir, safeName);

      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

      return res.json({
        success: true,
        url: `/uploads/${safeName}`,
        message: 'Photo uploaded successfully',
      });
    } catch (err: any) {
      console.error('Error handling upload:', err);
      return res.status(500).json({ success: false, error: 'Failed to process photo upload' });
    }
  });

  // API Routes
  app.use('/api', quizRouter);
  app.use('/api', adminRouter);

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'BFFMeter Server', timestamp: new Date().toISOString() });
  });

  if (!isProd) {
    // Vite Dev Server middleware mode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
