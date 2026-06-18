const Auth = (() => {
  async function requireUser() {
    const token = RestaurantAPI.getToken();
    if (!token) {
      window.location.href = '/login.html';
      return null;
    }
    try {
      return await RestaurantAPI.get('/api/auth/me');
    } catch (error) {
      RestaurantAPI.clearSession();
      window.location.href = '/login.html';
      return null;
    }
  }

  function logout() {
    RestaurantAPI.clearSession();
    window.location.href = '/login.html';
  }

  return { requireUser, logout };
})();
