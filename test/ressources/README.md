# Example SSH Keys generated only for test

WARNING: Never add ssh keys to your vcs (git, svn...)  Never!

```bash
# ed25519 key without passphrase
ssh-keygen -t ed25519 -a 420 -C "sample ed25519 key" -f id_ed25519

# rsa key with passphrase "S3cRet!"
ssh-keygen -t rsa -C "sample rsa key" -f id_rsa
```
