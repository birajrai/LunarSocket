import { Collection, MongoClient } from 'mongodb';
import { CustomCosmetic } from '../api/routes/customCosmetics';
import Player, { DatabasePlayer } from '../player/Player';
import CallQueue from '../utils/CallQueue';
import getConfig from '../utils/config';
import logger from '../utils/logger';
import Database from './Database';

export default class Mongo extends Database {
  private isConnected: boolean;
  private client: MongoClient;
  private playerCollection: Collection;
  private customCosmeticsCollection: Collection;
  private queue: CallQueue<
    { uuid: string; player: DatabasePlayer },
    (player: { uuid: string; player: DatabasePlayer }) => Promise<void>
  >;

  public constructor() {
    super();

    this.isConnected = false;
    this.queue = new CallQueue(this.emptyQueue);
    this.init().catch((reason) => {
      logger.error('An error occured while initializing Mongo\n', reason);
      logger.error("Can't proceed without a working database, exiting...");
      process.exit(1);
    });
  }

  private async init(): Promise<void> {
    const config = await getConfig();

    this.client = new MongoClient(config.database.config.mongo);
    await this.client.connect();
    const db = this.client.db('LunarSocket');
    this.playerCollection = db.collection('players');
    this.customCosmeticsCollection = db.collection('customCosmetics');

    this.isConnected = true;
    logger.log('Connected to MongoDB');

    this.queue.emptyQueue();
  }

  private async emptyQueue({
    uuid,
    player,
  }: {
    uuid: string;
    player: DatabasePlayer;
  }): Promise<void> {
    await this.setPlayerRaw(uuid, player);
  }

  public async setPlayer(player: Player): Promise<void> {
    return await this.setPlayerRaw(player.uuid, player.getDatabasePlayer());
  }

  public async setPlayerRaw(
    uuid: string,
    player: DatabasePlayer
  ): Promise<void> {
    // If not connected, push the player instance into the queue
    // Once the connection will be established, the setPlayer
    // method will be called again with the player instance
    if (!this.isConnected) return this.queue.push([{ uuid, player }]);

    const existingPlayer = await this.getPlayer(uuid);

    if (existingPlayer)
      return (await this.playerCollection.updateOne(
        { uuid },
        {
          $set: player,
          // Removing all fields
          $unset: { color: null, plusColor: null, premium: null },
        }
      )) as unknown as void;
    else
      return (await this.playerCollection.insertOne({
        // Mango specific data, used to get the player
        uuid,
        ...player,
      })) as unknown as void;
  }

  public async getPlayer(uuid: string): Promise<DatabasePlayer> {
    return await this.playerCollection.findOne<DatabasePlayer>({ uuid });
  }

  public async getPlayerCount(): Promise<number> {
    return await this.playerCollection.countDocuments();
  }

  public async getCustomCosmetics(): Promise<CustomCosmetic[]> {
    return (await this.customCosmeticsCollection
      .find()
      .toArray()) as unknown as CustomCosmetic[];
  }

  public async getRoleDistribution(): Promise<{ [role: string]: number }> {
    const roleNames = Object.keys((await getConfig()).roles).filter(
      (role) => role !== 'default'
    );
    const roles = {};
    await Promise.all(
      roleNames.map((role) =>
        this.playerCollection.countDocuments({ role }).then((amount) => {
          roles[role] = amount;
        })
      )
    );
    return roles;
  }
}
