import BufWrapper from '@minecraft-js/bufwrapper';

import Packet from './Packet';

export default class HostListRequestPacket extends Packet<HostListRequest> {
  public static id = 67;

  public constructor(buf?: BufWrapper) {
    super(buf);
  }

  public write(data: HostListRequest): void {
    this.data = data;

    this.buf = new BufWrapper(null, { oneConcat: true });
    this.buf.writeVarInt(HostListRequestPacket.id); // Packet ID

    this.buf.finish();
  }

  public read(): void {
    this.data = {};
  }
}

interface HostListRequest {}
