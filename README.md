# Domain-based Redirect Server

This is a simple HTTP/HTTPS server that redirects traffic based on domain names while preserving the full request path.

## Features

- Domain-based redirection
- Supports both HTTP and HTTPS
- Preserves full request path during redirect
- Configurable domain mappings
- Environment variable support
- Logging of redirects

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Generate SSL certificates (for development):
```bash
npm run generate-certs
```

Note: For production, use proper SSL certificates from a trusted certificate authority.

## Configuration

You can configure the domain mappings in two ways:

1. Directly in `src/index.js` by modifying the `domainMappings` object
2. Using environment variables (recommended for production)

Example domain mapping format:
```javascript
{
    'example.com': 'https://api1.example.com',
    'test.com': 'https://api2.example.com'
}
```

### Environment Variables

- `HTTP_PORT`: Port for HTTP server (default: 3000)
- `HTTPS_PORT`: Port for HTTPS server (default: 3443)

## Usage

Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will start both HTTP and HTTPS servers. By default:
- HTTP server runs on port 3000
- HTTPS server runs on port 3443

## Example

If you have the following mapping:
```javascript
'example.com': 'https://api1.example.com'
```

A request to `http://example.com/users/123` or `https://example.com/users/123` will be redirected to `https://api1.example.com/users/123`

## Notes

- The server uses 301 (permanent) redirects
- If a domain is not found in the mappings, it will return a 404 response
- All HTTP methods (GET, POST, etc.) are supported
- For production use, replace the self-signed certificates with proper SSL certificates 