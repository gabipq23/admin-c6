enum LocalStorageKeys {
  // accessToken = "tim@accessToken",
  user = "c6@user",
}

type Keys = LocalStorageKeys;

class LocalStorageService {
  getItem(key: Keys): string | null {
    return localStorage.getItem(key);
  }

  setItem(key: Keys, value: string): void {
    localStorage.setItem(key, value);
  }

  removeItem(key: Keys): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}

export { LocalStorageKeys, LocalStorageService };
