import express from 'express';
import { Command } from 'commander';

const program = new Command();


const app = express()

/* Embeddings */
app.delete('/embeddings/:id', function (req, res) {
	//TODO
	res.status(503).send('Unimplemented')
})
app.delete('/embeddings/all', function (req, res) {
	//TODO
	res.status(503).send('Unimplemented')
})
app.post('/embeddings', function (req, res) {
	//TODO
	res.status(503).send('Unimplemented')
})
app.put('/embeddings/:id', function (req, res) {
	//TODO
	res.status(503).send('Unimplemented')
})

/* Similar */
app.post('/similar', function (req, res) {
	//TODO
	res.status(503).send('Unimplemented')
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
		console.log(`Listening on ${ address }`)
	} else if (address) {
		console.log(`Listening on ${ address.port }`)
	}
})