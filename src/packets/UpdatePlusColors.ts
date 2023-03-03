import BufWrapper from '@minecraft-js/bufwrapper';

import Packet from './Packet';

export default class UpdatePlusColorsPacket extends Packet<UpdatePlusColors> {
  public static id = 73;

  public constructor(buf?: BufWrapper) {
    super(buf);
  }

  public write(data: UpdatePlusColors): void {
    this.data = data;

    this.buf = new BufWrapper(null, { oneConcat: true });
    this.buf.writeVarInt(UpdatePlusColorsPacket.id); // Packet ID

    this.buf.writeVarInt(data.colors.length);
    for (const i of data.colors) this.buf.writeInt(i);

    this.buf.finish();
  }

  public read(): void {
    const colorsLength = this.buf.readVarInt();
    const colors: number[] = [];
    for (let i = 0; i < colorsLength; i++)
        colors.push(this.buf.readInt());

    this.data = {
      colors,
    };
  }
}

interface UpdatePlusColors {
  colors: number[];
}
