import DataResource from "./dataResource";

export class AuthService {
  dataResource = new DataResource();

  async signIn(name, password) {
    return this.dataResource
      .postJson(`/login`, { name, password })
      .then((response) => response.json());
  }

  async signUp(name, password) {
    console.log("authservice");
    return this.dataResource
      .postJson(`/register`, { name, password })
      .then((response) => response.json());
  }
}

export const authService = new AuthService();
