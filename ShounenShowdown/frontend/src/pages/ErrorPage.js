// ErrorPage.js (Page)
import React from 'react';

import Header from '../components/Header';

const ErrorPage = ({error}) => {
  return (
    <>
      <Header />
      <main>
        <div class="container">
            <h2>{ error ? `Error ${ error.code } - ${ error.message }` : "Error 404 - Not Found"}</h2>
            <p>{ error ? error.details : "The resource you are looking for could not be found."}</p>
        </div>
        <a href="/home" class="button">Return Home</a>
      </main>
    </>
  );
}

export default ErrorPage;