import axios from 'axios';

export function getLunarMetadata(): Promise<any> {
  return axios
    .post('https://api.lunarclientprod.com/launcher/launch', {
      hwid: 'not supplied',
      os: 'win32',
      arch: 'x64',
      version: '1.8.9',
      branch: 'master',
      launch_type: 'OFFLINE',
      classifier: 'optifine',
    })
    .then((res) => res.data);
}

export async function getAssetsIndex(): Promise<AssetsIndex> {
  const textures = (await getLunarMetadata()).textures;

  return await axios.get(textures.indexUrl).then((res) => {
    const files = res.data.split('\n').map((line) => {
      const parts = line.split(' ');
      return {
        path: parts[0],
        sha1: parts[1],
      };
    });

    return { baseUrl: textures.baseUrl, files };
  });
}

export async function fetchCosmeticsIndex(): Promise<Cosmetic[]> {
  const assetsIndex = await getAssetsIndex();
  const entry = assetsIndex.files.find(
    (f) => f.path === 'assets/lunar/cosmetics/index'
  );

  const url = assetsIndex.baseUrl + entry.sha1;

  return await axios
    .get(url)
    .then((res) => res.data)
    .then((data) =>
      data.split('\n').map((line) => {
        const parts = line.split(',');
        return {
          id: parseInt(parts[0]),
          name: parts[3],
          animated: Boolean(parts[5]),
          category: parts[6],
          type: parts[7],
          resource: parts[8],
        };
      })
    );
}

let cosmeticsIndex: Cosmetic[];
let cosmeticsUpdated = 0;

export async function getCosmeticsIndex(): Promise<Cosmetic[]> {
  // If it's been more than an hour since last fetch, update
  if (Date.now() - cosmeticsUpdated > 3600000) {
    // Set the date before fetching just in case multiple people join at the same time and cause this to be ran twice
    cosmeticsUpdated = Date.now();
    cosmeticsIndex = await fetchCosmeticsIndex();
  }

  return cosmeticsIndex;
}

export interface Cosmetic {
  id: number;
  resource: string;
  name: string;
  type: string;
  animated: boolean;
  category:
    | 'cloak'
    | 'hat'
    | 'bodywear'
    | 'neckwear'
    | 'mask'
    | 'bandanna'
    | 'dragon_wings'
    | 'backpack';
}

interface AssetsIndexEntry {
  path: string;
  sha1: string;
}

interface AssetsIndex {
  baseUrl: string;
  files: AssetsIndexEntry[];
}
