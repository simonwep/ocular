import { GoogleDriveAuth, GoogleDriveAuthReponse } from '@storage/google-drive-storage/types';
import { createKeyStorage } from '@storage/key-storage';
import { nextTick, reactive, readonly, watch, watchEffect } from 'vue';
import { debounce } from '@utils';
import { AppStorage, StorageState, StorageSync } from '../types';
import { parseOAuth2Login } from './utils';
import { MigratableState } from 'yuppee';

const CACHE_KEY = 'GOOGLE_DRIVE_STORAGE_KEY';

export const createGoogleDriveStorage = (auth: GoogleDriveAuth): AppStorage => {
  const keyStorage = createKeyStorage(CACHE_KEY);
  const state = reactive<StorageState>({ status: 'idle' });
  const fileIdCache = new Map<string, string>();
  let initialSyncsActive = 0;
  let syncsActive = 0;

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
      state.status = 'loading';

      window.open(url, '_blank');
      window.addEventListener(
        'message',
        (message) => {
          const { error, ...rest } = message.data as GoogleDriveAuthReponse;

          if (error) {
            return reject(error);
          } else if (rest.expiresIn && rest.accessToken) {
            keyStorage.register(rest.accessToken as string, Number(rest.expiresIn) * 1000);
          }

          resolve();
        },
        { once: true }
      );
    });
  };

  const getFileId = async (name: string): Promise<string | undefined> => {
    if (!keyStorage.key) return Promise.reject('Not authenticated');

    const url = new URL('https://www.googleapis.com/drive/v3/files');
    url.searchParams.set('access_token', keyStorage.key);
    url.searchParams.set('spaces', 'appDataFolder');
    url.searchParams.set('q', `name='${name}'`);

    return fetch(url.toString())
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((body) => body.files[0]?.id);
  };

  const upsert = async (name: string, json: string): Promise<void> => {
    if (!keyStorage.key) return Promise.reject('Not authenticated');

    const fileId = fileIdCache.get(name) ?? (await getFileId(name));

    if (fileId) {
      fileIdCache.set(name, fileId);
      const url = new URL('https://www.googleapis.com/upload/drive/v3/files');
      url.searchParams.set('access_token', keyStorage.key);
      url.searchParams.set('uploadType', 'media');

      await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?access_token=${keyStorage.key}`, {
        method: 'PATCH',
        body: json
      });
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
      url.searchParams.set('access_token', keyStorage.key);
      url.searchParams.set('uploadType', 'multipart');

      const file = await fetch(url.toString(), {
        method: 'post',
        body: form
      }).then((res) => res.json());

      fileIdCache.set(name, file.id);
    }
  };

  const sync = <T extends MigratableState, P extends MigratableState = T>(config: StorageSync<T, P>) => {
    const change = debounce(async (value: string) => {
      syncsActive++;
      await upsert(config.name, value);

      syncsActive--;
      if (syncsActive === 0) {
        state.status = 'authenticated';
      }
    }, 500);

    watch(
      () => JSON.stringify(config.state()),
      (value) => {
        if (!keyStorage.key || initialSyncsActive) return;
        state.status = 'syncing';
        void change(value);
      }
    );

    watchEffect(async () => {
      if (keyStorage.key) {
        state.status = 'loading';
        const fileId = await getFileId(config.name);
        initialSyncsActive++;

        if (fileId) {
          const content = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
            headers: {
              Authorization: `Bearer ${keyStorage.key}`
            }
          }).then((res) => res.json());

          config.push(content);
          state.status = 'authenticated';
        } else {
          await upsert(config.name, JSON.stringify(config.state()));
          state.status = 'authenticated';
        }

        await nextTick(() => initialSyncsActive--);
      }
    });
  };

  return { state: readonly(state), login, sync };
};
