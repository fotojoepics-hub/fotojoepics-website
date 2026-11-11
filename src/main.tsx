import './styles.css';
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';

const el = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Pre-rendered pages arrive with their HTML already in place; just wire it up.
if (el.firstElementChild) hydrateRoot(el, app);
else createRoot(el).render(app);
