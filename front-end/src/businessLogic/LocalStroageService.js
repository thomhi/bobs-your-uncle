export class LocalstorageService {
  constructor(localStorage) {
    this.localStorage = localStorage;
  }

  setJWT(jwt) {
    this.localStorage.setItem("jwt", jwt);
  }

  getJWT(jwt) {
    const result = this.localStorage.getItem("jwt");
    if (result) {
      return result;
    } else {
      return "noJwt";
    }
  }

  setUserId(id) {
    this.localStorage.setItem("userID", id);
  }

  getUserId() {
    const result = this.localStorage.getItem("userID");
    if (result) {
      return result;
    } else {
      return "noUserID";
    }
  }

  setTabIndex(id) {
    this.localStorage.setItem("tabIndex", id);
  }

  getTabIndex() {
    const result = this.localStorage.getItem("tabIndex");
    if (result) {
      return result;
    } else {
      return "noTabIndex";
    }
  }

  userExists() {
    return !!this.localStorage.getItem("userID");
  }
}

export const localStorageService = new LocalstorageService(localStorage);
