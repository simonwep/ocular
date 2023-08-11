export interface GenesisUser {
  user: string;
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

export const createGenesisStore = (baseUrl: string) => {
  const login = async (request?: GenesisLoginRequest): Promise<GenesisUser> => {
    const response = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      ...(request && {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      })
    });

    if (response.status === 200) {
      return response.json();
    } else if (response.status === 401) {
      throw new Error('Invalid user or password.');
    } else {
      throw new Error('An error occurred during login.');
    }
  };

  const logout = async () => {
    await fetch(`${baseUrl}/logout`, { method: 'POST' });
  };

  const updatePassword = async (request: GenesisUpdatePasswordRequest): Promise<void> => {
    const response = await fetch(`${baseUrl}/account/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    if (response.status !== 200) {
      throw new Error('Failed to update password.');
    }
  };

  const getData = async (): Promise<object> => {
    const response = await fetch(`${baseUrl}/data`);

    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error('Failed to retrieve data.');
    }
  };

  const getDataByKey = async (key: string): Promise<unknown | undefined> => {
    const response = await fetch(`${baseUrl}/data/${key}`);

    if (response.status === 204) {
      return undefined;
    } else if (response.status === 200) {
      return response.json();
    } else {
      throw new Error('Failed to retrieve data by key.');
    }
  };

  const setDataByKey = async (key: string, data: unknown): Promise<void> => {
    const response = await fetch(`${baseUrl}/data/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.status !== 200) {
      throw new Error('Failed to store data.');
    }
  };

  const deleteDataByKey = async (key: string): Promise<void> => {
    await fetch(`${baseUrl}/data/${key}`, { method: 'DELETE' });
  };

  return {
    login,
    logout,
    updatePassword,
    getData,
    getDataByKey,
    setDataByKey,
    deleteDataByKey
  };
};
