import { Hono } from 'hono';
import { serve } from '@hono/node-server';


const app = new Hono();

app.get('/api/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mode: process.env.NODE_ENV 
  });
});

console.log('Hono API running on http://localhost:5173');
serve({ fetch: app.fetch, port: 5173 });

export default app;