import fs from 'fs'
import path from 'path'
import { FileSystem as LibFileSystem, FtpConnection } from 'ftp-srv'
import { EventsLogger, LogEvent } from '../EventsLogger';

export class LoggedFileSystem extends LibFileSystem {
  private readonly payload: { src_ip: string, src_port: string }

  constructor (
    connection: FtpConnection,
    root: string,
    private logger: EventsLogger
  ) {
    super(connection, { root, cwd: null });
    this.payload = {
      src_ip: connection.ip,
      src_port: ''
    }
  }

  public mkdir (name: string) {
    this.logger.log(LogEvent.DIR_CREATE, {
      path: path.join(this.root, this.currentDirectory(), name),
      ...this.payload
    })
    return super.mkdir(name)
  }

  public rename (from: string, to: string) {
    const pathFrom = path.join(this.root, this.currentDirectory(), from)
    const pathTo = path.join(this.root, this.currentDirectory(), to)
    const event = this.isDirectory(pathFrom) ? LogEvent.DIR_RENAME : LogEvent.FILE_RENAME
    this.logger.log(event, {
      from: pathFrom,
      to: pathTo,
      ...this.payload
    })
    return super.rename(from, to)
  }

  public write (filename: string, options: any) {
    this.logger.log(LogEvent.FILE_UPLOAD, {
      path: path.join(this.root, this.currentDirectory(), filename),
      ...this.payload
    })
    return super.write(filename, options)
  }

  public read (filename: string, options: any) {
    this.logger.log(LogEvent.FILE_DOWNLOAD, {
      path: path.join(this.root, this.currentDirectory(), filename),
      ...this.payload
    })
    return super.read(filename, options)
  }

  public delete (name: string) {
    const delPath = path.join(this.root, this.currentDirectory(), name)
    const event = this.isDirectory(delPath) ? LogEvent.DIR_DELETE : LogEvent.FILE_DELETE
    this.logger.log(event, {
      path: delPath,
      ...this.payload
    })
    return super.delete(name)
  }

  private isDirectory (path: string) {
    return fs.lstatSync(path).isDirectory()
  }
}
