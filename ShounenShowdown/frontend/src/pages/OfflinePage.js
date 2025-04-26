// OfflinePage.js (Page)
import React from 'react';

import Header from '../components/Header';

const OfflinePage = () => {
  return (
    <>
      <Header />
      <main>
        <div class="container">
            <h2>You are offline.</h2>
            <p>This page is not currently available.</p>
        </div>
        <a href="/home" class="button">Return Home</a>
      </main>
    </>
  );
}

export default OfflinePage;