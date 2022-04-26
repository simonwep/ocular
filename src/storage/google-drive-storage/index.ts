import {
  GoogleDriveAuth,
  GoogleDriveAuthReponse
} from '@storage/google-drive-storage/types';
import { ref, watch } from 'vue';
import { AppStorage, StorageAuthenticationState, StorageSync } from '../types';
import { parseOAuth2Login } from './utils';

export const createGoogleDriveStorage = (auth: GoogleDriveAuth): AppStorage => {
  const state = ref<StorageAuthenticationState>('idle');
  const accessToken = ref<string | undefined>();
  const fileIdCache = new Map<string, string>();
  let loginTimeout = -1;

  const authentication = parseOAuth2Login();
  if (authentication) {
    window.opener.postMessage(authentication, location.origin);
    window.close();
  }

  const login = () => {
    // Open OAuth screen
    const url = new URL(auth.authUri);
    url.searchParams.set('scope', auth.scope);
    url.searchParams.set('include_granted_scopes', 'true');
    url.searchParams.set('response_type', 'token');
    url.searchParams.set('redirect_uri', location.origin);
    url.searchParams.set('client_id', auth.clientId);

    return new Promise<void>((resolve, reject) => {
      state.value = 'loading';

      window.open(url, '_blank');
      window.addEventListener(
        'message',
        (message) => {
          const { error, ...rest } = message.data as GoogleDriveAuthReponse;

          if (error) {
            return reject(error);
          } else if (rest.expiresIn && rest.accessToken) {
            clearTimeout(loginTimeout);

            accessToken.value = rest.accessToken;
            state.value = 'authenticated';

            loginTimeout = setTimeout(() => {
              accessToken.value = undefined;
              void login();
            }, Number(rest.expiresIn) * 1000) as unknown as number;
          }

          resolve();
        },
        { once: true }
      );
    });
  };

  const getFileId = async (name: string): Promise<string | undefined> => {
    if (!accessToken.value) return Promise.reject('Not authenticated');

    const url = new URL('https://www.googleapis.com/drive/v3/files');
    url.searchParams.set('access_token', accessToken.value);
    url.searchParams.set('spaces', 'appDataFolder');
    url.searchParams.set('q', `name='${name}'`);

    return fetch(url.toString())
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((body) => body.files[0]?.id);
  };

  const upsert = async (name: string, json: string): Promise<void> => {
    if (!accessToken.value) return Promise.reject('Not authenticated');

    const fileId = fileIdCache.get(name) ?? (await getFileId(name));

    if (fileId) {
      fileIdCache.set(name, fileId);
      const url = new URL('https://www.googleapis.com/upload/drive/v3/files');
      url.searchParams.set('access_token', accessToken.value);
      url.searchParams.set('uploadType', 'media');

      await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${fileId}?access_token=${accessToken.value}`,
        {
          method: 'PATCH',
          body: json
        }
      );
    } else {
      const form = new FormData();

      form.append(
        'metadata',
        new Blob(
          [
            JSON.stringify({
              name: name,
              mimeType: 'application/json',
              parents: ['appDataFolder']
            })
          ],
          { type: 'application/json' }
        )
      );

      form.append('file', new Blob([json], { type: 'application/json' }));

      const url = new URL('https://www.googleapis.com/upload/drive/v3/files');
      url.searchParams.set('access_token', accessToken.value);
      url.searchParams.set('uploadType', 'multipart');

      const file = await fetch(url.toString(), {
        method: 'post',
        body: form
      }).then((res) => res.json());

      fileIdCache.set(name, file.id);
    }
  };

  const sync = <T>(config: StorageSync<T>) => {
    watch(
      () => JSON.stringify(config.state()),
      (value) => {
        void upsert(config.name, value);
      }
    );

    watch(accessToken, async (token) => {
      if (token) {
        const fileId = await getFileId(config.name);

        if (fileId) {
          const content = await fetch(
            `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
            {
              headers: {
                Authorization: `Bearer ${accessToken.value}`
              }
            }
          ).then((res) => res.json());

          config.push(content);
        } else {
          await upsert(config.name, JSON.stringify(config.state()));
        }
      }
    });
  };

  return { state, login, sync };
};
