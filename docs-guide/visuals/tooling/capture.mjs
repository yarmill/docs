// node capture.mjs <module>   → runs capture/<module>.mjs
const mod = process.argv[2];
if (!mod) { console.error('usage: node capture.mjs <module>'); process.exit(1); }
await import(`./capture/${mod}.mjs`);
