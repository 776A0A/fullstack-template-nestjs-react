const TOKEN_KEY = 'token';

export const token = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  remove: () => localStorage.removeItem(TOKEN_KEY),
  isAuthenticated: () => localStorage.getItem(TOKEN_KEY) != null,
};
