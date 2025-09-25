// preload.cjs
const { contextBridge } = require('electron');

const BACKEND_BASE = 'http://127.0.0.1:3001'; // should match api_server.py

async function jsonPost(path, body) {
  const res = await fetch(BACKEND_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  });
  return res.json();
}

async function jsonGet(path, params) {
  let url = new URL(BACKEND_BASE + path);
  if (params) {
    Object.keys(params).forEach((k) => url.searchParams.append(k, params[k]));
  }
  const res = await fetch(url.toString(), {
    method: 'GET',
  });
  return res.json();
}

async function uploadFile(path, file) {
  // file should be a File/Blob from renderer
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(BACKEND_BASE + path, {
    method: 'POST',
    body: form,
  });
  return res.json();
}

contextBridge.exposeInMainWorld('api', {
  // health check
  health: async () => jsonGet('/health'),

  // chat - sends { message, mode?, user_id? } as JSON
  sendMessage: async (payload) => jsonPost('/api/chat', payload),

  // upload (File/Blob) - returns OCR/response object
  uploadFile: async (file) => uploadFile('/api/upload', file),

  // user memory endpoints
  userGet: async (user_id, key) => jsonGet('/api/user/get', { user_id, key }),
  userSet: async (payload) => jsonPost('/api/user/set', payload), // payload: { user_id, key, value }
  userList: async (user_id) => jsonGet('/api/user/list', { user_id }),

  // scrape
  scrape: async (url) => jsonPost('/api/scrape', { url }),

  // convenience: fetch arbitrary GET/POST for advanced uses
  rawGet: async (path, params) => jsonGet(path, params),
  rawPost: async (path, body) => jsonPost(path, body),
});
