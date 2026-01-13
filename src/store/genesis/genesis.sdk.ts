export interface GenesisUser {
  name: string;
  admin: boolean;
}

export interface GenesisNewUser {
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

export const createClient = (opt: GenesisStoreOptions) => {
  let sessionToken: string | undefined;

  const request = (url: string, options?: RequestInit) =>
    fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        ...(sessionToken ? { Cookie: sessionToken } : undefined)
      }
    });

  const assertOk = async (res: Response, ignoreUnauthenticated = false) => {
    if (res.ok) {
      return res.headers.get('content-type')?.includes('json') ? res.json() : undefined;
    } else if (res.status === 401 && !ignoreUnauthenticated) {
      opt.onSessionExpired?.(res);
    }

    return Promise.reject(res);
  };

  const login = async (body?: GenesisLoginRequest): Promise<GenesisUser> =>
    assertOk(
      await request(`${opt.baseUrl}/login`, {
        method: 'POST',
        ...(body && {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
      }).then((res) => {
        sessionToken = res.headers.get('set-cookie') ?? undefined;
        return res;
      }),
      true
    );

  const logout = async () => assertOk(await request(`${opt.baseUrl}/logout`, { method: 'POST' }));

  const updatePassword = async (body: GenesisUpdatePasswordRequest): Promise<void> =>
    assertOk(
      await request(`${opt.baseUrl}/account/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }),
      true
    );

  const getData = async (): Promise<object> => assertOk(await request(`${opt.baseUrl}/data`));

  const getDataByKey = async (key: string): Promise<unknown | undefined> =>
    assertOk(await request(`${opt.baseUrl}/data/${key}`));

  const setDataByKey = async (key: string, data: unknown): Promise<void> =>
    assertOk(
      await request(`${opt.baseUrl}/data/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    );

  const deleteDataByKey = async (key: string): Promise<void> =>
    assertOk(await request(`${opt.baseUrl}/data/${key}`, { method: 'DELETE' }));

  const getAllUsers = async (): Promise<GenesisUser[]> =>
    assertOk(await request(`${opt.baseUrl}/user`, { method: 'GET' }));

  const createUser = async (body: GenesisNewUser): Promise<void> =>
    assertOk(
      await request(`${opt.baseUrl}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
    );

  const updateUser = async (username: string, updatedUser: GenesisUser): Promise<void> =>
    assertOk(
      await request(`${opt.baseUrl}/user/${username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      })
    );

  const deleteUser = async (username: string): Promise<void> =>
    assertOk(await request(`${opt.baseUrl}/user/${username}`, { method: 'DELETE' }));

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
