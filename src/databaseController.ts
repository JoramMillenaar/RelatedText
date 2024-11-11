import { LocalIndex } from 'vectra';
import path from 'path';
import { fileURLToPath } from 'url';
import { EmbeddingAlreadyExists, EmbeddingDoesNotExist } from './errors.js';

export type QueryResult = {
    id: string
    score: number
    metadata: Record<string, any>
}

type FilterResult = {
    db_id: string
    id: string
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
        // TODO: feature idea; add text hash to metadata for seeing if it's changed later
        if ((await this.filterByID(id)).length > 0) {
            throw new EmbeddingAlreadyExists(`Embedding with ID '${id}' already exists`);
        }
        await this.index.insertItem({
            vector: Array.from(embedding),
            metadata: { id: id, ...metadata }
        });
    }

    async delete(id: string): Promise<void> {
        const existingItems = await this.filterByID(id);
        if (existingItems.length > 0) {
            for (const item of existingItems) {
                this.index.deleteItem(item.db_id);
            }
        } else {
            throw new EmbeddingDoesNotExist(`Embedding with ID ${id} does not exist`);
        }
    }

    async filterByID(id: string): Promise<FilterResult[]> {
        const items = await this.index.listItemsByMetadata({ id: id });
        return items.map(item => ({
            db_id: item.id,
            id: item.metadata.id.toString()
        }));
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