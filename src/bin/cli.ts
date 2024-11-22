#!/usr/bin/env node

import { Command } from 'commander';
import { TextToEmbeddingController } from '../controllers/appController.js';
import { startServer } from '../server.js';

const program = new Command();
const controller = new TextToEmbeddingController();

async function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.on('data', (chunk) => (data += chunk));
    process.stdin.on('end', () => resolve(data.trim()));
    process.stdin.on('error', (err) => reject(err));
  });
}

(async () => {
  await controller.ready();

  // Embed text
  program
    .command('create')
    .description('Create a text embedding')
    .requiredOption('-i, --id <id>', 'Unique identifier for the embedding')
    .option('-m, --metadata <metadata>', 'Additional metadata as JSON')
    .action(async (opts) => {
      const metadata = opts.metadata ? JSON.parse(opts.metadata) : {};
      const text = opts.text || (await readStdin());
      if (!text) {
        console.error('Error: Text is required (either via --text or stdin)');
        process.exit(1);
      }
      await controller.create(opts.id, text, metadata);
      console.log(`Embedding created successfully for ID: ${opts.id}`);
    });

  // Update embedding
  program
    .command('update')
    .description('Update an existing embedding')
    .requiredOption('-i, --id <id>', 'Unique identifier for the embedding')
    .option('-m, --metadata <metadata>', 'Updated metadata as JSON')
    .action(async (opts) => {
      const metadata = opts.metadata ? JSON.parse(opts.metadata) : {};
      const text = opts.text || (await readStdin());
      if (!text) {
        console.error('Error: Text is required (either via --text or stdin)');
        process.exit(1);
      }
      await controller.update(opts.id, text, metadata);
      console.log(`Embedding updated successfully for ID: ${opts.id}`);
    });

  // Delete embedding
  program
    .command('delete')
    .description('Delete an embedding')
    .requiredOption('-i, --id <id>', 'Unique identifier for the embedding')
    .action(async (opts) => {
      await controller.destroy(opts.id);
      console.log(`Embedding deleted successfully for ID: ${opts.id}`);
    });

  // Delete all embeddings
  program
    .command('delete-all')
    .description('Delete all embeddings')
    .action(async () => {
      await controller.destroyAll();
      console.log('All embeddings deleted successfully.');
    });

  // Query similar
  program
    .command('similar')
    .description('Find similar text')
    .option('-t, --text <text>', 'Text to find similarities for')
    .requiredOption('-l, --limit <limit>', 'Number of results to retrieve', parseInt)
    .action(async (opts) => {
      try {
        // Read text from stdin if --text is not provided
        const text = opts.text || (await new Promise<string>((resolve, reject) => {
          let input = '';
          process.stdin.on('data', (chunk) => (input += chunk));
          process.stdin.on('end', () => resolve(input.trim()));
          process.stdin.on('error', reject);
        }));

        if (!text) {
          throw new Error('Text is required (either via --text or stdin)');
        }

        const results = await controller.retrieveSimilar(text, opts.limit);
        console.log(JSON.stringify(results, null, 2));
      } catch (error) {
        console.error('Error:', error);
        process.exit(1);
      }
    });

  // Start server
  program
    .command('start-server')
    .description('Start the REST API server')
    .option('-p, --port <port>', 'Port to run the server on (default: 3000)', '3000')
    .action(async (opts) => {
      const port = parseInt(opts.port, 10);
      console.log(`Starting server on port ${port}...`);
      await startServer(port);
    });

  program.parse(process.argv);
})();
