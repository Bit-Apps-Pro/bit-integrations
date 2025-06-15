import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import AuthorizeButton from '../../Utilities/AuthorizeButton'
import ErrorField from '../../Utilities/ErrorField'
import GetInfo from '../../Utilities/GetInfo'
import Input from '../../Utilities/Input'
import Note from '../../Utilities/Note'
import StepPage from '../../Utilities/StepPage'
import { getAllDatabaseLists, handleAuthorize, handleInput } from './NotionCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

function NotionAuthorization({ notionConf, setNotionConf, step, setStep, isInfo, loading, setLoading }) {
  const btcbi = useRecoilValue($btcbi)
  const [authorized, setAuthorized] = useState(false)
  const [error, setError] = useState({ clientId: '', clientSecret: '' })
  const { notion } = tutorialLinks
  const nextPage = async () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    setStep(2)
    setLoading({ ...loading, page: true })
    const data = await getAllDatabaseLists(notionConf, setNotionConf)
    if (data) {
      setLoading({ ...loading, page: false })
    }
  }

  const note = `
  <h4> Step of get Client Id & Client Secret</h4>
  <ul>
    <li>Goto <a href="https://www.notion.so/my-integrations" target='_blank'>My integrations.</a></li>
    <li>Click new integration.</li>
    <li>Name to identify your integration to users.</li>
    <li><b>User Capabilities</b> always select read user information including email addresses</li>
    <li><b>Submit</b></li>
    <li>Select <b>Integration type</b> Public</li>
    <li>Fill up <b>OAuth Domain & URIs</b> information</li>
    <li>Homepage & Redirect URIs copy from Integration Settings</li>
    <li>Finally, click <b>Authorize</b> button.</li>
</ul>
`
  return (
    <StepPage
      step={step}
      stepNo={1}
      style={{ width: 900, height: 'auto' }}
    >
      {notion?.youTubeLink && (
        <TutorialLink
          title={notion?.title}
          youTubeLink={notion?.youTubeLink}
        />
      )}
      {notion?.docLink && (
        <TutorialLink
          title={notion?.title}
          docLink={notion?.docLink}
        />
      )}

      <div className="mt-2">

        {/* Notion Authorization */}

        <Input
          label="Integration Name"
          name="name"
          placeholder="Integration Name..."
          value={notionConf.name}
          onchange={(e) => handleInput(e, notionConf, setNotionConf, error, setError)}
        />
        <Input
          label="Homepage"
          copytext={window.location.origin}
          setToast
        />
        <Input
          label="Redirect URIs"
          copytext={`${btcbi.api.base}/redirect`}
          setToast
        />
        <Input
          label="OAuth client ID"
          name="clientId"
          placeholder="client ID..."
          value={notionConf.clientId}
          onchange={(e) => handleInput(e, notionConf, setNotionConf, error, setError)}
        />
        <ErrorField error={error.clientId} />
        <Input
          label="OAuth client secret"
          name="clientSecret"
          placeholder="client secret..."
          value={notionConf.clientSecret}
          onchange={(e) => handleInput(e, notionConf, setNotionConf, error, setError)}

        />
        <ErrorField error={error.clientSecret} />
        <GetInfo
          url="https://www.notion.so/my-integrations"
          info="Notion My integrations, please visit"
        />
        {!isInfo && (
          <AuthorizeButton
            onclick={() => handleAuthorize(notionConf, setNotionConf, error, setError, setAuthorized, loading, setLoading)}
            nextPage={nextPage}
            auth={authorized}
            loading={loading.auth}
          />
        )}
      </div>

      <Note note={note} />
    </StepPage>

  )
}

export default NotionAuthorization
