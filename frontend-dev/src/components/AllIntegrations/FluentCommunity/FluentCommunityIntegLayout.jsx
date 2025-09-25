import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import FluentCommunityActions from './FluentCommunityActions'
import {
  refreshCommunityList,
  refreshFluentCommunityHeader,
  refreshMemberRoles,
  refreshCourseList,
  refreshUserList
} from './FluentCommunityCommonFunc'
import FluentCommunityFieldMap from './FluentCommunityFieldMap'

export default function FluentCommunityIntegLayout({
  formID,
  formFields,
  fluentCommunityConf,
  setFluentCommunityConf,
  isLoading,
  setIsLoading,
  loading,
  setLoading,
  setSnackbar
}) {
  const action = [
    { value: 'add-user', label: __('Add user to space', 'bit-integrations') },
    { value: 'remove-user', label: __('Remove user from space', 'bit-integrations') },
    { value: 'add-course', label: __('Add user to course', 'bit-integrations') },
    { value: 'remove-course', label: __('Remove user from course', 'bit-integrations') },
    { value: 'create-post', label: __('Create new post in feed', 'bit-integrations') }
  ]

  const inputHendler = e => {
    const newConf = { ...fluentCommunityConf }
    if (e.target.name === 'list_id') {
      newConf.list_id = e.target.value
    } else if (e.target.name === 'course_id') {
      newConf.course_id = e.target.value
    } else if (e.target.name === 'post_space_id') {
      newConf.post_space_id = e.target.value
    } else if (e.target.name === 'post_user_id') {
      newConf.post_user_id = e.target.value
    }
    setFluentCommunityConf({ ...newConf })
  }

  const memberRoleHandler = e => {
    const newConf = { ...fluentCommunityConf }
    newConf.member_role = e.target.value
    setFluentCommunityConf({ ...newConf })
  }

  const handleAction = e => {
    const newConf = { ...fluentCommunityConf }
    const { name, value } = e.target
    delete newConf?.fluentCommunityList
    delete newConf?.fluentCommunityTags

    if (e.target.value !== '') {
      newConf[name] = value
      refreshFluentCommunityHeader(newConf, setFluentCommunityConf, setIsLoading, setSnackbar)

      if (value === 'add-user' || value === 'remove-user') {
        refreshCommunityList(formID, newConf, setFluentCommunityConf, loading, setLoading, setSnackbar)
        refreshMemberRoles(newConf, setFluentCommunityConf, loading, setLoading, setSnackbar)
      }
      if (value === 'add-course' || value === 'remove-course') {
        refreshCourseList(formID, newConf, setFluentCommunityConf, loading, setLoading, setSnackbar)
      }
      if (value === 'create-post') {
        refreshCommunityList(formID, newConf, setFluentCommunityConf, loading, setLoading, setSnackbar)
        refreshUserList(formID, newConf, setFluentCommunityConf, loading, setLoading, setSnackbar)
      }
    } else {
      delete newConf[name]
    }
    setFluentCommunityConf(newConf)
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Action:', 'bit-integrations')}</b>
        <select
          onChange={handleAction}
          name="actionName"
          value={fluentCommunityConf?.actionName}
          className="btcd-paper-inp w-5">
          <option value="">{__('Select Action', 'bit-integrations')}</option>
          {action.map(({ label, value }) => (
            <option key={label} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <br />
      {(loading.fluentCommunityList ||
        loading.memberRoles ||
        loading.fluentCommunityCourses ||
        loading.fluentCommunityUsers) && (
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
      {(fluentCommunityConf?.actionName === 'add-user' ||
        fluentCommunityConf?.actionName === 'remove-user') &&
        fluentCommunityConf?.fluentCommunityList &&
        !loading.fluentCommunityList && (
          <div className="flx">
            <b className="wdt-200 d-in-b">{__('Fluent Community Space:', 'bit-integrations')}</b>
            <select
              onChange={e => inputHendler(e)}
              name="list_id"
              value={fluentCommunityConf.list_id}
              className="btcd-paper-inp w-5">
              <option value="">{__('Select Fluent Community space', 'bit-integrations')}</option>
              {fluentCommunityConf?.fluentCommunityList &&
                Object.keys(fluentCommunityConf.fluentCommunityList).map(fluentCommunityListName => (
                  <option
                    key={fluentCommunityListName}
                    value={fluentCommunityConf.fluentCommunityList[fluentCommunityListName].id}>
                    {fluentCommunityConf.fluentCommunityList[fluentCommunityListName].title}
                  </option>
                ))}
            </select>
            <button
              onClick={() =>
                refreshCommunityList(
                  formID,
                  fluentCommunityConf,
                  setFluentCommunityConf,
                  loading,
                  setLoading,
                  setSnackbar
                )
              }
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{
                '--tooltip-txt': `'${__('Refresh Spaces & Field', 'bit-integrations')}'`
              }}
              type="button"
              disabled={isLoading}>
              &#x21BB;
            </button>
          </div>
        )}
      {fluentCommunityConf?.actionName === 'add-user' &&
        fluentCommunityConf?.memberRoles &&
        !loading.memberRoles && (
          <div className="flx mt-5">
            <b className="wdt-200 d-in-b">{__('Member Role:', 'bit-integrations')}</b>
            <select
              onChange={memberRoleHandler}
              name="member_role"
              value={fluentCommunityConf.member_role || 'member'}
              className="btcd-paper-inp w-5">
              {fluentCommunityConf?.memberRoles &&
                fluentCommunityConf.memberRoles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.title}
                  </option>
                ))}
            </select>
            <button
              onClick={() =>
                refreshMemberRoles(
                  fluentCommunityConf,
                  setFluentCommunityConf,
                  loading,
                  setLoading,
                  setSnackbar
                )
              }
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{
                '--tooltip-txt': `'${__('Refresh Member Roles', 'bit-integrations')}'`
              }}
              type="button"
              disabled={isLoading}>
              &#x21BB;
            </button>
          </div>
        )}
      {(fluentCommunityConf?.actionName === 'add-course' ||
        fluentCommunityConf?.actionName === 'remove-course') &&
        fluentCommunityConf?.fluentCommunityCourses &&
        !loading.fluentCommunityCourses && (
          <div className="flx mt-5">
            <b className="wdt-200 d-in-b">{__('Fluent Community Course:', 'bit-integrations')}</b>
            <select
              onChange={e => inputHendler(e)}
              name="course_id"
              value={fluentCommunityConf.course_id}
              className="btcd-paper-inp w-5">
              <option value="">{__('Select Fluent Community course', 'bit-integrations')}</option>
              {fluentCommunityConf?.fluentCommunityCourses &&
                Object.keys(fluentCommunityConf.fluentCommunityCourses).map(courseName => (
                  <option
                    key={courseName}
                    value={fluentCommunityConf.fluentCommunityCourses[courseName].id}>
                    {fluentCommunityConf.fluentCommunityCourses[courseName].title}
                  </option>
                ))}
            </select>
            <button
              onClick={() =>
                refreshCourseList(
                  formID,
                  fluentCommunityConf,
                  setFluentCommunityConf,
                  loading,
                  setLoading,
                  setSnackbar
                )
              }
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{
                '--tooltip-txt': `'${__('Refresh Courses', 'bit-integrations')}'`
              }}
              type="button"
              disabled={isLoading}>
              &#x21BB;
            </button>
          </div>
        )}
      {fluentCommunityConf?.actionName === 'create-post' &&
        fluentCommunityConf?.fluentCommunityList &&
        !loading.fluentCommunityList && (
          <div className="flx mt-5">
            <b className="wdt-200 d-in-b">{__('Space:', 'bit-integrations')}</b>
            <select
              onChange={e => inputHendler(e)}
              name="post_space_id"
              value={fluentCommunityConf.post_space_id}
              className="btcd-paper-inp w-5">
              <option value="">{__('Select Space', 'bit-integrations')}</option>
              {fluentCommunityConf?.fluentCommunityList &&
                Object.keys(fluentCommunityConf.fluentCommunityList).map(listName => (
                  <option key={listName} value={fluentCommunityConf.fluentCommunityList[listName].id}>
                    {fluentCommunityConf.fluentCommunityList[listName].title}
                  </option>
                ))}
            </select>
            <button
              onClick={() =>
                refreshCommunityList(
                  formID,
                  fluentCommunityConf,
                  setFluentCommunityConf,
                  loading,
                  setLoading,
                  setSnackbar
                )
              }
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{
                '--tooltip-txt': `'${__('Refresh Spaces', 'bit-integrations')}'`
              }}
              type="button"
              disabled={isLoading}>
              &#x21BB;
            </button>
          </div>
        )}
      {fluentCommunityConf?.actionName === 'create-post' &&
        fluentCommunityConf?.fluentCommunityUsers &&
        !loading.fluentCommunityUsers && (
          <div className="flx mt-5">
            <b className="wdt-200 d-in-b">{__('User:', 'bit-integrations')}</b>
            <select
              onChange={e => inputHendler(e)}
              name="post_user_id"
              value={fluentCommunityConf.post_user_id}
              className="btcd-paper-inp w-5">
              <option value="">{__('Select User', 'bit-integrations')}</option>
              {fluentCommunityConf?.fluentCommunityUsers &&
                Object.keys(fluentCommunityConf.fluentCommunityUsers).map(userName => (
                  <option key={userName} value={fluentCommunityConf.fluentCommunityUsers[userName].id}>
                    {fluentCommunityConf.fluentCommunityUsers[userName].display_name}
                  </option>
                ))}
            </select>
            <button
              onClick={() =>
                refreshUserList(
                  formID,
                  fluentCommunityConf,
                  setFluentCommunityConf,
                  loading,
                  setLoading,
                  setSnackbar
                )
              }
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{
                '--tooltip-txt': `'${__('Refresh Users', 'bit-integrations')}'`
              }}
              type="button"
              disabled={isLoading}>
              &#x21BB;
            </button>
          </div>
        )}
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
      {fluentCommunityConf?.actionName && !isLoading && (
        <>
          <div className="mt-4">
            <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
          </div>
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{__('Fluent Community Fields', 'bit-integrations')}</b>
            </div>
          </div>

          {fluentCommunityConf.field_map.map((itm, i) => (
            <FluentCommunityFieldMap
              key={`fluentcommunity-m-${i + 9}`}
              i={i}
              field={itm}
              fluentCommunityConf={fluentCommunityConf}
              formFields={formFields}
              setFluentCommunityConf={setFluentCommunityConf}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2" style={{ marginRight: 85 }}>
            <button
              onClick={() =>
                addFieldMap(
                  fluentCommunityConf.field_map.length,
                  fluentCommunityConf,
                  setFluentCommunityConf
                )
              }
              className="icn-btn sh-sm"
              type="button">
              +
            </button>
          </div>
        </>
      )}
      {fluentCommunityConf?.actionName === 'add-user' && (
        <>
          <br />
          <div className="mt-4">
            <b className="wdt-100">{__('Utilities', 'bit-integrations')}</b>
          </div>
          <div className="btcd-hr mt-1" />
          <FluentCommunityActions
            fluentCommunityConf={fluentCommunityConf}
            setFluentCommunityConf={setFluentCommunityConf}
            loading={loading}
            setLoading={setLoading}
            setSnackbar={setSnackbar}
          />
        </>
      )}
    </>
  )
}
