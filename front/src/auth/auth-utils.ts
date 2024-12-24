import jwtDecode from "jwt-decode";

export const tokens = {
  access: {
    set: (token: string) => localStorage.setItem("accessToken", token),
    get: () => localStorage.getItem("accessToken"),
    delete: () => localStorage.removeItem("accessToken"),
  },

  refresh: {
    set: (token: string) => localStorage.setItem("refreshToken", token),
    get: () => localStorage.getItem("refreshToken"),
    delete: () => localStorage.removeItem("refreshToken"),
  },
};

// Client-side token verification

export interface Token {
  _id: string;
  iat: number;
  exp: number;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

/** Returns the access token. Performs a token refresh if necessary */
export const acquireToken = async () => {
  const accessToken = tokens.access.get();
  if (!accessToken) {
    return null;
  }

  const decoded = jwtDecode<Token>(accessToken);
  // If the token has not expired yet, just return it
  if (Date.now() < decoded.exp * 1000) {
    return accessToken;
  }

  // accessToken is expired, need to refresh
  tokens.access.delete();
  const refreshToken = tokens.refresh.get();
  if (!refreshToken) {
    // No refresh token (somehow), so just return null
    return null;
  }

  // Refresh the tokens
  const API_URL = process.env.REACT_APP_BACK_API || "";
  const refreshResponse = await fetch(`${API_URL}/api/auth/refresh-token`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${refreshToken}`,
    },
  });

  // Refresh failed
  if (!refreshResponse.ok) {
    if (refreshResponse.status.toString().startsWith("4")) {
      // Refresh token is invalid
      tokens.refresh.delete();
    }
    return null;
  }

  // Refresh success!
  const newTokens: Tokens = await refreshResponse.json();
  tokens.access.set(newTokens.accessToken);
  tokens.refresh.set(newTokens.refreshToken);

  return newTokens.accessToken;
};
