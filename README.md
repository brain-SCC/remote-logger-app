# Example Config

You must create a file  `remote-logger.json` in your home directory.

```bash
touch ~/remote-logger.json
```

Edit this file by your prefered editor (vim, nano, vscode, sublime etc).

## using .id_rsa key

If you connect to an server which is already in your `~/.ssh/config` you can simply use: 

```json
{
  "host": "192.168.1.2",
  "port": 22,
  "username": "your-login"
}
```

## using ssh-agent

If you have to deal with multiple SSH connections you should use an key piar for every host you connect to. It is also a good idea to protect your keys with an passphrase. You should consider use a ssh-agent. To enable ssh-agent usage, activate it with agent = true parameter.

```json
{
  "host": "192.168.1.2",
  "port": 22,
  "username": "your-login",
  "agent": true
}
```

## using another keyfile (consider using ssh-agent instead)

If you specified an different ssh key than `.id_rsa` you can simply set it by:

```json
{
  "host": "192.168.1.2",
  "port": 22,
  "username": "your-login",
  "privateKey": "/full/path/to/your/private/key"
}
```

## using a password protected keyfile (don't do this, really! use ssh-agent instead)

Warning: `remote-logger.json` is unencrypted, everyone with read access to this file can read your passphrase! 

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

## using a username + password connection (never ever do this in production!)

Warning: `remote-logger.json` is unencrypted, everyone with read access to this file can read your passphrase!

```json
{
  "host": "192.168.1.2",
  "port": 22,
  "username": "your-login",
  "password": "your-password"
}
```

# Example Requests

```bash
curl -X POST -H "Content-Type: application/json" -d '{"level": "debug", "message": "Hello Debug", "type": "text", "context": {"email": "hello@foobar.ninja"}}' http://localhost:29980

curl -X POST -H "Content-Type: application/json" -d '{"level": "debug", "message": "Debug SQL", "type": "sql", "statement": "select * from foo where bar > 42;", "context": {}}' http://localhost:29980

```