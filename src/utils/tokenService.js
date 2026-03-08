
export const saveAuthData = (jwtResponse) => {
  localStorage.setItem("accessToken", jwtResponse.accessToken);
  localStorage.setItem("refreshToken", jwtResponse.refreshToken);
  localStorage.setItem("user", JSON.stringify(jwtResponse.response));
};

export const getAccessToken = () => localStorage.getItem("accessToken");

export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const getUser = () => JSON.parse(localStorage.getItem("user"));

export const clearAuthData = () => localStorage.clear();


