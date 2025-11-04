export interface AuthCredentials {
  username: string;
  password: string;
  token?: string;
}

export interface LoginResponse {
  token: string;
  role?: string;
  userId?: string;
}

export interface DecodedToken {
  username: string;
  userId: string;
  role: string;
  iat: number;
  exp: number;
}
