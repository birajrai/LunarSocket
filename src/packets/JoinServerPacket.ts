import BufWrapper from '@minecraft-js/bufwrapper';

import Packet from './Packet';

export default class JoinServerPacket extends Packet<JoinServer> {
  public static id = 6;

  public constructor(buf?: BufWrapper) {
    super(buf);
  }

  public write(data: JoinServer): void {
    this.data = data;

    this.buf = new BufWrapper(null, { oneConcat: true });
    this.buf.writeVarInt(JoinServerPacket.id); // Packet ID

    this.buf.writeString(data.uuid);
    this.buf.writeString(data.server);

    this.buf.finish();
  }

  public read(): void {
    this.data = {
      uuid: this.buf.readString(),
      server: this.buf.readString(),
    };
  }
}

interface JoinServer {
  uuid: string;
  server: string;
}
