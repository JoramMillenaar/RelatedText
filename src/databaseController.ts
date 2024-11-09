import { LocalIndex } from 'vectra';
import path from 'path';
import { fileURLToPath } from 'url';

// Manually define __filename and __dirname for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class VectraDatabaseController {
    private index: LocalIndex;
    constructor() {
        this.index = new LocalIndex(path.join(__dirname, '..', '.vectra-index'));
    }

    async ready(): Promise<void> {
        if (!await this.index.isIndexCreated()) {
            await this.index.createIndex();
        }
    }

    async create(id: string, embedding: Float32Array, metadata: Record<string, string>): Promise<void> {
        await this.index.insertItem({
            vector: Array.from(embedding),
            metadata: { id: id, ...metadata }
        });
    }
}