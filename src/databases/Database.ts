import { CustomCosmetic } from '../api/routes/customCosmetics';
import Player, { DatabasePlayer } from '../player/Player';

export default class Database {
  // skipcq
  public setPlayer(player: Player): Promise<void> | void {
    console.warn('Database#setPlayer is not implemented');
  }

  // skipcq
  public setPlayerRaw(
    uuid: string,
    player: DatabasePlayer
  ): Promise<void> | void {
    console.warn('Database#setPlayerRaw is not implemented');
  }

  // skipcq
  public getPlayer(uuid: string): Promise<DatabasePlayer> | DatabasePlayer {
    console.warn('Database#getPlayer is not implemented');
    return null;
  }

  // skipcq
  public getPlayerCount(): Promise<number> | number {
    console.warn('Database#getPlayerCount is not implemented');
    return null;
  }

  // skipcq
  public getCustomCosmetics(): Promise<CustomCosmetic[]> | CustomCosmetic[] {
    console.warn('Database#getCustomCosmetics is not implemented');
    return null;
  }

  // skipcq
  public getRoleDistribution():
    | Promise<{ [role: string]: number }>
    | { [role: string]: number } {
    console.warn('Database#getRoleDistribution is not implemented');
    return null;
  }
}
