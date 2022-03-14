# Example Requests

```bash
curl -X POST -H "Content-Type: application/json" -d '{"level": "debug", "message": "Hello Debug", "type": "text", "context": {"email": "hello@foobar.ninja"}}' http://localhost:29980

curl -X POST -H "Content-Type: application/json" -d '{"level": "debug", "message": "Debug SQL", "type": "sql", "statement": "select * from foo where bar > 42;", "context": {}}' http://localhost:29980

```