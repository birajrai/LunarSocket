import { emitToDashboard } from '../api';

export const events = [] as Event[];

export type EventType =
  | 'login'
  | 'logout'
  | 'role-set'
  | 'start'
  | 'stop'
  | 'restart'
  | 'kill'
  | 'update';

export interface Event {
  type: EventType;
  value: string;
}

export function registerEvent(type: EventType, value: string) {
  events.push({
    type,
    value,
  });
  emitToDashboard('event', {
    type,
    value,
  });
}
