/**
 * React Starter Kit for Firebase
 * https://github.com/kriasoft/react-firebase-starter
 * Copyright (c) 2015-present Kriasoft | MIT License
 */

import React from 'react';
import ReactDOM from 'react-dom';
import qs from 'query-string';
import { createBrowserHistory } from 'history';

import App from './common/App';
import * as serviceWorker from './serviceWorker-other';
import router from './router';
import { createRelay } from './relay';
import { setHistory } from './utils/scrolling';

const container = document.getElementById('root');
const history = createBrowserHistory();

let relay = createRelay();

setHistory(history);

function reset() {
  relay = createRelay();
  window.sessionStorage.removeItem('returnTo');
}

function render(location) {
  const startTime = performance.now();
  router
    .resolve({
      pathname: location.pathname,
      query: qs.parse(location.search),
      relay,
      config: window.config,
    })
    .then(route => {
      if (route.redirect) {
        history.replace(route.redirect);
      } else {
        ReactDOM.render(
          <App
            {...route}
            config={window.config}
            history={history}
            location={location}
            relay={relay}
            reset={reset}
            startTime={startTime}
          />,
          container,
        );
      }
    });
}

history.listen(render);
render(history.location);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();

//serviceWorker

// let deferredPrompt;

// if ('serviceWorker' in navigator) {
//   const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
//   navigator.serviceWorker
//     .register(swUrl)
//     .then(function() {
//       console.log('Service worker registered!');
//     })
//     .catch(function(err) {
//       console.log(err);
//     });
// }

// window.addEventListener('beforeinstallprompt', function(event) {
//   console.log('beforeinstallprompt fired');
//   event.preventDefault();
//   deferredPrompt = event;
//   return false;
// });

// Hot Module Replacement
// https://webpack.js.org/guides/hot-module-replacement/
if (module.hot) {
  console.log('module', module);
  module.hot.accept('./router', () => {
    render(history.location);
  });
}
