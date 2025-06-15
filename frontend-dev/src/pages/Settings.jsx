import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAsyncDebounce } from 'react-table'
import SingleToggle2 from '../components/Utilities/SingleToggle2'
import SnackMsg from '../components/Utilities/SnackMsg'
import bitsFetch from '../Utils/bitsFetch'
import { __ } from '../Utils/i18nwrap'

function Settings() {
  const [appConf, setAppConf] = useState({})
  const [snack, setSnackbar] = useState({ show: false })

  useEffect(() => {
    const loadFetch = bitsFetch({}, 'get/config', null, 'GET')
      .then(res => {
        if ('success' in res && res.success) {
          setAppConf(res.data)
        }
        if (res?.success) return 'Successfully fetched'
        return 'Error'
      })

    toast.promise(loadFetch, {
      success: data => data,
      error: __('Error Occurred', 'bit-integrations'),
      loading: __('Fetching...'),
    })
  }, [])

  const updatePluginConfig = (name) => {
    const config = { ...appConf }
    const loadSaving = bitsFetch({ data: config }, 'app/config')
      .then(res => {
        if ('success' in res && res.success) {
          return 'Save successfully done'
        }
        delete config[name]
        setAppConf({ ...config })
      }).catch(() => 'Failed to save')

    toast.promise(loadSaving, {
      success: data => data,
      error: __('Error Occurred', 'bit-integrations'),
      loading: __('Updating...'),
    })
  }

  const debouncedUpdatePluginConfig = useAsyncDebounce(updatePluginConfig, 500)

  const checkboxHandle = ({ target: { name, checked } }) => {
    const config = { ...appConf }
    if (checked) {
      config[name] = true
    } else {
      delete config[name]
    }
    setAppConf(config)
    debouncedUpdatePluginConfig(name)
  }

  const inputHandle = ({ target: { name, value } }) => {
    const config = { ...appConf }
    if (value) {
      config[name] = value
    } else {
      delete config[name]
    }
    setAppConf(config)
    debouncedUpdatePluginConfig(name)
  }
  return (
    <div className="btcd-f-settings">
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div id="btcd-settings-wrp" className="btcd-s-wrp">
        <div className="w-6 mt-3">
          <div className="flx flx-between sh-sm br-10 btcd-setting-opt">
            <div>
              <b>
                <span className="btcd-icn  icn-trash-fill mr-2" />
                {__('Erase all data of this plugin in deletion', 'bit-integrations')}
              </b>
            </div>
            <SingleToggle2 action={checkboxHandle} name="erase_db" checked={appConf?.erase_db} className="flx" />
          </div>
          <br />
        </div>
        <div className="w-6 mt-3">
          <div className="flx flx-between sh-sm br-10 btcd-setting-opt">
            <div className="">
              <b>
                <span className="btcd-icn icn-trash-fill mr-2" />
                {__('Specify after how many days  old log will be deleted', 'bit-integrations')}
              </b>
            </div>
            <div className="flx">
              <input onChange={inputHandle} name="day" value={appConf?.day} disabled={!appConf.enable_log_del} className="btcd-paper-inp mr-2 wdt-100" placeholder="Day" type="number" min="1" />
              <SingleToggle2 action={checkboxHandle} name="enable_log_del" checked={appConf?.enable_log_del} className="flx" />
            </div>
          </div>
        </div>
        <div className="mb-50" />
      </div>
    </div>
  )
}

export default Settings
