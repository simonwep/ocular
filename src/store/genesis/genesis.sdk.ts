// Utilities
export type GenesisBaseError = { message: string; status: number };

export type GenesisResponse<TData, TErr extends GenesisBaseError = GenesisBaseError> =
  { error: TErr; data?: undefined } | { error?: undefined; data: TData };

// Classes
export type GenesisUser = { name: string; admin: boolean };

// Login
export type GenesisLoginError = GenesisBaseError & { retry_after?: number; retry_timestamp?: number };
export type GenesisLoginResponse = GenesisResponse<GenesisUser, GenesisLoginError>;
export type GenesisLoginBody = { user: string; password: string };

// Logout
export type GenesisLogoutError = GenesisBaseError;
export type GenesisLogoutResponse = GenesisResponse<undefined, GenesisLogoutError>;

// Update password
export type GenesisUpdatePasswordError = GenesisBaseError;
export type GenesisUpdatePasswordResponse = GenesisResponse<undefined, GenesisUpdatePasswordError>;
export type GenesisUpdatePasswordBody = { newPassword: string; currentPassword: string };

// Data
export type GenesisGetDataError = GenesisBaseError;
export type GenesisGetDataResponse = GenesisResponse<object, GenesisGetDataError>;

export type GenesisGetDataByKeyError = GenesisBaseError;
export type GenesisGetDataByKeyResponse<TData> = GenesisResponse<TData | undefined, GenesisGetDataByKeyError>;

export type GenesisSetDataByKeyError = GenesisBaseError;
export type GenesisSetDataByKeyResponse = GenesisResponse<undefined, GenesisSetDataByKeyError>;
export type GenesisSetDataByKeyBody = unknown;

export type GenesisDeleteDataByKeyError = GenesisBaseError;
export type GenesisDeleteDataByKeyResponse = GenesisResponse<undefined, GenesisDeleteDataByKeyError>;

// Users
export type GenesisGetAllUsersError = GenesisBaseError;
export type GenesisGetAllUsersResponse = GenesisResponse<GenesisUser[], GenesisGetAllUsersError>;

export type GenesisCreateUserError = GenesisBaseError;
export type GenesisCreateUserResponse = GenesisResponse<undefined, GenesisCreateUserError>;
export type GenesisCreateUserBody = GenesisUser & { password: string };

export type GenesisUpdateUserError = GenesisBaseError;
export type GenesisUpdateUserResponse = GenesisResponse<undefined, GenesisUpdateUserError>;
export type GenesisUpdateUserBody = GenesisUser;

export type GenesisDeleteUserError = GenesisBaseError;
export type GenesisDeleteUserResponse = GenesisResponse<undefined, GenesisDeleteUserError>;

export type GenesisStoreOptions = {
  baseUrl: string;
  middleware?: (res: Response) => Response;
};

export const createClient = (opt: GenesisStoreOptions) => {
  const middleware = opt.middleware ?? ((res: Response) => res);
  let sessionToken: string | undefined;

  const request = async <TData = undefined, TErr extends GenesisBaseError = GenesisBaseError>(
    url: string,
    options?: RequestInit
  ): Promise<GenesisResponse<TData, TErr>> => {
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
        return { error: undefined, data: data as TData };
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: message, ...rest } = data as any;
      const status = response.status;
      const error = { message, status, ...rest };

      return { error, data: undefined };
    } catch (error) {
      return {
        error: { message: (error as Error).message, status: -1 } as TErr,
        data: undefined
      };
    }
  };

  const login = async (body?: GenesisLoginBody): Promise<GenesisLoginResponse> =>
    await request<GenesisUser, GenesisLoginError>(`${opt.baseUrl}/login`, {
      method: 'POST',
      ...(body && {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
    });

  const logout = async (): Promise<GenesisLogoutResponse> =>
    await request<undefined, GenesisLogoutError>(`${opt.baseUrl}/logout`, { method: 'POST' });

  const updatePassword = async (body: GenesisUpdatePasswordBody): Promise<GenesisUpdatePasswordResponse> =>
    await request<undefined, GenesisUpdatePasswordError>(`${opt.baseUrl}/account/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

  const getData = async (): Promise<GenesisGetDataResponse> =>
    await request<object, GenesisGetDataError>(`${opt.baseUrl}/data`);

  const getDataByKey = async <P>(key: string): Promise<GenesisGetDataByKeyResponse<P>> =>
    await request<P | undefined, GenesisGetDataByKeyError>(`${opt.baseUrl}/data/${key}`);

  const setDataByKey = async (key: string, data: GenesisSetDataByKeyBody): Promise<GenesisSetDataByKeyResponse> =>
    await request<undefined, GenesisSetDataByKeyError>(`${opt.baseUrl}/data/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

  const deleteDataByKey = async (key: string): Promise<GenesisDeleteDataByKeyResponse> =>
    await request<undefined, GenesisDeleteDataByKeyError>(`${opt.baseUrl}/data/${key}`, { method: 'DELETE' });

  const getAllUsers = async (): Promise<GenesisGetAllUsersResponse> =>
    await request<GenesisUser[], GenesisGetAllUsersError>(`${opt.baseUrl}/user`, { method: 'GET' });

  const createUser = async (body: GenesisCreateUserBody): Promise<GenesisCreateUserResponse> =>
    await request<undefined, GenesisCreateUserError>(`${opt.baseUrl}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

  const updateUser = async (username: string, updatedUser: GenesisUpdateUserBody): Promise<GenesisUpdateUserResponse> =>
    await request<undefined, GenesisUpdateUserError>(`${opt.baseUrl}/user/${username}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser)
    });

  const deleteUser = async (username: string): Promise<GenesisDeleteUserResponse> =>
    await request<undefined, GenesisDeleteUserError>(`${opt.baseUrl}/user/${username}`, { method: 'DELETE' });

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
