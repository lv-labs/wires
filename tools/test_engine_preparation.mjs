import {execFileSync} from 'node:child_process';
execFileSync('python3', [new URL('./test_engine_preparation.py', import.meta.url).pathname], {
  cwd: new URL('../', import.meta.url),
  env: {...process.env, PYTHONDONTWRITEBYTECODE: '1'},
  stdio: 'inherit',
});
