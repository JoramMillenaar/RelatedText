import express from 'express';
import { Command } from 'commander';

const program = new Command();


const app = express()

/* Embeddings */
app.post('/embeddings', function (req, res) {
	res.status(201).send({ "id": "string" })
	res.status(400).send('Missing required parameter: id')
	res.status(400).send('Missing required parameter: text')

})
app.put('/embeddings/:id', function (req, res) {
	res.status(200).send('Embedding updated successfully.')
	res.status(400).send('Missing required parameter: text')
	res.status(404).send("ID not found. Cannot update a non-existent embedding.")
})
app.delete('/embeddings/:id', function (req, res) {
	res.status(204).send("Embedding deleted successfully.")
	res.status(404).send("ID not found. Cannot delete a non-existent embedding.")
})
app.delete('/embeddings/all', function (req, res) {
	res.status(204).send("All embeddings deleted successfully.")
})

/* Similar */
app.post('/similar', function (req, res) {
	res.status(400).send('Missing required parameter: text')
	res.status(400).send('Missing required parameter: limit')
	res.status(200).send([
		{
			"id": "string",
			"similarity": 0,
			"metadata": {
				"additionalProp1": {}
			}
		}
	])
})

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