import BufWrapper from '@minecraft-js/bufwrapper';

import Packet from './Packet';

export default class FriendRequestPacket extends Packet<FriendRequest> {
  public static id = 9;

  public constructor(buf?: BufWrapper) {
    super(buf);
  }

  public write(data: FriendRequest): void {
    this.data = data;

    this.buf = new BufWrapper(null, { oneConcat: true });
    this.buf.writeVarInt(FriendRequestPacket.id); // Packet ID

    this.buf.writeString(data.uuid);
    this.buf.writeString(data.name);

    this.buf.finish();
  }

  public read(): void {
    this.data = {
      uuid: this.buf.readString(),
      name: this.buf.readString(),
    };
  }
}

interface FriendRequest {
  uuid: string;
  name: string;
}
