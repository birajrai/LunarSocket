import BufWrapper from '@minecraft-js/bufwrapper';

import Packet from './Packet';

export default class KeepAlivePacket extends Packet<KeepAlive> {
  public static id = 64;

  public constructor(buf?: BufWrapper) {
    super(buf);
  }

  public write(data: KeepAlive): void {
    this.data = data;

    this.buf = new BufWrapper(null, { oneConcat: true });
    this.buf.writeVarInt(KeepAlivePacket.id); // Packet ID

    this.buf.writeVarInt(Object.keys(data.mods).length);
    for (const key in data.mods) {
      this.buf.writeString(key);
      this.buf.writeBoolean(data.mods[key]);
    }

    this.buf.writeString(data.game);

    this.buf.finish();
  }

  public read(): void {
    const modsLength = this.buf.readVarInt();
    const mods = {};
    for (let i = 0; i < modsLength; i++) {
      const key = this.buf.readString();
      mods[key] = this.buf.readBoolean();
    }

    const game = this.buf.readString();

    this.data = {
      mods,
      game,
    };
  }
}

interface KeepAlive {
  mods: { [key: string]: boolean };
  game: string;
}
