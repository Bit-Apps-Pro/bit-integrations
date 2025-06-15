import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import c from 'react-multiple-select-dropdown-lite'
import { $btcbi, $flowStep, $newFlow } from '../../../GlobalStates'
import { sortByField } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import GetLogo from '../../../Utils/GetLogo'

export default function SelectAction() {
  const { isPro } = useRecoilValue($btcbi)
  const [newFlow, setNewFlow] = useRecoilState($newFlow)
  const setFlowStep = useSetRecoilState($flowStep)
  const navigate = useNavigate()

  const integs = [
    { type: 'Bit Form' },
    { type: 'Zoho CRM' },
    { type: 'Google Sheet' },
    { type: 'Mail Chimp' },
    { type: 'Mail' },
    { type: 'Slack' },
    { type: 'Trello' },
    { type: 'Web Hooks' },
    { type: 'Zapier' },
    { type: 'IFTTT' },
    { type: 'Make(Integromat)' },
    { type: 'Integrately' },
    { type: 'Pabbly' },
    { type: 'N8n' },
    { type: 'SyncSpider' },
    { type: 'KonnectzIT' },
    { type: 'Ant Apps' },
    { type: 'MailerLite' },
    { type: 'Rapidmail' },
    { type: 'ActiveCampaign' },
    { type: 'Encharge' },
    { type: 'Post Creation' },
    { type: 'Fluent CRM' },
    { type: 'Autonami' },
    { type: 'Dropbox' },
    { type: 'OneDrive' },
    { type: 'Google Drive' },
    { type: 'Google Calendar' },
    { type: 'Pods' },
    { type: 'Zoho Flow' },
    { type: 'Registration' },
    { type: 'Mail Poet' },
    { type: 'Brevo(SendinBlue)' },
    { type: 'Telegram' },
    { type: 'Tutor Lms' },
    { type: 'WooCommerce' },
    { type: 'Zoho Bigin' },
    { type: 'Zoho Campaigns' },
    { type: 'Zoho Marketing Automation(Zoho Marketing Hub)' },
    { type: 'Zoho Recruit' },
    { type: 'Getgist' },
    { type: 'ElasticEmail' },
    { type: 'WP Courseware' },
    { type: 'WishList' },
    { type: 'RestrictContent' },
    { type: 'Mautic' },
    { type: 'Keap' },
    { type: 'Hubspot' },
    { type: 'Freshdesk' },
    { type: 'Zoho Desk' },
    { type: 'Sendy' },
    { type: 'Zoom' },
    { type: 'Zoom Webinar' },
    { type: 'Fluent Support' },
    { type: 'Acumbamail' },
    { type: 'Groundhogg' },
    { type: 'SendFox' },
    { type: 'Twilio' },
    { type: 'Vbout' },
    { type: 'WhatsApp' },
    { type: 'LearnDash' },
    { type: 'Affiliate' },
    { type: 'BuddyBoss' },
    { type: 'GamiPress' },
    { type: 'Google Contacts' },
    { type: 'Kirim Email' },
    { type: 'Salesforce' },
    { type: 'Klaviyo' },
    { type: 'Selzy' },
    { type: 'Mailercloud' },
    { type: 'Moosend' },
    { type: 'Memberpress' },
    { type: 'PaidMembershipPro' },
    { type: 'MailBluster' },
    { type: 'MailRelay' },
    { type: 'Mailup' },
    { type: 'Notion' },
    { type: 'GetResponse' },
    { type: 'SliceWp' },
    { type: 'ConstantContact' },
    { type: 'OmniSend' },
    { type: 'Mailjet' },
    { type: 'SendGrid' },
    { type: 'PCloud' },
    { type: 'CustomAction' },
    { type: 'PipeDrive' },
    { type: 'EmailOctopus' },
    { type: 'Smaily' },
    { type: 'CustomApi' },
    { type: 'SureCart' },
    { type: 'Agiled CRM' },
    { type: 'ConvertKit' },
    { type: 'BenchMark' },
    { type: 'DirectIq' },
    { type: 'GiveWp' },
    { type: 'Airtable' },
    { type: 'Zoho Sheet' },
    { type: 'SendPulse' },
    { type: 'LifterLms' },
    { type: 'FreshSales' },
    { type: 'Insightly' },
    { type: 'CapsuleCRM' },
    { type: 'MasterStudyLms' },
    { type: 'Zendesk' },
    { type: 'Asana' },
    { type: 'Clickup' },
    { type: 'ClinchPad' },
    { type: 'Propovoice CRM' },
    { type: 'Mail Mint' },
    { type: 'CopperCRM' },
    { type: 'Sarbacane(Mailify)' },
    { type: 'Lemlist' },
    { type: 'Salesmate' },
    { type: 'LionDesk' },
    { type: 'CampaignMonitor' },
    { type: 'SuiteDash' },
    { type: 'Gravitec' },
    { type: 'CompanyHub' },
    { type: 'Demio' },
    { type: 'Flowlu' },
    { type: 'Livestorm' },
    { type: 'Nimble' },
    { type: 'Albato' },
    { type: 'SperseIO' },
    { type: 'FlowMattic' },
    { type: 'AutomatorWP' },
    { type: 'UncannyAutomator' },
    { type: 'ThriveAutomator' },
    { type: 'WPWebhooks' },
    { type: 'AdvancedFormIntegration' },
    { type: 'PerfexCRM' },
    { type: 'SureTriggers' },
    { type: 'OneHashCRM' },
    { type: 'Salesflare' },
    { type: 'AcademyLms' },
    { type: 'MoxieCRM' },
    { type: 'WPFusion' },
    { type: 'Woodpecker' },
    { type: 'NutshellCRM' },
    { type: 'SystemeIO' },
    { type: 'Discord' },
    { type: 'ZagoMail' },
  ]

  const [availableIntegs, setAvailableIntegs] = useState(sortByField(integs, 'type', 'ASC') || integs)
  const organizeIntegs = () => {
    const bitformIndex = availableIntegs.findIndex(i => i.type === 'Bit Form')
    if (bitformIndex === -1) return availableIntegs
    const bitformData = availableIntegs[bitformIndex]
    availableIntegs.splice(bitformIndex, 1)
    return [bitformData, ...availableIntegs]
  }

  const allOrganizeIntegs = isPro ? organizeIntegs() : availableIntegs

  const searchInteg = (e) => {
    const { value } = e.target
    const filtered = integs.filter((integ) => integ.type.toLowerCase().includes(value.toLowerCase()))
    setAvailableIntegs(filtered)
  }

  const updatedStep = () => {
    setFlowStep(1)
  }

  const getStrInsideParenthesis = (str) => {
    const startIndex = str.indexOf('(')
    const endIndex = str.indexOf(')')

    return str.slice(startIndex + 1, endIndex)
  }

  const setAction = (str) => {
    const action = str.includes('(') || str.includes(')') ? getStrInsideParenthesis(str) : str

    const tempConf = { ...newFlow }
    tempConf.action = action
    setNewFlow(tempConf)
    navigate(`/flow/action/new/${action}`)
  }
  return (
    <>
      <div className="txt-center" style={{ width: '100%' }}>
        <button type="button" className="f-left btn btcd-btn-o-gray mt-1" onClick={updatedStep}>
          <span className="btcd-icn icn-chevron-left" />
          &nbsp;Back
        </button>
        <h2 className="mt-0">Please select a Action</h2>
        <input type="search" className="btcd-paper-inp w-5 mb-3" onChange={searchInteg} placeholder="Search Actions..." style={{ height: '50%' }} autoFocus />
      </div>
      <div className="btcd-inte-wrp txt-center">

        <div className="flx flx-center flx-wrp pb-3">
          {allOrganizeIntegs.map((inte, i) => (
            <div
              key={`inte-sm-${i + 2}`}
              onClick={() => !inte.disable && !inte.pro && setAction(inte.type)}
              onKeyPress={() => !inte.disable && !inte.pro && setAction(inte.type)}
              role="button"
              tabIndex="0"
              className={`btcd-inte-card inte-sm mr-4 mt-3 ${inte.disable && !inte.pro && 'btcd-inte-dis'} ${inte.pro && 'btcd-inte-pro'}`}
            >
              {inte.pro && (
                <div className="pro-filter">
                  <span className="txt-pro"><a href="https://www.bitapps.pro" target="_blank" rel="noreferrer">{__('Premium', 'bit-integrations')}</a></span>
                </div>
              )}
              {/* <img loading="lazy" src={inte.logo} alt="" /> */}
              <GetLogo name={inte.type} extension="webp" />
              <div className="txt-center">
                {inte.type}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
