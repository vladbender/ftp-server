import fs from 'fs'
import FtpSrv from 'ftp-srv'
import { AccessControlService } from '../AccessControlService'
import { EventsLogger, LogEvent } from '../EventsLogger'
import { LoggedFileSystem } from './LoggedFileSystem'

export class FTPServer {
  private server: FtpSrv | null = null;

  constructor (
    private readonly root: string,
    private readonly accessControl: AccessControlService,
    private readonly logger: EventsLogger,
  ) {
    if (!fs.existsSync(root)) {
      fs.mkdirSync(root, { recursive: true })
    }
  }

  public async run (host:string, port: number): Promise<void> {
    this.server = new FtpSrv({
      url: `ftp://${host}:${port}`
    })

    this.server.on('login', ({ connection, username, password }, resolve, reject) => {
      const payload = {
        username,
        password,
        src_ip: connection.ip,
        src_port: ""
      }
      if (!this.accessControl.allowLoginFor(username, password)) {
        this.logger.log(LogEvent.AUTH, {
          success: false,
          ...payload
        })
        reject(new Error('Wrong login or password'))
        return
      }

      this.logger.log(LogEvent.AUTH, {
        success: true,
        ...payload
      })

      resolve({
        root: this.root,
        fs: new LoggedFileSystem(connection, this.root, this.logger)
      })
    })
    return this.server.listen()
  }
}
