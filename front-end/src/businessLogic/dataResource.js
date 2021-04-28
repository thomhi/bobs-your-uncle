export default class DataResource {
  backendURL = "http://localhost:9999";

  postJson(endpoint, params) {
    console.log("dataresource");
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
}

// export default dataResource = new DataResource();
