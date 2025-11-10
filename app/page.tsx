'use client';

import React, { useState, useCallback } from 'react';
import { ImageFile } from '../types';
import { editImageWithPromptAction } from './actions';
import { ImageUploader } from '../components/ImageUploader';
import { Spinner } from '../components/Spinner';

export default function HomePage() {
  const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (imageFile: ImageFile) => {
    setOriginalImage(imageFile);
    setEditedImage(null);
    setError(null);
  };
  
  const handleGenerate = useCallback(async () => {
    if (!originalImage || !prompt) {
      setError('Please upload an image and enter a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    const result = await editImageWithPromptAction(originalImage.base64, originalImage.mimeType, prompt);

    if (result.imageData) {
      setEditedImage(`data:image/jpeg;base64,${result.imageData}`);
    } else {
      setError(result.error || 'An unknown error occurred.');
    }

    setIsLoading(false);
  }, [originalImage, prompt]);
  
  const handleClear = () => {
    setOriginalImage(null);
    setEditedImage(null);
    setPrompt('');
    setError(null);
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen text-black">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold uppercase">
            Gemini Image Editor
          </h1>
          <p className="mt-2 text-lg text-gray-700">
            Transform images with AI. Raw power. No frills.
          </p>
        </header>

        <main>
          {!originalImage ? (
            <ImageUploader onImageUpload={handleImageUpload} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Controls and Original Image */}
              <div className="flex flex-col space-y-6">
                 <div className="relative w-full aspect-square bg-white border-2 border-black shadow-[8px_8px_0px_#000000] flex items-center justify-center p-2">
                    <img src={`data:${originalImage.mimeType};base64,${originalImage.base64}`} alt="Original" className="object-contain max-h-full max-w-full" />
                 </div>
                 <div className="bg-white p-6 border-2 border-black shadow-[8px_8px_0px_#000000]">
                    <h2 className="text-2xl font-bold mb-4 uppercase">Edit Your Image</h2>
                    <div className="space-y-4">
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., Add a retro filter, make it black and white..."
                        className="w-full p-3 bg-white border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200 resize-none h-24"
                        rows={3}
                        disabled={isLoading}
                      />
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={handleGenerate}
                          disabled={isLoading || !prompt}
                          className="w-full flex-1 justify-center items-center flex gap-2 text-black font-bold bg-yellow-400 hover:bg-yellow-500 border-2 border-black rounded-none shadow-[4px_4px_0px_#000000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-transform duration-150 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:cursor-not-allowed"
                        >
                          {isLoading ? 'Generating...' : 'Generate'}
                        </button>
                         <button
                          onClick={handleClear}
                          disabled={isLoading}
                          className="w-full sm:w-auto text-black font-bold bg-white hover:bg-gray-100 border-2 border-black rounded-none shadow-[4px_4px_0px_#000000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-transform duration-150 px-5 py-2.5"
                        >
                          Start Over
                        </button>
                      </div>
                    </div>
                </div>
              </div>

              {/* Right Column: Generated Image */}
              <div className="flex flex-col items-center justify-center bg-white p-4 min-h-[300px] lg:min-h-0 aspect-square border-2 border-black shadow-[8px_8px_0px_#000000]">
                {isLoading && (
                  <div className="text-center">
                    <Spinner />
                    <p className="mt-4 text-gray-700">Gemini is thinking...</p>
                  </div>
                )}
                {error && (
                  <div className="text-center text-white p-4 bg-red-500 border-2 border-black">
                    <p className="font-bold uppercase">Error</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                )}
                {!isLoading && editedImage && (
                    <img src={editedImage} alt="Edited" className="object-contain max-h-full max-w-full" />
                )}
                {!isLoading && !editedImage && !error && (
                  <div className="text-center text-gray-600">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2">Your generated image will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
