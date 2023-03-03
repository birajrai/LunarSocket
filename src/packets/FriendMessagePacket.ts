import BufWrapper from '@minecraft-js/bufwrapper';

import Packet from './Packet';

export default class FriendMessagePacket extends Packet<FriendMessage> {
  public static id = 5;

  public constructor(buf?: BufWrapper) {
    super(buf);
  }

  public write(data: FriendMessage): void {
    this.data = data;

    this.buf = new BufWrapper(null, { oneConcat: true });
    this.buf.writeVarInt(FriendMessagePacket.id); // Packet ID

    this.buf.writeString(data.uuid);
    this.buf.writeString(data.message);

    this.buf.finish();
  }

  public read(): void {
    this.data = {
      uuid: this.buf.readString(),
      message: this.buf.readString(),
    };
  }
}

interface FriendMessage {
  uuid: string;
  message: string;
}
