# Alice Copilot Buddy (Frontend)

A React + TypeScript frontend application that serves as the user interface for interacting with **Alice Chat Bot** (backend). This frontend handles prompt input, displays responses, and maintains session state.

## Features

- Clean, responsive UI built with React + Vite  
- Fetches messages from backend via API calls  
- Supports conversation flow (send message → receive reply)  
- Uses environment variables to configure backend endpoint  
- Lightweight and modular component structure  

## Tech Stack

- React  
- TypeScript  
- Vite  
- Tailwind CSS / CSS Modules / (whatever you used)  
- Fetch / Axios for HTTP calls  

## Setup (Local Development)

```bash
git clone https://github.com/yourusername/alice-copilot-buddy.git
cd alice-copilot-buddy
npm install
Create a .env.local (or .env) file:

ini
Copy code
VITE_API_URL=http://localhost:3000
To start:

bash
Copy code
npm run dev
Open http://localhost:5173 (or the URL Vite gives) in your browser.

Usage
Type a message/“prompt” in the input box

Press send → frontend sends to backend /api/chat

Get and display bot reply

Deployment
You can deploy this to Vercel / Netlify / Cloudflare Pages, pointing to the built dist folder. Make sure to set VITE_API_URL in your deployment environment to the backend's deployed URL.

Future Improvements
Support streaming responses (so replies appear progressively)

Add authentication / user accounts

Add message history, context windows

Improve error handling / loading states

Add tests (unit + integration)

License & Credits
MIT License
(c) 2025 Mohammed Saad
