export default class DataResource {
  backendURL = "http://localhost:9999";

  postJson(endpoint, params) {
    return fetch(`${this.backendURL}${endpoint}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(params),
    }).then((e) => {
      return this.checkStatus(e);
    });
  }

  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }
}
