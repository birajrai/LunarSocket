import BufWrapper from '@minecraft-js/bufwrapper';

import processColorCodes from '../utils/processColorCodes';
import Packet from './Packet';

export default class NotificationPacket extends Packet<Notification> {
  public static id = 3;

  public constructor(buf?: BufWrapper) {
    super(buf);
  }

  public write(data: Notification): void {
    this.data = data;

    this.buf = new BufWrapper(null, { oneConcat: true });
    this.buf.writeVarInt(NotificationPacket.id); // Packet ID

    this.buf.writeString(processColorCodes(data.title));
    this.buf.writeString(processColorCodes(data.message));

    this.buf.finish();
  }

  public read(): void {
    this.data = {
      title: this.buf.readString(),
      message: this.buf.readString(),
    };
  }
}

interface Notification {
  title: string;
  message: string;
}
