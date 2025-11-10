import React from 'react';
import HomePage from './app/page';
import './app/globals.css';

/**
 * This file and index.tsx seem to be part of a standard React setup,
 * which conflicts with the Next.js App Router structure in the /app directory.
 * This component renders the Next.js page to resolve compilation errors.
 */
function App() {
  return <HomePage />;
}

export default App;
