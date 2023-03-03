import { readFile, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { CustomCosmetic } from '../api/routes/customCosmetics';
import Player, { DatabasePlayer } from '../player/Player';
import getConfig from '../utils/config';
import logger from '../utils/logger';
import Database from './Database';

export default class FileStorage extends Database {
  private filePath: string;
  private file: { [key: string]: DatabasePlayer | CustomCosmetic[] };

  public constructor() {
    super();

    this.init().catch((reason) => {
      logger.error('An error occured while initializing FileStorage\n', reason);
      logger.error("Can't proceed without a working database, exiting...");
      process.exit(1);
    });
  }

  private async init(): Promise<void> {
    this.filePath =
      (await getConfig().then((data) =>
        data.database.config.filePath.startsWith('.')
          ? join(process.cwd(), data.database.config.filePath)
          : data.database.config.filePath
      )) || join(process.cwd(), 'storage.json');
    this.file = {
      customCosmetics: [],
    };

    if (!(await stat(this.filePath).catch(() => undefined))) {
      await this.writeFile();
    }

    const file = await readFile(this.filePath, 'utf8');
    this.file = JSON.parse(file);
  }

  private async writeFile(): Promise<void> {
    await writeFile(this.filePath, JSON.stringify(this.file));
  }

  public async setPlayer(player: Player): Promise<void> {
    await this.setPlayerRaw(player.uuid, player.getDatabasePlayer());
  }

  public async setPlayerRaw(
    uuid: string,
    player: DatabasePlayer
  ): Promise<void> {
    this.file[uuid] = player;
    await this.writeFile();
  }

  public getPlayer(uuid: string): DatabasePlayer {
    return this.file[uuid] as DatabasePlayer;
  }

  public getPlayerCount(): number {
    // `- 1` because of the `customCosmetics` key
    return Object.keys(this.file).length - 1;
  }

  public getCustomCosmetics(): CustomCosmetic[] {
    return this.file.customCosmetics as CustomCosmetic[];
  }

  public getRoleDistribution(): { [role: string]: number } {
    const roles = {};
    for (const role of Object.values(this.file).map((user) =>
      Array.isArray(user) ? 'default' : user.role
    )) {
      if (role !== 'default') {
        roles[role] ??= 0;
        roles[role]++;
      }
    }
    return roles;
  }
}
