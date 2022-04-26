import { GoogleDriveAuthReponse } from '@storage/google-drive-storage/types';

export const parseOAuth2Login = (): GoogleDriveAuthReponse | undefined => {
  if (location.hash.length > 1) {
    const params = new URLSearchParams(location.hash.slice(1));
    const expiresIn = params.get('expires_in') ?? undefined;
    const accessToken = params.get('access_token') ?? undefined;
    const error = params.get('error') ?? undefined;

    if (error || accessToken) {
      return { expiresIn, accessToken, error };
    }
  }

  return undefined;
};
