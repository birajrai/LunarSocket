import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { DatabaseManager } from '../databases/Manager';
import logger from './logger';
import mergeObjects from './mergeObjects';
import { Role } from './roles';

const configPath = join(process.cwd(), 'config.json');

export function initConfig(): Config {
  if (!statSync(configPath, { throwIfNoEntry: false })) {
    writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));

    logger.log('Default config file created at', configPath);
    logger.log(
      'You can now edit the config to your liking. Once edited, run LunarSocket again.'
    );
    process.exit(0);
  }

  return getConfigSync();
}

export async function getConfig(): Promise<Config> {
  return mergeObjects(
    defaultConfig,
    JSON.parse(await readFile(configPath, 'utf-8'))
  );
}

export default getConfig;

export function getConfigSync(): Config {
  return mergeObjects(
    defaultConfig,
    JSON.parse(readFileSync(configPath, 'utf-8'))
  );
}

export async function editConfig(newConfig: Config): Promise<void> {
  await writeFile(configPath, JSON.stringify(newConfig, null, 2));
}

const defaultConfig = {
  server: {
    port: 80,
    secure: false,
    websocketPath: '/connect',
    certificates: {
      key: '',
      cert: '',
    },
  },
  api: {
    enabled: false,
    authorization: 'MySuperPassword156',
  },
  whitelist: {
    enabled: false,
    list: [] as string[],
  },
  welcomeMessage: 'LunarSocket made by SolarTweaks with love <3',
  operators: [] as string[],
  database: {
    type: 'instanceStorage' as keyof typeof DatabaseManager.constructors,
    config: {
      mongo: 'mongodb://<password>@localhost:27017',
      filePath: 'FileStorage.json',
    },
  },
  blacklist: {
    list: [] as string[],
  },
  roles: {
    default: {
      console: false,
      iconColor: 0xffffff,
      plusColor: 0x00ff00,
      permissions: [],
    },
  } as {
    [key: string]: Role;
    default: Role;
  },
  commands: {
    stop: '',
    restart: '',
  },
};

type Config = typeof defaultConfig;
