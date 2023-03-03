import BufWrapper from '@minecraft-js/bufwrapper';

import Packet from './Packet';

export default class DoEmotePacket extends Packet<DoEmote> {
  public static id = 39;

  public constructor(buf?: BufWrapper) {
    super(buf);
  }

  public write(data: DoEmote): void {
    this.data = data;

    this.buf = new BufWrapper(null, { oneConcat: true });
    this.buf.writeVarInt(DoEmotePacket.id); // Packet ID

    this.buf.writeInt(data.id);

    this.buf.finish();
  }

  public read(): void {
    this.data = {
      id: this.buf.readInt(),
    };
  }
}

interface DoEmote {
  id: number;
}
