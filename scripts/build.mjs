import { cp, mkdir, rm, stat } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('index.html', 'dist/index.html');
await cp('src', 'dist/src', { recursive: true });
await cp('public', 'dist', { recursive: true });
console.log('Build completado: landing estática en dist/.');
console.log(`HTML: ${(await stat('dist/index.html')).size} bytes. Sin dependencias de ejecución.`);
