# relate-text

`relate-text` is a versatile library for creating, storing, updating, and querying text embeddings using neural embeddings. It supports operations via a REST API, a CLI, or programmatic interfaces, making it a powerful tool for text similarity, semantic search, and other embedding-based applications.

## Features

- Create and manage text embeddings.
- Query for similar text based on embeddings.
- REST API server with predefined endpoints.
- Command-line interface (CLI) for embedding management.


## Installation

Install the library using npm:

```bash
npm install relate-text
```

For global CLI usage:

```bash
npm install -g relate-text
```


## Usage

### Programmatic Usage

You can directly use `relate-text` in your Node.js applications.

#### Example:

```javascript
import { TextToEmbeddingController } from 'relate-text';

(async () => {
  const controller = new TextToEmbeddingController();
  await controller.ready();

  // Create a new embedding
  await controller.create('example-id', 'This is a sample text', { tag: 'example' });

  // Query for similar text
  const results = await controller.retrieveSimilar('sample text', 5);
  console.log('Similar results:', results);

  // Update the embedding
  await controller.update('example-id', 'Updated text content', { tag: 'updated' });

  // Delete the embedding
  await controller.destroy('example-id');

  // Delete all embeddings
  await controller.destroyAll();
})();
```


### REST API

You can start the REST API server to interact with embeddings.

#### Starting the Server

Run the server with:
```bash
relate-text start-server --port 3000
```

#### Available Endpoints

- **Create an Embedding**  
  `POST /embeddings`  
  Body:
  ```json
  {
    "id": "example-id",
    "text": "This is a sample text",
    "metadata": { "tag": "example" }
  }
  ```

- **Update an Embedding**  
  `PUT /embeddings`  
  Body:
  ```json
  {
    "id": "example-id",
    "text": "Updated text content",
    "metadata": { "tag": "updated" }
  }
  ```

- **Delete an Embedding**  
  `DELETE /embeddings/:id`

- **Delete All Embeddings**  
  `DELETE /embeddings/all`

- **Query Similar Text**  
  `POST /similar`  
  Body:
  ```json
  {
    "text": "sample text",
    "limit": 5
  }
  ```

### Command-Line Interface (CLI)

The CLI provides easy access to all major operations.

#### Commands

1. **Create an Embedding**
   ```bash
   relate-text create -i "example-id" -t "This is a sample text" -m '{"tag":"example"}'
   ```

2. **Update an Embedding**
   ```bash
   relate-text update -i "example-id" -t "Updated text content" -m '{"tag":"updated"}'
   ```

3. **Delete an Embedding**
   ```bash
   relate-text delete -i "example-id"
   ```

4. **Delete All Embeddings**
   ```bash
   relate-text delete-all
   ```

5. **Find Similar Text**
   ```bash
   relate-text similar -t "sample text" -l 5
   ```

6. **Start the Server**
   ```bash
   relate-text start-server --port 3000
   ```

## Configuration

### Metadata
Metadata can be provided as a JSON object during `create` or `update` operations. It is optional and useful for tagging or storing additional information about embeddings.

## Development

Clone the repository:
```bash
git clone https://github.com/yourusername/relate-text.git
```

Install dependencies:
```bash
npm install
```

Build the library:
```bash
npm run build
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes. Ensure all tests pass and your code follows the existing style.

## Acknowledgments

- Built with Node.js, Express, and Commander.js.
- Uses `@xenova/transformers` for generating embeddings.
