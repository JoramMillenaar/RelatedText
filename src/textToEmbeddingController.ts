import { XenovaEmbeddingService } from '../text-to-embedding/index.js';
import { VectraDatabaseController } from './databaseController.js';


export class TextToEmbeddingController {
    private embedder: XenovaEmbeddingService;
    private db: VectraDatabaseController;

    constructor() {
        this.embedder = new XenovaEmbeddingService();
        this.db = new VectraDatabaseController();
    }
    async ready(): Promise<void> {
        await this.embedder.ready();
        await this.db.ready();
    }

    async create(id: string, text: string, metadata: Record<string, string>): Promise<void> {
        const embeddingChunks = await this.embedder.generateEmbeddingChunks(text);
        for (const embeddingChunk of embeddingChunks) {
            this.db.create(id, embeddingChunk.embedding, metadata);
        }
    }
    async update(id: string, text: string, metadata: object): Promise<void> {

    }
    async destroy(id: string): Promise<void> {

    }
    async destroyAll(): Promise<void> {

    }
    async retrieveSimilar(text: string, limit: number): Promise<void> {

    }
}