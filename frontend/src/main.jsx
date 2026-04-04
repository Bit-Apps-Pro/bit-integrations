/* eslint-disable no-undef */
import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router'
import { RecoilRoot } from 'recoil'
import RecoilNexus from 'recoil-nexus'
import App from './App'
import Loader from './components/Loaders/Loader'

const root = ReactDOM.createRoot(document.getElementById('btcd-app'))
root.render(
  <RecoilRoot>
    <RecoilNexus />
    <HashRouter>
      <Suspense
        fallback={
          <Loader
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '82vh'
            }}
          />
        }>
        <App />
      </Suspense>
    </HashRouter>
  </RecoilRoot>
)

// serviceWorker.register();
