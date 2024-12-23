import { uuid } from './uuid';

export function generateRequestId(): string {
  return uuid();
}
