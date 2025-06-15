import { useEffect } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import BuddyBossActions from './BuddyBossActions'
import { getAllBuddyBossGroup, getAllForum, getAllTopic, getAllUser } from './BuddyBossCommonFunc'
import BuddyBossFieldMap from './BuddyBossFieldMap'
import Note from '../../Utilities/Note'

export default function BuddyBossIntegLayout({ formFields, handleInput, buddyBossConf, setBuddyBossConf, isLoading, setIsLoading, setSnackbar, allIntegURL, isInfo, edit }) {
  useEffect(() => {
    if (['2', '6', '8', '9'].includes(buddyBossConf?.mainAction)) {
      getAllBuddyBossGroup(buddyBossConf, setBuddyBossConf, setIsLoading, setSnackbar)
    }
    if (['3', '4', '8', '9', '10', '12', '15', '16'].includes(buddyBossConf?.mainAction)) {
      getAllUser(buddyBossConf, setBuddyBossConf, setIsLoading, setSnackbar)
    }
    if (['5', '13', '17'].includes(buddyBossConf?.mainAction)) {
      getAllForum(buddyBossConf, setBuddyBossConf, setIsLoading, setSnackbar)
    }
  }, [buddyBossConf.mainAction])

  const changeHandler = (val, name) => {
    const newConf = { ...buddyBossConf }
    if (name === 'groupId') {
      if (val !== '') {
        newConf[name] = val
      } else {
        delete newConf[name]
      }
    }
    if (name === 'friendId') {
      if (val !== '') {
        newConf[name] = val
      } else {
        delete newConf[name]
      }
    }
    if (name === 'forumId') {
      if (val !== '') {
        newConf[name] = val
      } else {
        delete newConf[name]
      }
    }
    if (name === 'topicId') {
      if (val !== '') {
        newConf[name] = val
      } else {
        delete newConf[name]
      }
    }
    if (name === 'userStatusId') {
      if (val !== '') {
        newConf[name] = val
      } else {
        delete newConf[name]
      }
    }
    setBuddyBossConf({ ...newConf })
  }

  const getFields = (e) => {
    let buddyBossFields = []
    if (buddyBossConf?.mainAction === '1') {
      buddyBossFields = buddyBossConf?.createGroupFields || []
    } else if (buddyBossConf?.mainAction === '5') {
      buddyBossFields = buddyBossConf?.topicInForumFields || []
    } else if (buddyBossConf?.mainAction === '8' || buddyBossConf?.mainAction === '11') {
      buddyBossFields = buddyBossConf?.sendAllUserNotificationFields || []
    } else if (buddyBossConf?.mainAction === '9' || buddyBossConf?.mainAction === '10') {
      buddyBossFields = buddyBossConf?.sendAllGroupPrivateMessageFields || []
    } else if (buddyBossConf?.mainAction === '14') {
      buddyBossFields = buddyBossConf?.addPostToGroupFields || []
    } else if (buddyBossConf?.mainAction === '15' || buddyBossConf?.mainAction === '16') {
      buddyBossFields = buddyBossConf?.addPostSiteWideActivityStreamFields || []
    } else if (buddyBossConf?.mainAction === '17') {
      buddyBossFields = buddyBossConf?.postReplyTopicForumFields || []
    }
    return buddyBossFields
  }

  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('Actions:', 'bit-integrations')}</b>
      <select onChange={handleInput} name="mainAction" value={buddyBossConf?.mainAction} className="btcd-paper-inp w-5">
        <option value="">{__('Select Actions', 'bit-integrations')}</option>
        {
          buddyBossConf?.allActions && buddyBossConf.allActions.map(({ key, label }) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))
        }
      </select>
      <br />
      <br />
      {['2', '6', '8', '9', '14'].includes(buddyBossConf?.mainAction) && (
        <>
          <br />
          <div className="flx mt-4">
            <b className="wdt-200 d-in-b">{__('Select Group: ', 'bit-integrations')}</b>
            <MultiSelect
              className="w-5"
              defaultValue={buddyBossConf?.groupId}
              options={buddyBossConf?.default?.allGroup && buddyBossConf.default.allGroup.map((item) => ({ label: item.name, value: item.id }))}
              onChange={(val) => changeHandler(val, 'groupId')}
              singleSelect
            />
            <button onClick={() => getAllBuddyBossGroup(buddyBossConf, setBuddyBossConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Fetch All Groups', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
          </div>
        </>
      )}

      {['3', '4', '7', '8', '9', '10', '12', '14', '15', '16'].includes(buddyBossConf?.mainAction) && (
        <>
          <br />
          <div className="flx mt-4">
            <b className="wdt-200 d-in-b">{__(`${buddyBossConf.mainAction === '8' ? 'Sender User' : 'Select User'}`, 'bit-integrations')}</b>
            <MultiSelect
              className="w-5"
              defaultValue={buddyBossConf?.friendId}
              options={buddyBossConf?.default?.allUser && buddyBossConf.default.allUser.map((item) => ({ label: item.display_name, value: item.ID }))}
              onChange={(val) => changeHandler(val, 'friendId')}
              singleSelect={buddyBossConf?.mainAction !== '12'}
            />
            <button onClick={() => getAllUser(buddyBossConf, setBuddyBossConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Fetch All User', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
          </div>
        </>
      )}

      {['5', '13', '17'].includes(buddyBossConf?.mainAction) && (
        <>
          <br />
          <div className="flx mt-4">
            <b className="wdt-200 d-in-b">{__('Select Forum: ', 'bit-integrations')}</b>
            <MultiSelect
              className="w-5"
              defaultValue={buddyBossConf?.forumId}
              options={buddyBossConf?.default?.allForum && buddyBossConf.default.allForum.map((item) => ({ label: item.forum_title, value: item.forum_id.toString() }))}
              onChange={(val) => changeHandler(val, 'forumId')}
              singleSelect={buddyBossConf?.mainAction !== '13'}
            />
            <button onClick={() => getAllForum(buddyBossConf, setBuddyBossConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Fetch All Forum', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
          </div>
        </>
      )}
      {buddyBossConf?.forumId !== undefined && ['17'].includes(buddyBossConf?.mainAction) && (
        <>
          <br />
          <div className="flx mt-4">
            <b className="wdt-200 d-in-b">{__('Select Topic: ', 'bit-integrations')}</b>
            <MultiSelect
              className="w-5"
              defaultValue={buddyBossConf?.topicId}
              options={buddyBossConf?.default?.allTopic && buddyBossConf.default.allTopic.map((item) => ({ label: item.topic_title, value: item.topic_id.toString() }))}
              onChange={(val) => changeHandler(val, 'topicId')}
              singleSelect
            />
            <button onClick={() => getAllTopic(buddyBossConf, setBuddyBossConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Fetch All Topic', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
          </div>
        </>
      )}

      {['18'].includes(buddyBossConf?.mainAction) && (
        <>
          <br />
          <div className="flx mt-4">
            <b className="wdt-200 d-in-b">{__('Select Status: ', 'bit-integrations')}</b>
            <MultiSelect
              className="w-5"
              defaultValue={buddyBossConf?.userStatusId}
              options={buddyBossConf.userStatusOptions.map((item) => ({ label: item.label, value: item.key }))}
              onChange={(val) => changeHandler(val, 'userStatusId')}
              singleSelect
            />
          </div>
        </>
      )}

      <br />
      <br />
      {isLoading && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}

      <>
        {['1', '5', '8', '9', '10', '11', '14', '15', '16', '17'].includes(buddyBossConf?.mainAction) && (
          <>
            <div className="mt-4">
              <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
            </div>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp"><b>{__('BuddyBoss Fields', 'bit-integrations')}</b></div>
            </div>
            {buddyBossConf.field_map.map((itm, i) => (
              <BuddyBossFieldMap
                key={`rp-m-${i + 9}`}
                i={i}
                field={itm}
                buddyBossConf={buddyBossConf}
                formFields={formFields}
                setBuddyBossConf={setBuddyBossConf}
                setSnackbar={setSnackbar}
                mainAction={buddyBossConf?.mainAction}
                buddyBossFields={getFields()}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(buddyBossConf.field_map.length, buddyBossConf, setBuddyBossConf)} className="icn-btn sh-sm" type="button">+</button></div>
          </>
        )}
        <br />
        <br />
        {buddyBossConf.mainAction === '1' && (
          <>
            <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
            <div className="btcd-hr mt-1" />
            <BuddyBossActions
              buddyBossConf={buddyBossConf}
              setBuddyBossConf={setBuddyBossConf}
              formFields={formFields}
            />
          </>
        )}
      </>
      <br />
      <Note
        note="Some integrations will only work for logged-in users."
      />
    </>
  )
}
