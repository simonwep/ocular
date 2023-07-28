export interface User {
  user: string;
  password: string;
}

export interface GenesisToken {
  expiresAt: number;
  token: string;
}

export interface UpdatePasswordRequest {
  newPassword: string;
  currentPassword: string;
}

export const createGenesisStore = (baseUrl: string) => {
  const LOCAL_STORAGE_KEY = 'GENESIS_STORE';
  let tokenDataObj: GenesisToken | undefined = undefined;
  let tokenTimeout = -1;

  const setToken = (token: string, expiresAt: number) => {
    tokenDataObj = { token, expiresAt };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tokenDataObj));
    scheduleTokenClear(expiresAt);
  };

  const removeToken = () => {
    tokenDataObj = undefined;
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    clearTimeout(tokenTimeout);
  };

  const scheduleTokenClear = (expiresAt: number) => {
    const timeRemaining = expiresAt - Date.now();
    clearTimeout(tokenTimeout);

    if (timeRemaining > 0) {
      tokenTimeout = window.setTimeout(() => refreshToken().catch(removeToken), timeRemaining);
    } else removeToken();
  };

  const login = async (user: User): Promise<void> => {
    const response = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });

    if (response.status === 200) {
      const data = await response.json();
      setToken(data.token, data.expiresAt);
    } else if (response.status === 401) {
      throw new Error('Invalid user or password.');
    } else {
      throw new Error('An error occurred during login.');
    }
  };

  const refreshToken = async (): Promise<void> => {
    const response = await fetch(`${baseUrl}/login/refresh`, { method: 'POST' });

    if (response.status === 200) {
      const data = await response.json();
      setToken(data.token, data.expiresAt);
    } else if (response.status === 401) {
      throw new Error('Token expired.');
    } else {
      throw new Error('An error occurred during login.');
    }
  };

  const updatePassword = async (request: UpdatePasswordRequest): Promise<void> => {
    const response = await fetch(`${baseUrl}/account/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenDataObj?.token}`
      },
      body: JSON.stringify(request)
    });

    if (response.status !== 200) {
      throw new Error('Failed to update password.');
    }
  };

  const getData = async (): Promise<object> => {
    const response = await fetch(`${baseUrl}/data`, {
      headers: { Authorization: `Bearer ${tokenDataObj?.token}` }
    });

    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error('Failed to retrieve data.');
    }
  };

  const getDataByKey = async (key: string): Promise<unknown | undefined> => {
    const response = await fetch(`${baseUrl}/data/${key}`, {
      headers: { Authorization: `Bearer ${tokenDataObj?.token}` }
    });

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
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenDataObj?.token}`
      },
      body: JSON.stringify(data)
    });

    if (response.status !== 200) {
      throw new Error('Failed to store data.');
    }
  };

  const deleteDataByKey = async (key: string): Promise<void> => {
    await fetch(`${baseUrl}/data/${key}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenDataObj?.token}` }
    });
  };

  // Load from localstorage
  const tokenData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (tokenData) {
    tokenDataObj = JSON.parse(tokenData) as GenesisToken;
    scheduleTokenClear(tokenDataObj.expiresAt);
    refreshToken().catch(removeToken);
  }

  const logout = () => removeToken();

  const isLoggedIn = () => !!tokenDataObj;

  return {
    login,
    logout,
    isLoggedIn,
    updatePassword,
    getData,
    getDataByKey,
    setDataByKey,
    deleteDataByKey
  };
};
