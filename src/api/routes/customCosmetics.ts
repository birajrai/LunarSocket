import * as express from 'express';
import { Router } from 'express';
import { join } from 'node:path';
import { DatabaseManager } from '../../databases/Manager';

const customCosmeticsRounter = Router();

const path = join(__dirname, '..', '..', '..', 'cosmetics');
customCosmeticsRounter.use('/cosmetic', express.static(path));

customCosmeticsRounter.get('/index', async (request, response) => {
  response.send(await DatabaseManager.instance.database.getCustomCosmetics());
});

export default customCosmeticsRounter;

export type CosmeticCategory =
  | 'cloak'
  | 'event'
  | 'hat'
  | 'bodywear'
  | 'backpack'
  | 'glasses'
  | 'bandanna'
  | 'neckwear'
  | 'pet'
  | 'mask'
  | 'dragon_wings';

export interface CustomCosmetic {
  name: string;
  animated: boolean;
  category: CosmeticCategory;
  model?: string;
  modelPath: string;
}
