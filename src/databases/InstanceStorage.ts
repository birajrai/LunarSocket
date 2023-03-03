import { CustomCosmetic } from '../api/routes/customCosmetics';
import Player, { DatabasePlayer } from '../player/Player';
import Database from './Database';

export default class InstanceStorage extends Database {
  private database: Map<string, DatabasePlayer>;
  private customCosmetics: CustomCosmetic[];

  public constructor() {
    super();
    this.database = new Map<string, DatabasePlayer>();
    this.customCosmetics = [];
  }

  public setPlayer(player: Player): void {
    this.setPlayerRaw(player.uuid, player.getDatabasePlayer());
  }

  public setPlayerRaw(uuid: string, player: DatabasePlayer): void {
    this.database.set(uuid, player);
  }

  public getPlayer(uuid: string): DatabasePlayer {
    return this.database.get(uuid);
  }

  public getPlayerCount(): number {
    return Object.keys(this.database).length;
  }

  public getCustomCosmetics(): CustomCosmetic[] {
    return this.customCosmetics;
  }

  public getRoleDistribution(): { [role: string]: number } {
    const roles = {};
    for (const role of [...this.database.values()].map((user) => user.role)) {
      if (role !== 'default') {
        roles[role] ??= 0;
        roles[role]++;
      }
    }
    return roles;
  }
}
