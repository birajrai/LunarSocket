import { isIP } from 'node:net';

export default class ServerString {
  public isEmpty = false;
  public port = 25565; // Default port of a Minecraft server
  public isIpV4 = false;
  public isIpV6 = false;
  public isDomain = false;
  public subDomain = '';
  public domain = '';
  public topLevelDomain = '';

  public server: string;

  public static portRegex = /:(\d{1,5})/;
  public static specialRules = [
    [
      'hypixel.net',
      'ilovecatgirls.xyz',
      'hypixel.net.hypixel.io',
      'mc.hypixel.net',
    ],
  ];

  public constructor(server: string) {
    this.server = server;

    if (this.server.length === 0) {
      this.isEmpty = true;
      return;
    }

    const portMatch = ServerString.portRegex.exec(server);
    if (portMatch) {
      this.port = parseInt(portMatch[0], 10);
      this.server = this.server.replace(portMatch[0], '');
    }

    const isIp = isIP(this.server);
    this.isIpV4 = isIp === 4;
    this.isIpV6 = isIp === 6;
    if (this.isIpV4 || this.isIpV6) return;

    const domain = this.server.split('.');

    if (domain.length === 2) {
      // Something like `server.net`
      this.isDomain = true;
      this.domain = domain[0];
      this.topLevelDomain = domain[1];
      return;
    }

    if (domain.length === 3) {
      // Something like `mc.server.net`
      this.isDomain = true;

      if (domain[1] === 'co' && domain[2] === 'uk') {
        this.domain = domain[0];
        this.topLevelDomain = domain[2];
        return;
      }

      this.subDomain = domain[0];
      this.domain = domain[1];
      this.topLevelDomain = domain[2];
      return;
    }

    if (domain.length === 4) {
      // Something like `mc.server.co.uk`
      this.isDomain = true;
      this.subDomain = domain[0];
      this.domain = domain[1];
      this.topLevelDomain = `${domain[2]}.${domain[3]}`;
      return;
    }
  }

  public static match(
    server1: ServerString | string,
    server2: ServerString | string
  ): boolean {
    if (typeof server1 === 'string') server1 = new ServerString(server1);
    if (typeof server2 === 'string') server2 = new ServerString(server2);

    if (server1.isEmpty && server2.isEmpty) return true;
    if (server1.isIpV4 && server1.isIpV4 && server1.server === server2.server)
      return true;
    if (server1.isIpV6 && server1.isIpV6 && server1.server === server2.server)
      return true;

    if (server1.isDomain && server2.isDomain) {
      // Yes we are ignoring subdomains
      if (
        server1.domain === server2.domain &&
        server1.topLevelDomain === server2.topLevelDomain
      )
        return true;

      for (const specialRule of ServerString.specialRules) {
        if (specialRule.includes(`${server1.domain}.${server1.topLevelDomain}`))
          if (
            specialRule.includes(`${server2.domain}.${server2.topLevelDomain}`)
          )
            return true;

        if (
          specialRule.includes(server1.server) &&
          specialRule.includes(server2.server)
        )
          return true;
      }
    }

    return false;
  }
}
