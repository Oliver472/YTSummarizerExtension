import React from 'react';
import { createRoot } from 'react-dom/client';
import SummarizePanel from './components/SummarizePanel';

let currentVideoId = null;

function renderComponent() {
  const videoId = new URLSearchParams(window.location.search).get('v');
  if (!videoId || videoId === currentVideoId) return;

  const target = document.querySelector(
    '#related .style-scope .ytd-watch-flexy'
  );
  if (!target) return;

  const existingContainer = document.querySelector('#summarize-container');
  if (existingContainer) {
    existingContainer.remove(); // Remove the old one before re-render
  }

  const container = document.createElement('div');
  target.insertBefore(container, target.firstChild);
  createRoot(container).render(<SummarizePanel />);
  currentVideoId = videoId;
}

setInterval(renderComponent, 1000); // Poll every second
