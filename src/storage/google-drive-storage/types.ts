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
