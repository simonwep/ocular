export interface GenesisUser {
  name: string;
  admin: boolean;
}

export interface NewGenesisUser {
  name: string;
  password: string;
  admin: boolean;
}

export interface GenesisLoginRequest {
  user: string;
  password: string;
}

export interface GenesisUpdatePasswordRequest {
  newPassword: string;
  currentPassword: string;
}

export interface GenesisStoreOptions {
  baseUrl: string;
  onSessionExpired?: (res: Response) => void;
}

export const createGenesisStore = (opt: GenesisStoreOptions) => {
  const assertOk = (res: Response, ignoreUnauthenticated = false) => {
    if (res.ok) {
      return res.headers.get('content-type')?.includes('json') ? res.json() : undefined;
    } else if (res.status === 401 && !ignoreUnauthenticated) {
      opt.onSessionExpired?.(res);
    } else {
      return Promise.reject(res);
    }
  };

  const login = async (request?: GenesisLoginRequest): Promise<GenesisUser> =>
    assertOk(
      await fetch(`${opt.baseUrl}/login`, {
        method: 'POST',
        ...(request && {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request)
        })
      }),
      true
    );

  const logout = async () => assertOk(await fetch(`${opt.baseUrl}/logout`, { method: 'POST' }));

  const updatePassword = async (request: GenesisUpdatePasswordRequest): Promise<void> =>
    assertOk(
      await fetch(`${opt.baseUrl}/account/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      }),
      true
    );

  const getData = async (): Promise<object> => assertOk(await fetch(`${opt.baseUrl}/data`));

  const getDataByKey = async (key: string): Promise<unknown | undefined> =>
    assertOk(await fetch(`${opt.baseUrl}/data/${key}`));

  const setDataByKey = async (key: string, data: unknown): Promise<void> =>
    assertOk(
      await fetch(`${opt.baseUrl}/data/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    );

  const deleteDataByKey = async (key: string): Promise<void> =>
    assertOk(await fetch(`${opt.baseUrl}/data/${key}`, { method: 'DELETE' }));

  const getAllUsers = async (): Promise<GenesisUser[]> =>
    assertOk(await fetch(`${opt.baseUrl}/user`, { method: 'GET' }));

  const createUser = async (newUser: NewGenesisUser): Promise<void> =>
    assertOk(
      await fetch(`${opt.baseUrl}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })
    );

  const updateUser = async (username: string, updatedUser: GenesisUser): Promise<void> =>
    assertOk(
      await fetch(`${opt.baseUrl}/user/${username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      })
    );

  const deleteUser = async (username: string): Promise<void> =>
    assertOk(await fetch(`${opt.baseUrl}/user/${username}`, { method: 'DELETE' }));

  return {
    login,
    logout,
    updatePassword,
    getData,
    getDataByKey,
    setDataByKey,
    deleteDataByKey,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
  };
};
