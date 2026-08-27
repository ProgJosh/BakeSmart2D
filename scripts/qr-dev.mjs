import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import os from 'node:os';
import QRCode from 'qrcode';

const PORT = process.env.PORT || '5173';

function lanIp() {
  const ifaces = os.networkInterfaces();
  const candidates = [];
  for (const name of Object.keys(ifaces)) {
    for (const info of ifaces[name] || []) {
      if (info.family !== 'IPv4' || info.internal) continue;
      const ip = info.address;
      if (ip.startsWith('169.254.')) continue; // skip link-local (APIPA)
      if (ip.startsWith('127.')) continue;
      // prefer private LAN ranges
      const isPrivate =
        ip.startsWith('192.168.') ||
        ip.startsWith('10.') ||
        /^172\.(1[6-9]|2\d|3[01])\./.test(ip);
      candidates.push({ ip, isPrivate });
    }
  }
  candidates.sort((a, b) => Number(b.isPrivate) - Number(a.isPrivate));
  return candidates[0]?.ip || null;
}

const vite = spawn('node', ['node_modules/vite/bin/vite.js', '--host', '--port', PORT], {
  stdio: ['ignore', 'pipe', 'inherit'],
  env: process.env
});

const stripAnsi = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');

let resolved = false;
const rl = createInterface({ input: vite.stdout });

rl.on('line', async (line) => {
  const clean = stripAnsi(line);
  const portMatch = clean.match(/Local:\s+https?:\/\/localhost:(\d+)/i);
  if (portMatch && !resolved) {
    resolved = true;
    const port = portMatch[1];
    const ip = lanIp();
    if (!ip) {
      console.log('\nCould not find a LAN IP. Make sure you are connected to Wi-Fi.\n');
      return;
    }
    const url = `http://${ip}:${port}/`;
    const qr = await QRCode.toString(url, { type: 'terminal', small: true });
    console.log('\n=========================================================');
    console.log('  Scan this QR code with your phone (same Wi-Fi):');
    console.log('  ' + url);
    console.log('=========================================================\n');
    console.log(qr);
  }
});

vite.on('exit', (code) => process.exit(code ?? 0));
