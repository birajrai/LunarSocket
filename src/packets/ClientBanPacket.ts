import BufWrapper from '@minecraft-js/bufwrapper';

import Packet from './Packet';

export default class ClientBanPacket extends Packet<ClientBan> {
  public static id = 1056;

  public constructor(buf?: BufWrapper) {
    super(buf);
  }

  public write(data: ClientBan): void {
    this.data = data;

    this.buf = new BufWrapper(null, { oneConcat: true });
    this.buf.writeVarInt(ClientBanPacket.id); // Packet ID

    this.buf.writeInt(data.id);
    this.buf.writeString(data.username);

    this.buf.writeInt(data.servers.length);
    for (const server of data.servers) {
      this.buf.writeString(server);
    }

    this.buf.finish();
  }

  public read(): void {
    const id = this.buf.readInt();
    const username = this.buf.readString();

    const serversLength = this.buf.readInt();
    const servers: string[] = [];
    for (let i = 0; i < serversLength; i++) {
      servers.push(this.buf.readString());
    }

    this.data = {
      id,
      username,
      servers,
    };
  }
}

interface ClientBan {
  id: number;
  username: string;
  servers: string[];
}
