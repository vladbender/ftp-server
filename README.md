
# Node FTP Server

Test task: write ftp server on Node.js with logging some events.

Build and run:
```bash
docker build -t ftp-srv-node .
docker run -d --network host -v <local_directory>:/app/files ftp-srv-node
```

The FTP server will be run on port provided in .env file.

`<local_directory>` - host directory, which is used for keeping files. You can run a container without the -v parameter. In that case, files will be saved inside the container.

`.env` file description:
- `HOST` - server host.
- `PORT` - server port.
- `ALLOW_ANONYMOUS` - should the server allow access for all users. If provided `TRUE` access will be allowed. If provided `FALSE`, access will be allowed only for users in the `USERS_FILE_PATH` file.
- `USERS_FILE_PATH` - path to the file with logins and passwords. Each line should be in the format `<login>:<password>`. Now you have an example file `users`.
- `LOG_FILE_PATH` - path to the file, which will contain logs of occurred events. You can mount it to container, but now the file created only inside it.

Some notes:
- Events logs at the start of an event. If something fails, a log will be kept. For example, if download fails.
- I have added the `file:rename` event because directories have the same.
- I have changed the format of `dir:rename` and `file:rename` events. `path` parameter was removed. `from` and `to` parameters have been added. In that case, we will know which file was renamed.
- I have added the unix timestamp of the event to the log.
- The program doesn't catch all possible errors. For example, errors with the file system. At this point, I did only happy path.
