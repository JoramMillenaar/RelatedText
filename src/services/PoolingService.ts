export interface IPooler {
    pool(embeddings: Float32Array[]): Float32Array;
}


export class MeanPooler implements IPooler {
    pool(embeddings: Float32Array[]): Float32Array {
        const summedEmbedding = embeddings.reduce((acc, emb) => {
            return acc.map((val, idx) => val + emb[idx]);
        }, new Float32Array(embeddings[0].length));

        return new Float32Array(summedEmbedding.map(val => val / embeddings.length));
    }
}

export class MaxPooler implements IPooler {
    pool(embeddings: Float32Array[]): Float32Array {
        const maxedEmbedding = embeddings.reduce((acc, emb) => {
            return acc.map((val, idx) => Math.max(val, emb[idx]));
        }, new Float32Array(embeddings[0].length));

        return new Float32Array(maxedEmbedding);
    }
}
