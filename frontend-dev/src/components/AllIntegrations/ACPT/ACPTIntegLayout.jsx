/* eslint-disable no-unused-vars */
import { create } from 'mutative'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilValue } from 'recoil'
import { $actionConf, $btcbi } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { checkIsPro, getProLabel } from '../../Utilities/ProUtilHelpers'
import { generateMappedField, getAllGenerator } from './ACPTCommonFunc'
import FieldMappingLayout from './FieldMappingLayout'
import ACPTActions from './ACPTActions'
import { cptIcons } from './staticData'

export default function ACPTIntegLayout({
  formFields,
  acptConf,
  setAcptConf,
  loading,
  setLoading,
  isLoading,
  setIsLoading,
  setSnackbar
}) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const setChanges = (val, name) => {
    setAcptConf(prevConf =>
      create(prevConf, draftConf => {
        draftConf[name] = val
        if (name == 'module') {
          const { cptFields, cptLabels, taxonomyFields, taxonomyLabels, optionPageFields } = draftConf

          draftConf.acptFields = []
          draftConf.acptLabels = []

          draftConf.field_map = []
          draftConf.label_field_map = []

          if (val === 'create_cpt' || val === 'update_cpt') {
            draftConf.acptFields =
              val === 'update_cpt'
                ? [{ label: __('Slug', 'bit-integrations'), key: 'slug', required: true }, ...cptFields]
                : cptFields

            draftConf.acptLabels = cptLabels
            draftConf.label_field_map = generateMappedField(cptLabels)
          } else if (val === 'delete_cpt' || val === 'delete_taxonomy') {
            draftConf.acptFields = [
              { label: __('Slug', 'bit-integrations'), key: 'slug', required: true }
            ]
          } else if (val === 'create_taxonomy' || val === 'update_taxonomy') {
            draftConf.acptFields = taxonomyFields
            draftConf.acptLabels = taxonomyLabels

            draftConf.label_field_map = generateMappedField(taxonomyLabels)
          } else if (val === 'associate_taxonomy_to_cpt') {
            draftConf.acptFields = [
              { label: __('Taxonomy Slug', 'bit-integrations'), key: 'taxonomy_slug', required: true },
              { label: __('CPT Slug', 'bit-integrations'), key: 'cpt_slug', required: true }
            ]
          } else if (val === 'create_option_page' || val === 'update_option_page') {
            draftConf.acptFields = optionPageFields
          } else if (val === 'delete_option_page') {
            draftConf.acptFields = [
              { label: __('Menu Slug', 'bit-integrations'), key: 'slug', required: true }
            ]
          } else if (val === 'delete_meta_group') {
            draftConf.acptFields = [
              { label: __('Meta Field Group Id', 'bit-integrations'), key: 'id', required: true }
            ]
          } else if (val === 'delete_dynamic_block') {
            draftConf.acptFields = [
              { label: __('Dynamic Block Id', 'bit-integrations'), key: 'id', required: true }
            ]
          }

          draftConf.field_map = generateMappedField(draftConf.acptFields)
        }
      })
    )
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Select Action:', 'bit-integrations')}</b>
        <MultiSelect
          title="Action"
          defaultValue={acptConf?.module}
          className="mt-2 w-5"
          onChange={val => setChanges(val, 'module')}
          options={acptConf?.modules?.map(action => ({
            label: checkIsPro(isPro, action.is_pro) ? action.label : getProLabel(action.label),
            value: action.name,
            disabled: checkIsPro(isPro, action.is_pro) ? false : true
          }))}
          singleSelect
          closeOnSelect
        />
      </div>

      {isLoading && (
        <Loader
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
            transform: 'scale(0.7)'
          }}
        />
      )}

      {acptConf?.module &&
        ['create_cpt', 'update_cpt', 'create_option_page', 'update_option_page'].includes(
          acptConf.module
        ) &&
        !isLoading && (
          <div className="flx">
            <b className="wdt-200 d-in-b">{__('Select Icon:', 'bit-integrations')}</b>
            <MultiSelect
              title="Icon"
              defaultValue={acptConf?.icon}
              className="mt-2 w-5"
              onChange={val => setChanges(val, 'icon')}
              options={cptIcons}
              singleSelect
              closeOnSelect
            />
          </div>
        )}

      {acptConf.module && (
        <>
          {!isLoading && (
            <FieldMappingLayout
              formFields={formFields}
              acptConf={acptConf}
              setAcptConf={setAcptConf}
              label={__('Field Map', 'bit-integrations')}
              fieldMappingKey="field_map"
              fieldKey="acptFields"
              setSnackbar={setSnackbar}
            />
          )}

          {['create_cpt', 'update_cpt', 'create_taxonomy', 'update_taxonomy'].includes(
            acptConf.module
          ) &&
            !isLoading && (
              <FieldMappingLayout
                formFields={formFields}
                acptConf={acptConf}
                setAcptConf={setAcptConf}
                label={__('Additional labels Field Map', 'bit-integrations')}
                fieldMappingKey="label_field_map"
                fieldKey="acptLabels"
                setSnackbar={setSnackbar}
              />
            )}

          {![
            'delete_cpt',
            'delete_taxonomy',
            'associate_taxonomy_to_cpt',
            'create_option_page',
            'update_option_page',
            'delete_option_page',
            'delete_meta_group',
            'delete_dynamic_block'
          ].includes(acptConf.module) &&
            !isLoading && (
              <>
                <div className="mt-1">
                  <b className="wdt-100">{__('Utilities', 'bit-integrations')}</b>
                </div>
                <div className="btcd-hr mt-1" />
                <ACPTActions
                  acptConf={acptConf}
                  setACPTConf={setAcptConf}
                  loading={loading}
                  setLoading={setLoading}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  setSnackbar={setSnackbar}
                />
              </>
            )}
        </>
      )}
    </>
  )
}
