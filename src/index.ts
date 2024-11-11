import express from 'express';
import { Command } from 'commander';
import { TextToEmbeddingController } from './textToEmbeddingController.js';
import { EmbeddingAlreadyExists } from './errors.js';

const program = new Command();


const app = express();
app.use(express.json());
const controller = new TextToEmbeddingController();
await controller.ready()

/* Embeddings */
app.post('/embeddings', async (req, res) => {
	try {
		if (!req.body || !req.body.id || !req.body.text) {
			return res.status(400).json({ error: 'Missing required parameter', message: 'Both "id" and "text" are required.' });
		}
		const { id, text, metadata } = req.body;

		await controller.create(id, text, metadata);
		res.status(201).json({ id: id, message: "Text embedded and stored successfully." });
	} catch (error) {
		if (error instanceof EmbeddingAlreadyExists) {
			return res.status(409).send(error.message);
		} else {
			console.error(error);
			res.status(500).json({ error: 'Internal Server Error', message: 'An error occurred while embedding the text.' });
		}
	}
});
app.put('/embeddings/:id', function (req, res) {
	res.status(200).send('Embedding updated successfully.')
	res.status(400).send('Missing required parameter: text')
	res.status(404).send("ID not found. Cannot update a non-existent embedding.")
})
app.delete('/embeddings/all', async (req, res) => {
	try {
		await controller.destroyAll();
		return res.status(204).send("All embeddings deleted successfully.");
	} catch (error) {
		console.error(error);
		return res.status(500).send('An error occurred while processing the request');
	}
})
app.delete('/embeddings/:id', function (req, res) {
	res.status(204).send("Embedding deleted successfully.")
	res.status(404).send("ID not found. Cannot delete a non-existent embedding.")
})

/* Similar */
app.post('/similar', async (req, res) => {
	try {
		const { text, limit } = req.body;
		if (!text) {
			return res.status(400).send('Missing required parameter: text');
		}
		if (typeof limit !== 'number') {
			return res.status(400).send('Missing required parameter: limit');
		}

		const results = await controller.retrieveSimilar(text, limit);
		const response = results.map(result => ({
			id: result.id,
			similarity: result.score,
			metadata: result.metadata
		}));
		return res.status(200).send(response);
	} catch (error) {
		console.error(error);
		return res.status(500).send('An error occurred while processing the request');
	}
});

program
	.option('-p, --port <number>', 'port to listen on', '3000')
	.on('command:*', (operands) => {
		console.error(`Unknown option: ${operands.join(' ')}`);
		process.exit(1);
	});

program.parse(process.argv);

const options = program.opts();
const port = options.port;

const server = app.listen(port, function () {
	const address = server.address()
	if (typeof address === 'string') {
		console.log(`Listening on ${address}`)
	} else if (address) {
		console.log(`Listening on ${address.port}`)
	}
})