export type GenesisResponse<TData> =
  | {
      error: { message: string; status: number } & Record<string, unknown>;
      data?: undefined;
    }
  | { error?: undefined; data: TData };

export type GenesisUser = {
  name: string;
  admin: boolean;
};

export type GenesisNewUser = {
  name: string;
  password: string;
  admin: boolean;
};

export type GenesisLoginRequest = {
  user: string;
  password: string;
};

export type GenesisUpdatePasswordRequest = {
  newPassword: string;
  currentPassword: string;
};

export type GenesisStoreOptions = {
  baseUrl: string;
  middleware?: (res: Response) => Response;
};

export const createClient = (opt: GenesisStoreOptions) => {
  const middleware = opt.middleware ?? ((res: Response) => res);
  let sessionToken: string | undefined;

  const request = async <TData = undefined>(url: string, options?: RequestInit): Promise<GenesisResponse<TData>> => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options?.headers,
          ...(sessionToken ? { Cookie: sessionToken } : undefined)
        }
      });

      sessionToken ??= response.headers.get('set-cookie') ?? undefined;
      const hasContent = response.headers.has('content-type');
      const processed = middleware(response);
      const data = hasContent ? await processed.json() : undefined;

      if (response.ok) {
        return { error: undefined, data };
      }

      const { error: message, ...rest } = data;
      const status = response.status;
      const error = { message, status, ...rest };

      return { error, data: undefined };
    } catch (error) {
      return {
        error: { message: (error as Error).message, status: -1 },
        data: undefined
      };
    }
  };

  const login = async (body?: GenesisLoginRequest) =>
    await request<GenesisUser>(`${opt.baseUrl}/login`, {
      method: 'POST',
      ...(body && {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
    });

  const logout = async () => await request(`${opt.baseUrl}/logout`, { method: 'POST' });

  const updatePassword = async (body: GenesisUpdatePasswordRequest) =>
    await request(`${opt.baseUrl}/account/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

  const getData = async (): Promise<object> => await request(`${opt.baseUrl}/data`);

  const getDataByKey = async <P>(key: string) => await request<P | undefined>(`${opt.baseUrl}/data/${key}`);

  const setDataByKey = async (key: string, data: unknown) =>
    await request(`${opt.baseUrl}/data/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

  const deleteDataByKey = async (key: string) => await request(`${opt.baseUrl}/data/${key}`, { method: 'DELETE' });

  const getAllUsers = async () => await request<GenesisUser[]>(`${opt.baseUrl}/user`, { method: 'GET' });

  const createUser = async (body: GenesisNewUser) =>
    await request(`${opt.baseUrl}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

  const updateUser = async (username: string, updatedUser: GenesisUser) =>
    await request(`${opt.baseUrl}/user/${username}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser)
    });

  const deleteUser = async (username: string) => await request(`${opt.baseUrl}/user/${username}`, { method: 'DELETE' });

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
