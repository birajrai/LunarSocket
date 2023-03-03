import BufWrapper from '@minecraft-js/bufwrapper';

import Packet from './Packet';

export default class HostListPacket extends Packet<HostList> {
  public static id = 68;

  public constructor(buf?: BufWrapper) {
    super(buf);
  }

  public write(data: HostList): void {
    this.data = data;

    this.buf = new BufWrapper(null, { oneConcat: true });
    this.buf.writeVarInt(HostListPacket.id); // Packet ID

    this.buf.writeInt(data.hosts.length);
    for (const host of data.hosts) {
      this.buf.writeString(host);
    }

    this.buf.finish();
  }

  public read(): void {
    const hostsLength = this.buf.readInt();
    const hosts: string[] = [];
    for (let i = 0; i < hostsLength; i++) {
      hosts.push(this.buf.readString());
    }

    this.data = { hosts };
  }
}

interface HostList {
  hosts: string[];
}
