import {execFileSync} from 'node:child_process';
import {writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const cli=path.join(root,'node_modules/@slidev/cli/bin/slidev.mjs');
// Hash routes keep direct slide links and refreshes working on a static host.
execFileSync(process.execPath,[cli,'build','slides.md','--base','/rl-lecture-slidev/','--router-mode','hash','--without-notes','--out','docs'],{cwd:root,stdio:'inherit'});
writeFileSync(path.join(root,'docs/.nojekyll'),'');
console.log('GitHub Pages build ready in docs/. Commit and push it with the source.');
