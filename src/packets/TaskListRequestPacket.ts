import BufWrapper from '@minecraft-js/bufwrapper';

import Packet from './Packet';

export default class TaskListRequestPacket extends Packet<TaskListRequest> {
  public static id = 35;

  public constructor(buf?: BufWrapper) {
    super(buf);
  }

  public write(data: TaskListRequest): void {
    this.data = data;

    this.buf = new BufWrapper(null, { oneConcat: true });
    this.buf.writeVarInt(TaskListRequestPacket.id); // Packet ID

    this.buf.finish();
  }

  public read(): void {
    this.data = {};
  }
}

interface TaskListRequest {}
