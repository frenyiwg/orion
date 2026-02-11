export class TokenManager {
  private static TOKEN = 'token';

  getToken(key: string = TokenManager.TOKEN): string | null {
    return localStorage.getItem(key);
  }

  setToken(token: string, key: string = TokenManager.TOKEN): void {
    localStorage.setItem(key, token);
  }

  removeToken(key: string = TokenManager.TOKEN): void {
    localStorage.removeItem(key);
  }
}
