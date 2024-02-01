import {Application} from '@feathersjs/feathers';
import axios from 'axios';
import {QueryTypes, Sequelize} from 'sequelize';

export async function embed(app: Application, text: string): Promise<{ embedding: number[], text: string }[]> {
    const response = await axios.post(`${app.get('embeddings').url}/encode`, {text});
    return response.data;
}

export async function embedQuery(app: Application, query: string): Promise<number[]> {
    const response = await axios.post(`${app.get('embeddings').url}/encode-query`, {query});
    return response.data;
}

export async function bulkEmbed(app: Application, texts: { id: string, text: string }[]): Promise<{
    id: string,
    embedding: number[],
    text: string
}[]> {
    const response = await axios.post(`${app.get('embeddings').url}/bulk-encode`, {texts});
    return response.data;
}


export interface KnowledgeBaseResult {
    id: number;
    question: string;
    answer: string;
    score: number;
}

export interface EmbeddingResult {
    id: number;
    text: string;
    score: number;
}

export async function searchKnowledgeBase(app: Application, text: string, cutoff: number = 0.3, top: number = 10): Promise<KnowledgeBaseResult[]> {
    const sequelize: Sequelize = app.get('sequelizeClient');
    const embedding = await embedQuery(app, text);
    const embeddingString = `'[${embedding.join(', ')}]'`;
    return sequelize.query(
        `SELECT * FROM (SELECT DISTINCT ON (kb.id) kb.id, question, answer, 1 - cosine_distance(embedding, ${embeddingString}) AS score
            FROM knowledge_base kb JOIN embeddings e on kb.id = e.question_id ORDER BY kb.id, score DESC) as matches WHERE score > ? ORDER BY score DESC LIMIT ?;`,
        {
            replacements: [cutoff, top],
            type: QueryTypes.SELECT
        }
    );
}

export async function searchEmbeddings(app: Application, text: string, cutoff: number = 0.3, top: number = 10): Promise<EmbeddingResult[]> {
    const sequelize: Sequelize = app.get('sequelizeClient');
    const embedding = await embedQuery(app, text);
    const embeddingString = `'[${embedding.join(', ')}]'`;
    return sequelize.query(
        `SELECT * FROM (SELECT id, text, 1 - cosine_distance(embedding, ${embeddingString}) AS score
            FROM embeddings) as matches WHERE score > ? ORDER BY score DESC LIMIT ?;`,
        {
            replacements: [cutoff || 0.3, top || 10],
            type: QueryTypes.SELECT
        }
    );
}
