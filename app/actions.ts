'use server';

import { GoogleGenAI, Modality } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set on the server");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// FIX: Update ActionResult to include mimeType for the generated image.
interface ActionResult {
  imageData?: { base64: string; mimeType: string };
  error?: string;
}

export async function editImageWithPromptAction(
    base64ImageData: string, 
    mimeType: string, 
    promptText: string
): Promise<ActionResult> {
  if (!base64ImageData || !mimeType || !promptText) {
    return { error: "Missing image, mime type, or prompt." };
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData) {
        // FIX: Return both base64 data and mimeType.
        return { imageData: { base64: part.inlineData.data, mimeType: part.inlineData.mimeType } };
      }
    }
    return { error: "Failed to generate image. The model did not return image data." };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { error: `Failed to communicate with the Gemini API: ${errorMessage}` };
  }
}
