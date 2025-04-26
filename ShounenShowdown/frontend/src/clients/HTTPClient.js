/** 
 * Client to make standard HTTP requests to API
 * @author Heath Dyer 
 */

const processJSONResponse = (res) => {
  return res.json().then(data => {
    if(!res.ok) {
      if (data.message) {
        throw new Error(`Error ${res.status}: ${data.message}`);
      }
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    return data;
  })
};

//Default error handling function
const handleError = (err) => {
  console.error('Error in fetch', err);
  throw err;
};

const HTTPClient = {
  //API Route constant
  API_ROUTE: '/api',
  // Standard get request
  get: (url) => {
    return fetch(url)
      .then(processJSONResponse)
      .catch(handleError);
  },
  // Standard post request
  post: (url, data) => {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(processJSONResponse)
    .catch(handleError);
  },
  // Standard put request
  put: (url, data) => {
    return fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(processJSONResponse)
    .catch(handleError);
  },
  // Standard delete request
  delete: (url) => {
    return fetch(url, {
      method: 'DELETE',
    })
    .then(processJSONResponse)
    .catch(handleError);
  }
}

export default HTTPClient;