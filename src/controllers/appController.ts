import { DocumentEmbeddingController } from './embedderController.js'
import { VectraDatabaseController, QueryResult } from './databaseController.js';


export class TextToEmbeddingController {
    private embedder: DocumentEmbeddingController;
    private db: VectraDatabaseController;

    constructor() {
        this.embedder = new DocumentEmbeddingController();
        this.db = new VectraDatabaseController();
    }
    async ready(): Promise<void> {
        await this.embedder.ready();
        await this.db.ready();
    }

    async create(id: string, text: string, metadata: Record<string, string>): Promise<void> {
        const documentEmbedding = await this.embedder.generateDocumentEmbedding(text);
        await this.db.create(id, documentEmbedding, metadata);
    }
    async update(id: string, text: string, metadata: Record<string, string>): Promise<void> {
        await this.db.delete(id);
        await this.create(id, text, metadata);
    }
    async destroy(id: string): Promise<void> {
        await this.db.delete(id);
    }
    async destroyAll(): Promise<void> {
        await this.db.dropDatabase();
        await this.db.ready();
    }
    async retrieveSimilar(text: string, limit: number): Promise<QueryResult[]> {
        const documentEmbedding = await this.embedder.generateDocumentEmbedding(text);
        return await this.db.querySimilar(documentEmbedding, limit);
    }
}