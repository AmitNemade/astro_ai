const userTokenKey = "user_token";
const User = {
  setToken: (token) => localStorage.setItem(userTokenKey, token),
  getToken: () => localStorage.getItem(userTokenKey) || null,
  clearToken: () => localStorage.clear(),
};

export { User };
