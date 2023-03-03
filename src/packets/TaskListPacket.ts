import BufWrapper from '@minecraft-js/bufwrapper';

import Packet from './Packet';

export default class TaskListPacket extends Packet<TaskList> {
  public static id = 36;

  public constructor(buf?: BufWrapper) {
    super(buf);
  }

  public write(data: TaskList): void {
    this.data = data;

    this.buf = new BufWrapper(null, { oneConcat: true });
    this.buf.writeVarInt(TaskListPacket.id); // Packet ID

    this.buf.writeInt(data.tasks.length);
    for (const task of data.tasks) {
      this.buf.writeString(task);
    }

    this.buf.finish();
  }

  public read(): void {
    const tasksLength = this.buf.readInt();
    const tasks: string[] = [];
    for (let i = 0; i < tasksLength; i++) {
      tasks.push(this.buf.readString());
    }

    this.data = { tasks };
  }
}

interface TaskList {
  tasks: string[];
}
