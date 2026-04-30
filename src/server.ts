import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import {join} from 'node:path';
import { GoogleGenAI, Type } from '@google/genai';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
app.use(express.json({limit: '10mb'})); // Increase payload limit for base64 audio

const angularApp = new AngularNodeAppEngine();

const ai = new GoogleGenAI({ apiKey: process.env['GEMINI_API_KEY'] });

app.post('/api/analyze', async (req, res) => {
  try {
    const { text, audioBase64, mimeType } = req.body;
    const parts: { text?: string; inlineData?: { data: string; mimeType: string } }[] = [];
    
    if (text) {
      parts.push({ text });
    }
    
    if (audioBase64) {
      parts.push({
        inlineData: {
          data: audioBase64,
          mimeType: mimeType || 'audio/webm'
        }
      });
    }

    if (parts.length === 0) {
       res.status(400).json({ error: 'No content provided' });
       return;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        systemInstruction: "You are an expert scam detection and cybersecurity assistant. Evaluate the provided message or audio to determine if it's a scam, a suspicious attempt (like phishing, advanced fee fraud, fake emergency), or likely safe. Be extremely observant of urgency or financial requests. Respond with a JSON object.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: {
              type: Type.STRING,
              description: "The evaluation status",
              enum: ["Safe", "Suspicious", "Scam"]
            },
            reasoning: {
              type: Type.STRING,
              description: "A friendly, empathetic explanation of why this conclusion was reached."
            },
            advice: {
              type: Type.STRING,
              description: "Actionable advice on what the user should do next (e.g. 'Do not send money', 'Call them on their official number')."
            },
            flags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of specific red flags found (e.g., 'Artificial urgency', 'Unusual payment method'). Empty if safe."
            }
          },
          required: ["status", "reasoning", "advice", "flags"]
        }
      }
    });

    res.json({ result: JSON.parse(response.text || '{}') });
    return;
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to analyze content' });
    return;
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
