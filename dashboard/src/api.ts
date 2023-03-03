import { ENDPOINTS, HOST } from './constants';
import store from './store';

export async function $fetch(
  endpoint: string,
  options: RequestInit = {},
  headers: HeadersInit = {}
) {
  return await fetch(HOST + endpoint, {
    headers: {
      Authorization: store.state.apiKey,
      ...headers,
    },
    ...options,
  });
}

export let wsPath = '';

export async function isKeyValid(key: string): Promise<boolean> {
  const response = await $fetch(
    ENDPOINTS.KEY,
    {},
    {
      Authorization: key,
    }
  );
  if (response.status === 200)
    await response.json().then((data) => (wsPath = data.wsPath));
  return response.status === 200;
}

export async function sendAction(action: string): Promise<void> {
  await $fetch(`${ENDPOINTS.ACTION}/${action}`, {
    method: 'POST',
  });
}

export async function sendMessage(
  player: string,
  message: string
): Promise<void> {
  await $fetch(
    ENDPOINTS.CHAT_MESSAGE,
    {
      method: 'POST',
      body: JSON.stringify({
        player,
        message,
      }),
    },
    {
      'Content-Type': 'application/json',
    }
  );
}

export async function setRole(player: string, role: string): Promise<void> {
  await $fetch(
    ENDPOINTS.ROLES,
    {
      method: 'PATCH',
      body: JSON.stringify({
        player,
        role,
      }),
    },
    {
      'Content-Type': 'application/json',
    }
  );
}

export async function kick(player: string): Promise<void> {
  await $fetch(
    ENDPOINTS.KICK,
    {
      method: 'POST',
      body: JSON.stringify({
        uuid: player,
      }),
    },
    {
      'Content-Type': 'application/json',
    }
  );
}

export async function crash(player: string): Promise<void> {
  await $fetch(
    ENDPOINTS.CRASH,
    {
      method: 'POST',
      body: JSON.stringify({
        uuid: player,
      }),
    },
    {
      'Content-Type': 'application/json',
    }
  );
}
