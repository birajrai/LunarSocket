import getConfig from './config';

export interface Role {
  console: boolean;
  iconColor: number;
  plusColor: number;
  permissions: string[];
}

export async function getRole(
  name: string
): Promise<{ default: boolean; role: Role }> {
  const config = await getConfig();

  if (config.roles[name])
    return { default: name === 'default', role: config.roles[name] };
  return { default: true, role: config.roles.default };
}
