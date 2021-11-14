import fs from 'fs'

export class AccessControlService {
  private credentials: Array<{ username: string, password: string }> = []

  constructor (
    private readonly options: {
      allowAnonymous: boolean
      usersFilePath?: string
    }
  ) {
    if (!options.allowAnonymous && options.usersFilePath) {
      this.credentials = fs.readFileSync(options.usersFilePath)
        .toString()
        .split(/\n|\r|\r\n/)
        .map(line => {
          const [username, password] = line.split(':')
          return { username, password }
        })
    }
  }

  allowLoginFor (username: string, password: string): boolean {
    if (this.options.allowAnonymous) return true;
    const access = this.credentials.find(
      x => x.username === username && x.password === password
    )
    return Boolean(access);
  }
}
