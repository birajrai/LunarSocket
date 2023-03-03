import getConfig from '../utils/config';
import logger from '../utils/logger';
import FileStorage from './FileStorage';
import InstanceStorage from './InstanceStorage';
import Mongo from './Mongo';

class DatabaseManager {
  public static constructors = {
    instanceStorage: InstanceStorage,
    mongo: Mongo,
    fileStorage: FileStorage,
  } as const;
  public static instance = new DatabaseManager();

  public database: InstanceType<
    typeof DatabaseManager.constructors[keyof typeof DatabaseManager.constructors]
  >;
  private constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    const config = await getConfig();

    logger.log('Using database:', config.database.type);

    this.database = new DatabaseManager.constructors[config.database.type]();
  }

  public async getRoleDistribution(): Promise<{
    [role: string]: { amount: number; color: string };
  }> {
    const config = await getConfig();
    const data = await this.database.getRoleDistribution();
    const roles = Object.keys(data);
    const final = {};
    for (const role of roles) {
      final[role] = {
        amount: data[role],
        color: `#${(
          ((typeof config.roles[role].iconColor === 'string'
            ? config.roles[role].iconColor
            : config.roles[role].iconColor?.toString()) as string) ??
          `0x${['6', '7', '8', '9', 'a', 'b', 'c'][
            Math.floor(Math.random() * 7)
          ].repeat(6)}`
        ).substring(2)}`,
      };
    }
    return final;
  }
}

export default DatabaseManager.instance;
export { DatabaseManager };
