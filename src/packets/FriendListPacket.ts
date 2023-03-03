import BufWrapper from '@minecraft-js/bufwrapper';

import Packet from './Packet';

export default class FriendListPacket extends Packet<FriendList> {
  public static id = 4;

  public constructor(buf?: BufWrapper) {
    super(buf);
  }

  public write(data: FriendList): void {
    this.data = data;

    this.buf = new BufWrapper(null, { oneConcat: true });
    this.buf.writeVarInt(FriendListPacket.id); // Packet ID

    this.buf.writeBoolean(data.consoleAccess);
    this.buf.writeBoolean(data.requestsEnabled);

    this.buf.writeInt(data.online.length);
    this.buf.writeInt(data.offline.length);

    for (const friend of data.online) {
      this.buf.writeString(friend.uuid);
      this.buf.writeString(friend.displayName);
      this.buf.writeInt(friend.unknownInt);
      this.buf.writeString(friend.status);
    }

    for (const friend of data.offline) {
      this.buf.writeString(friend.uuid);
      this.buf.writeString(friend.displayName);
      this.buf.writeLong(friend.offlineFor);
    }

    this.buf.finish();
  }

  public read(): void {
    const consoleAccess = this.buf.readBoolean();
    const requestsEnabled = this.buf.readBoolean();

    const onlineLength = this.buf.readInt();
    const offlineLength = this.buf.readInt();

    const online: FriendList['online'] = [];
    for (let i = 0; i < onlineLength; i++)
      online.push({
        uuid: this.buf.readString(),
        displayName: this.buf.readString(),
        unknownInt: this.buf.readInt(),
        status: this.buf.readString(),
      });

    const offline: FriendList['offline'] = [];
    for (let i = 0; i < offlineLength; i++)
      offline.push({
        uuid: this.buf.readString(),
        displayName: this.buf.readString(),
        offlineFor: this.buf.readLong() as number,
      });

    this.data = {
      consoleAccess,
      requestsEnabled,
      online,
      offline,
    };
  }
}

interface FriendList {
  consoleAccess: boolean;
  requestsEnabled: boolean;
  online: {
    uuid: string;
    displayName: string;
    unknownInt: number; // Version??
    status: string;
  }[];
  offline: { uuid: string; displayName: string; offlineFor: number }[];
}
