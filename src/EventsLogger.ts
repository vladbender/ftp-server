import path from 'path'
import fs from 'fs'

export enum LogEvent {
  AUTH = 'auth',
  FILE_UPLOAD = 'file:upload',
  FILE_DOWNLOAD = 'file:download',
  FILE_DELETE = 'file:delete',
  FILE_RENAME = 'file:rename',
  DIR_CREATE = 'dir:create',
  DIR_DELETE = 'dir:delete',
  DIR_RENAME = 'dir:rename',
}

type FILES_AND_DIRS_EVENTS = LogEvent.DIR_CREATE | LogEvent.DIR_DELETE |
  LogEvent.FILE_DELETE | LogEvent.FILE_DOWNLOAD | LogEvent.FILE_UPLOAD
type RENAME_EVENTS = LogEvent.DIR_RENAME | LogEvent.FILE_RENAME

type CommonPayload = { src_ip: string, src_port: string }
type AuthPayload = { success: boolean, username: string, password: string }
type FilesAndDirsPayload = { path: string }
type RenamePayload = { from: string, to: string }

export class EventsLogger {
  private readonly file: fs.WriteStream

  constructor (
    logFilePath: string
  ) {
    // TODO закрытие стрима при оcтановке приложения?
    const dirname = path.dirname(logFilePath)
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true })
    }
    this.file = fs.createWriteStream(logFilePath, { flags: 'a+' })
  }

  public log (event: LogEvent.AUTH,         payload: AuthPayload & CommonPayload): void
  public log (event: FILES_AND_DIRS_EVENTS, payload: FilesAndDirsPayload & CommonPayload): void
  public log (event: RENAME_EVENTS,         payload: RenamePayload & CommonPayload): void
  public log (event: LogEvent,              payload: Record<string, unknown>) {
    const message = { event, date: new Date().getTime(), ...payload }
    console.log(message)
    this.file.write(JSON.stringify(message) + '\n', (error) => {
      if (error) {
        console.error('Error while writing log: ', error)
      }
    })
  }
}
