const RestaurantAPI = (() => {
  const TOKEN_KEY = 'restaurantErpToken';
  const USER_KEY = 'restaurantErpUser';

  function storage() {
    return localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
  }

  function setSession(token, user, remember) {
    const target = remember ? localStorage : sessionStorage;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    target.setItem(TOKEN_KEY, token);
    target.setItem(USER_KEY, JSON.stringify(user));
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  }

  function getUser() {
    const value = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    return value ? JSON.parse(value) : null;
  }

  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }

  async function request(path, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(path, {
      ...options,
      headers,
      body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = payload.message || 'Request failed';
      throw new Error(message);
    }
    return payload.data;
  }

  return {
    setSession,
    getToken,
    getUser,
    clearSession,
    request,
    get: (path) => request(path),
    post: (path, body) => request(path, { method: 'POST', body }),
    put: (path, body) => request(path, { method: 'PUT', body })
  };
})();
