/* eslint-disable no-param-reassign */

import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import { useState } from 'react'
import { create } from 'mutative'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { getProFeatureSubtitle, getProFeatureTitle } from '../IntegrationHelpers/ActionUtilitiesHelper'

export default function MailChimpActions({ mailChimpConf, setMailChimpConf, formFields, address }) {
  const [actionMdl, setActionMdl] = useState({ show: false })
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const actionHandler = (e, type) => {
    const newConf = { ...mailChimpConf }

    if (type === 'language' || type === 'gdpr') {
      setActionMdl({ show: type })
    }
    if (type === 'update') {
      if (e.target.checked) {
        newConf.actions.update = true
      } else {
        delete newConf.actions.update
      }
    }
    if (type === 'double_opt_in') {
      if (e.target.checked) {
        newConf.actions.double_opt_in = true
      } else {
        delete newConf.actions.double_opt_in
      }
    }
    if (type === 'address') {
      if (e.target.checked) {
        newConf.actions.address = true
        newConf.address_field = address
          .filter(addr => addr.required)
          .map(adr => ({ formField: '', mailChimpAddressField: adr.tag, required: true }))
      } else {
        delete newConf.actions.address
        newConf.address_field = ''
      }
    }
    setMailChimpConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, type) => {
    setMailChimpConf(prevConf =>
      create(prevConf, draftConf => {
        draftConf[type] = val
      })
    )
  }

  return (
    <div className="pos-rel d-flx w-8">
      {(!mailChimpConf?.module || mailChimpConf?.module === 'add_a_member_to_an_audience') && (
        <>
          <TableCheckBox
            checked={mailChimpConf.actions?.address || false}
            onChange={e => actionHandler(e, 'address')}
            className="wdt-200 mt-4 mr-2"
            value="address"
            title={__('Add Address Field', 'bit-integrations')}
            subTitle={__('Add Address Field', 'bit-integrations')}
          />

          <TableCheckBox
            checked={mailChimpConf.actions?.double_opt_in || false}
            onChange={e => actionHandler(e, 'double_opt_in')}
            className="wdt-200 mt-4 mr-2"
            value="double_opt_in"
            title={__('Double Opt-in', 'bit-integrations')}
            subTitle={__('Add Double Opt-in', 'bit-integrations')}
          />

          <TableCheckBox
            checked={mailChimpConf.actions?.update || false}
            onChange={e => actionHandler(e, 'update')}
            className="wdt-200 mt-4 mr-2"
            value="user_share"
            title={__('Update Mail Chimp', 'bit-integrations')}
            subTitle={__('Update Responses with MailChimp exist Aduience?', 'bit-integrations')}
          />

          <TableCheckBox
            checked={mailChimpConf?.selectedLanguage || false}
            onChange={e => actionHandler(e, 'language')}
            className="wdt-200 mt-4 mr-2"
            value="language"
            isInfo={!isPro}
            title={getProFeatureTitle(__('Add Language', 'bit-integrations'))}
            subTitle={getProFeatureSubtitle(
              __('Add Language', 'bit-integrations'),
              __('Add Language', 'bit-integrations'),
              '2.3.0'
            )}
          />

          <TableCheckBox
            checked={mailChimpConf?.selectedGDPR || false}
            onChange={e => actionHandler(e, 'gdpr')}
            className="wdt-200 mt-4 mr-2"
            value="gdpr"
            title={getProFeatureTitle(__('Add GDPR', 'bit-integrations'))}
            subTitle={getProFeatureSubtitle(
              __('GDPR', 'bit-integrations'),
              __('Add GDPR Marketing Preferences', 'bit-integrations'),
              '2.3.0'
            )}
            isInfo={!isPro}
          />

          {isPro && (
            <>
              <ConfirmModal
                className="custom-conf-mdl"
                mainMdlCls="o-v"
                btnClass="purple"
                btnTxt={__('Ok', 'bit-integrations')}
                show={actionMdl.show === 'language'}
                close={clsActionMdl}
                action={clsActionMdl}
                title={__('Add Language', 'bit-integrations')}>
                <div className="btcd-hr mt-2 mb-2" />

                <div className="flx flx-between mt-2">
                  <MultiSelect
                    className="msl-wrp-options"
                    defaultValue={mailChimpConf?.selectedLanguage}
                    options={languages}
                    onChange={val => setChanges(val, 'selectedLanguage')}
                    closeOnSelect
                    singleSelect
                  />
                </div>
              </ConfirmModal>
              <ConfirmModal
                className="custom-conf-mdl"
                mainMdlCls="o-v"
                btnClass="purple"
                btnTxt={__('Ok', 'bit-integrations')}
                show={actionMdl.show === 'gdpr'}
                close={clsActionMdl}
                action={clsActionMdl}
                title={__('Write down GDPR marketing options', 'bit-integrations')}>
                <div className="btcd-hr mt-2 mb-2" />
                <p>
                  <b>{__('Note', 'bit-integrations')}</b>:{' '}
                  {sprintf(
                    __(
                      'Write down your preferred GDPR marketing options, separated by commas %s. For example: Email Address, Phone Number.',
                      'bit-integrations'
                    ),
                    '(",")'
                  )}
                </p>

                <div className="flx flx-between mt-2">
                  <input
                    className="btcd-paper-inp mt-1"
                    onChange={e => setChanges(e.target.value, 'selectedGDPR')}
                    name="selectedGDPR"
                    value={mailChimpConf?.selectedGDPR}
                    type="text"
                    placeholder={__('GDPR Marketing Preferences...', 'bit-integrations')}
                  />
                </div>
              </ConfirmModal>
            </>
          )}
        </>
      )}
    </div>
  )
}

const languages = [
  { label: 'English', value: 'en' },
  { label: 'Arabic', value: 'ar' },
  { label: 'Afrikaans', value: 'af' },
  { label: 'Belarusian', value: 'be' },
  { label: 'Bulgarian', value: 'bg' },
  { label: 'Catalan', value: 'ca' },
  { label: 'Chinese', value: 'zh' },
  { label: 'Croatian', value: 'hr' },
  { label: 'Czech', value: 'cs' },
  { label: 'Danish', value: 'da' },
  { label: 'Dutch', value: 'nl' },
  { label: 'Estonian', value: 'et' },
  { label: 'Farsi', value: 'fa' },
  { label: 'Finnish', value: 'fi' },
  { label: 'French (France)', value: 'fr' },
  { label: 'French (Canada)', value: 'fr_CA' },
  { label: 'German', value: 'de' },
  { label: 'Greek', value: 'el' },
  { label: 'Hebrew', value: 'he' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Hungarian', value: 'hu' },
  { label: 'Icelandic', value: 'is' },
  { label: 'Indonesian', value: 'id' },
  { label: 'Irish', value: 'ga' },
  { label: 'Italian', value: 'it' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Khmer', value: 'km' },
  { label: 'Korean', value: 'ko' },
  { label: 'Latvian', value: 'lv' },
  { label: 'Lithuanian', value: 'lt' },
  { label: 'Maltese', value: 'mt' },
  { label: 'Malay', value: 'ms' },
  { label: 'Macedonian', value: 'mk' },
  { label: 'Norwegian', value: 'no' },
  { label: 'Polish', value: 'pl' },
  { label: 'Portuguese (Brazil)', value: 'pt' },
  { label: 'Portuguese (Portugal)', value: 'pt_PT' },
  { label: 'Romanian', value: 'ro' },
  { label: 'Russian', value: 'ru' },
  { label: 'Serbian', value: 'sr' },
  { label: 'Slovak', value: 'sk' },
  { label: 'Slovenian', value: 'sl' },
  { label: 'Spanish (Mexico)', value: 'es' },
  { label: 'Spanish (Spain)', value: 'es_ES' },
  { label: 'Swahili', value: 'sw' },
  { label: 'Swedish', value: 'sv' },
  { label: 'Tamil', value: 'ta' },
  { label: 'Thai', value: 'th' },
  { label: 'Turkish', value: 'tr' },
  { label: 'Ukrainian', value: 'uk' },
  { label: 'Vietnamese', value: 'vi' }
]
