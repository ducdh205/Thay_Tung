import { createRoot } from 'react-dom/client';
// Only latin + vietnamese subsets are bundled (the whole film is in Vietnamese).
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/vietnamese-400.css';
import '@fontsource/jetbrains-mono/latin-700.css';
import '@fontsource/jetbrains-mono/vietnamese-700.css';
import '@fontsource/lora/latin-400.css';
import '@fontsource/lora/vietnamese-400.css';
import '@fontsource/lora/latin-400-italic.css';
import '@fontsource/lora/vietnamese-400-italic.css';
import '@fontsource/playfair-display/latin-400.css';
import '@fontsource/playfair-display/vietnamese-400.css';
import './global.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(<App />);
