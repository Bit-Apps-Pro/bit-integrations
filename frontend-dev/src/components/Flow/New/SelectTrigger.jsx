/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-undef */
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $btcbi, $flowStep, $newFlow } from '../../../GlobalStates'
import useFetch from '../../../hooks/useFetch'
import CloseIcn from '../../../Icons/CloseIcn'
import { deepCopy, sortObj } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import CustomTrigger from '../../Triggers/CustomTrigger'
import FormPlugin from '../../Triggers/FormPlugin'
import Webhook from '../../Triggers/Webhook'
import ActionHook from '../../Triggers/ActionHook'
import GetLogo from '../../../Utils/GetLogo'
import EssentialBlocksHelper from '../../Triggers/TriggerHelpers/EssentialBlocksHelper'
import SpectraHelper from '../../Triggers/TriggerHelpers/SpectraHelper'
import CustomFormSubmission from '../../Triggers/CustomFormSubmission'

export default function SelectTrigger() {
  const { isPro } = useRecoilValue($btcbi)
  const loaderStyle = {
    display: 'flex',
    height: '82vh',
    justifyContent: 'center',
    alignItems: 'center',
  }
  const { data, isLoading } = useFetch({ payload: {}, action: 'trigger/list', method: 'GET' })
  const [allTriggers, setAllTriggers] = useState(data || {})
  const [searchValue, setSearchValue] = useState('')
  const flowStep = useRecoilValue($flowStep)
  const [newFlow, setNewFlow] = useRecoilState($newFlow)

  useEffect(() => {
    setAllTriggers({ data: sortFeaturedProducts(data?.data) })
  }, [data])

  const featuredProducts = ['BitForm', 'BitAssist']

  const sortFeaturedProducts = (dataObj = {}) => {
    if (dataObj) {
      const newData = deepCopy(dataObj)
      const ifAnyFeaturedProdFound = featuredProducts.some(pr => pr in newData)
      if (!ifAnyFeaturedProdFound) return sortObj(newData)
      const featuredProductData = featuredProducts.reduce((accr, curr) => {
        const tempAccr = { ...accr }
        if (newData[curr]) {
          tempAccr[curr] = newData[curr]
          delete newData[curr]
        }
        return tempAccr
      }, {})
      const sortedTriggers = sortObj(newData)
      const finalData = { ...featuredProductData, ...sortedTriggers }
      return finalData
    }

    return dataObj
  }

  const searchInteg = (e) => {
    const { value } = e.target
    setSearchValue(value)
    const filtered = Object.entries(data.data).filter((integ) => integ[1].name.toLowerCase().includes(value.toLowerCase())).reduce((prev, [key, values]) => ({ ...prev, [key]: values }), {})
    // const organizeData = filtered?.reduce((prev, [key, values]) => ({ ...prev, [key]: values }), {})
    setAllTriggers({ success: true, data: sortFeaturedProducts(filtered) })
  }

  const setTrigger = (trigger) => {
    const tempConf = { ...newFlow }
    tempConf.triggered_entity = trigger
    tempConf.triggerDetail = allTriggers.data[trigger]
    setNewFlow(tempConf)
  }

  const removeTrigger = () => {
    const tempConf = { ...newFlow }
    delete tempConf.triggered_entity
    setNewFlow(tempConf)
  }
  if (isLoading) {
    return (
      <Loader style={loaderStyle} />
    )
  }

  if (data?.success === false) {
    return (
      <div>
        <h1 className="txt-center mt-5">License is not active </h1>
        <h3 className="txt-center mt-5">Make unlimited integration you need license active first. </h3>
      </div>
    )
  }

  return (
    <>
      {newFlow.triggered_entity
        ? (
          <>
            <div role="button" className="btcd-inte-card flx flx-center flx-wrp mr-4 mt-3" tabIndex="0">
              <GetLogo name={newFlow.triggered_entity} extension="webp" />
              <div className="txt-center">
                {allTriggers.data[newFlow.triggered_entity]?.name}
              </div>
              <button onClick={removeTrigger} className="icn-btn btcd-mdl-close" aria-label="modal-close" type="button"><CloseIcn size={16} stroke={3} /></button>
            </div>
            <div className="flx">
              {newFlow.triggerDetail?.type === 'form' && flowStep === 1 && <FormPlugin />}
              {newFlow.triggerDetail?.type === 'webhook' && flowStep === 1 && <Webhook />}
              {newFlow.triggerDetail?.type === 'custom_trigger' && flowStep === 1 && <CustomTrigger />}
              {newFlow.triggerDetail?.type === 'action_hook' && flowStep === 1 && <ActionHook />}
              {newFlow.triggerDetail?.type === 'spectra' && flowStep === 1 && <SpectraHelper />}
              {newFlow.triggerDetail?.type === 'essentialBlocks' && flowStep === 1 && <EssentialBlocksHelper />}
              {newFlow.triggerDetail?.type === 'custom_form_submission' && flowStep === 1 && <CustomFormSubmission />}
            </div>
          </>
        ) : (
          <>
            <div className=" btcd-inte-wrp txt-center">
              <h2 className="mt-0">Please select a Trigger</h2>
              <input type="search" className="btcd-paper-inp w-5 mb-2" onChange={searchInteg} value={searchValue} placeholder="Search Trigger..." autoFocus />
              <div className="flx flx-center flx-wrp pb-3">
                {allTriggers?.data && Object.keys(allTriggers?.data).map((inte, i) => (
                  <div
                    key={`inte-sm-${i + 2}`}
                    onClick={() => !inte.disable && (isPro || !allTriggers?.data[inte]?.isPro) && setTrigger(inte)}
                    onKeyUp={() => !inte.disable && (isPro || !allTriggers?.data[inte]?.isPro) && setNewInteg(inte.type)}
                    role="button"
                    tabIndex="0"
                    className={`btcd-inte-card inte-sm mr-4 mt-3 ${inte.disable && (isPro || !allTriggers?.data[inte]?.isPro) && 'btcd-inte-dis'} ${(allTriggers?.data[inte]?.isPro && !isPro) && 'btcd-inte-pro'}`}
                  >
                    {(allTriggers?.data[inte]?.isPro && !isPro) && (
                      <div className="pro-filter">
                        <span className="txt-pro"><a href="https://www.bitapps.pro" target="_blank" rel="noreferrer">{__('Premium', 'bit-integrations')}</a></span>
                      </div>
                    )}
                    <GetLogo name={inte} extension="webp" />
                    <div className="txt-center">
                      {allTriggers?.data[inte]?.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
    </>
  )
}
