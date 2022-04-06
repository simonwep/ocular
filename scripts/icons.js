import {resolve} from 'path';
import {readdir, writeFile} from 'fs/promises';

(async () => {
    const icons = resolve(process.cwd(), 'public/icons');
    const types = resolve(process.cwd(), 'src/app/components/base/icon/Icon.types.ts');
    const names = (await readdir(icons)).map(v => v.replace(/\.\w+/, ''));
    await writeFile(types, `export type AppIcon = ${names.map(v => `'${v}'`).join(' | ')};`);
})();
