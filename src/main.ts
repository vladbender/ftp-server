
import path from 'path'
import { FTPServer } from './server'
import { AccessControlService } from './AccessControlService'
import { Config } from './Config'
import { EventsLogger } from './EventsLogger'

const main = () => {
  const config = new Config(path.join(__dirname, '../.env'))
  const accessControl = new AccessControlService({
    allowAnonymous: config.allowAnonymous,
    usersFilePath: config.usersFilePath
  })
  const logger = new EventsLogger(config.logFilePath)
  const server = new FTPServer(config.rootFtpDir, accessControl, logger)
  const { host, port } = config
  server.run(host, port)
    .then(() => console.log(`FTP server started at ${host}:${port}`))
    .catch(console.error)
}

main()
