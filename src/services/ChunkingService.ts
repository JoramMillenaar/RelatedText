export interface IChunker {
    chunkText(text: string): Promise<string[]>;
}

export class ParagraphChunker implements IChunker {
    async chunkText(text: string): Promise<string[]> {
        return text.split(/\r?\n\r?\n/).filter(paragraph => paragraph.trim() !== "");
    }
}
