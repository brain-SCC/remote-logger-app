# Example Config

You must create a file  `remote-logger.json` in your home directory.

```bash
touch ~/remote-logger.json
```

Edit this file by your prefered editor (vim, nano, vscode, sublime etc).

## Using .id_rsa key

If you connect to an server which is already in your `~/.ssh/config` you can simply use:

```json
{
  "host": "192.168.1.2",
  "port": 22,
  "username": "your-login"
}
```

## Using ssh-agent

If you have to deal with multiple SSH connections you should use an key pair for every host you connect to. It is also a good idea to protect your keys with an passphrase. You should consider use a ssh-agent. To enable ssh-agent usage, activate it with agent = true parameter.

```json
{
  "host": "192.168.1.2",
  "port": 22,
  "username": "your-login",
  "agent": true
}
```

## Using another keyfile (consider using ssh-agent instead)

If you specified an different ssh key than `.id_rsa` you can simply set it by:

```json
{
  "host": "192.168.1.2",
  "port": 22,
  "username": "your-login",
  "privateKey": "/full/path/to/your/private/key"
}
```

If your key is password protected, set your passphrase via:

```json
{
  "host": "192.168.1.2",
  "port": 22,
  "username": "your-login",
  "privateKey": "/full/path/to/your/private/key",
  "passphrase": "<your passphrase>"
}
```

Warning: `remote-logger.json` is unencrypted, everyone with read access to this file can read your passphrase!

## Using username + password connection (never ever do this in production!)

Warning: `remote-logger.json` is unencrypted, everyone with read access to this file can read your passphrase!

```json
{
  "host": "192.168.1.2",
  "port": 22,
  "username": "your-login",
  "password": "your-password"
}
```

## Maximum log entries displayed

You can define, how many log entries are displayed. If you don't set this value, as default 100 is used.

```json
{
  "maxLogEntries": 50,
}
```

## Debug (development only)

If you want to log the logger, you can enable debug mode with "debug": true. Be arware, windows will show strange behaviour if you enable logging.

```json
{
  "debug": true,
}
```

## Example Requests

```bash
curl -X POST -H "Content-Type: application/json" -d '{"level": "debug", "message": "Hello Debug", "type": "text", "context": {"email": "hello@foobar.ninja"}}' http://localhost:29980

curl -X POST -H "Content-Type: application/json" -d '{"level": "debug", "message": "Debug SQL", "type": "sql", "statement": "select * from foo where bar > 42;", "context": {}}' http://localhost:29980

```
