import fs from 'fs'
import dotenv from 'dotenv'

export class Config {
  constructor (path: string) {
    if (!fs.existsSync(path)) {
      throw new Error(`Config file "${path}" doesn't exists`)
    }
    dotenv.config({ path })
  }

  get host (): string {
    const host = process.env.HOST
    if (!host) {
      throw new Error('Host not specified')
    }
    return host
  }

  get port (): number {
    const port = Number(process.env.PORT)
    if (Number.isNaN(port)) {
      throw new Error(`Wrong port ${port}`)
    }
    return port
  }

  get allowAnonymous (): boolean {
    const allow = String(process.env.ALLOW_ANONYMOUS)
    return allow.toLowerCase() === 'true'
  }

  get usersFilePath (): string {
    return process.env.USERS_FILE_PATH || ''
  }

  get rootFtpDir (): string {
    if (!process.env.ROOT_FTP_DIR) {
      throw new Error('ROOT_FTP_DIR not specified')
    }
    return process.env.ROOT_FTP_DIR
  }

  get logFilePath (): string {
    if (!process.env.LOG_FILE_PATH) {
      throw new Error('LOG_FILE_PATH not specified')
    }
    return process.env.LOG_FILE_PATH
  }
}

