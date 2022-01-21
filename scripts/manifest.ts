import fs from 'fs-extra';
import { getManifest } from '../src/manifest';
import { r, log } from './utils';

const [, , browser, hash] = process.argv;

export async function writeManifest(): Promise<void> {
    await fs.ensureDir(r(`build/${browser}`));
    await fs.writeJSON(r(`build/${browser}/manifest.json`), await getManifest(hash), { spaces: 2 });
    log('PRE', 'write manifest.json');
}

writeManifest();
