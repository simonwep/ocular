export interface StorageSync<T> {
  name: string;
  state(): T;
  push(data: T): void;
}

export interface Storage {
  sync<T>(config: StorageSync<T>): void;
}

export interface GoogleDriveAuth {
  authUri: string;
  clientId: string;
  scope: string;
}

export interface GoogleDriveAuthReponse {
  expiresIn?: string;
  accessToken?: string;
  error?: string;
}
