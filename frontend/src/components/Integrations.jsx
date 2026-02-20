/* eslint-disable-next-line no-undef */
import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import EditInteg from './AllIntegrations/EditInteg'
import IntegInfo from './AllIntegrations/IntegInfo'
import Log from './AllIntegrations/Log'
import NewInteg from './AllIntegrations/NewInteg'
import SnackMsg from './Utilities/SnackMsg'

function Integrations() {
  const [snack, setSnackbar] = useState({ show: false })

  return (
    <div className="btcd-s-wrp" id="btcd-settings-wrp">
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <Routes>
        <Route path="new/:integUrlName/*" element={<NewInteg allIntegURL="/" />} />

        <Route path="edit/:id" element={<EditInteg allIntegURL="/" />} />

        <Route path="info/:id/:type" element={<IntegInfo allIntegURL="/" />} />

        <Route path="log/:id/:type" element={<Log allIntegURL="/" />} />
      </Routes>
    </div>
  )
}

export default Integrations
