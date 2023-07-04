export interface GoogleDriveAuth {
  authUri: string;
  clientId: string;
  scope: string;
}

export interface GoogleDriveAuthResponse {
  expiresIn?: string;
  accessToken?: string;
  error?: string;
}
