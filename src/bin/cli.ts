#!/usr/bin/env node

import { Command } from 'commander';
import { TextToEmbeddingController } from '../controllers/appController.js';
import { startServer } from '../server.js';

const program = new Command();
const controller = new TextToEmbeddingController();

(async () => {
  await controller.ready();

  // Embed text
  program
    .command('create')
    .description('Create a text embedding')
    .requiredOption('-i, --id <id>', 'Unique identifier for the embedding')
    .requiredOption('-t, --text <text>', 'Text to embed')
    .option('-m, --metadata <metadata>', 'Additional metadata as JSON')
    .action(async (opts) => {
      const metadata = opts.metadata ? JSON.parse(opts.metadata) : {};
      await controller.create(opts.id, opts.text, metadata);
      console.log(`Embedding created successfully for ID: ${opts.id}`);
    });

  // Update embedding
  program
    .command('update')
    .description('Update an existing embedding')
    .requiredOption('-i, --id <id>', 'Unique identifier for the embedding')
    .requiredOption('-t, --text <text>', 'Updated text to embed')
    .option('-m, --metadata <metadata>', 'Updated metadata as JSON')
    .action(async (opts) => {
      const metadata = opts.metadata ? JSON.parse(opts.metadata) : {};
      await controller.update(opts.id, opts.text, metadata);
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
    .requiredOption('-t, --text <text>', 'Text to find similarities for')
    .requiredOption('-l, --limit <limit>', 'Number of results to retrieve', parseInt)
    .action(async (opts) => {
      const results = await controller.retrieveSimilar(opts.text, opts.limit);
      console.log('Similar results:', results);
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
