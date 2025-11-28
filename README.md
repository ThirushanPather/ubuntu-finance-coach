# Ubuntu Finance Coach

## Quick Start

```bash
# Install dependencies
npm install

# Start ARK API port-forward (in separate terminal - keep running)
kubectl port-forward svc/ark-api 8080:80 -n default

# Start dev server
npm run dev
```

Open http://localhost:3000

## Test Agent Connection

1. Green status = Connected
2. Type a message
3. Agent should respond

## Current Files (Have Code)
- package.json
- vite.config.js
- index.html
- src/main.jsx
- src/index.css
- src/App.jsx

## Future Files (Empty - For Later)
All other files in src/ are placeholders for future features.
