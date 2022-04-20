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

> Help Welcome:
>
> Parsing `~/.ssh/config` could make config much more easier. Feel free to add this functionality.


## using another keyfile

If you specified an different ssh key than `.id_rsa` you can simply set it by:

```json
{
  "host": "192.168.1.2",
  "port": 22,
  "username": "your-login",
  "privateKey": "/full/path/to/your/private/key"
}
```
## using a password protected keyfile

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

> Help Welcome:
>
> Ssh connection could make use of a running ssh-agent. Feel free to add this functionality.

## using a username + password connection

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