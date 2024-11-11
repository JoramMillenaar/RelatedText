import { LocalIndex } from 'vectra';
import path from 'path';
import { fileURLToPath } from 'url';

export type QueryResult = {
    id: string
    score: number
    metadata: Record<string, any>
}

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
    async exists(id: string): Promise<boolean> {
        const results = await this.index.listItemsByMetadata({id: id})
        return results.length > 0;
    }

    async dropDatabase(): Promise<void> {
        await this.index.deleteIndex();
    }

    async querySimilar(embedding: Float32Array, limit: number): Promise<QueryResult[]> {
        const results = await this.index.queryItems(Array.from(embedding), limit);
        return results.map(result => ({
            id: result.item.metadata.id.toString(),
            score: result.score,
            metadata: result.item.metadata
        }));
    }
}