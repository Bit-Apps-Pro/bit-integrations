import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const getWPCoursewareActions = (wpCoursewareConf, setWPCoursewareConf) => {
  const response = bitsFetch({}, 'wpCourseware_actions')
    .then(result => {
      const newConf = { ...wpCoursewareConf }
      if (result.data.WPCWActions) {
        newConf.default.WPCWActions = result.data.WPCWActions
      }
      getWPCoursewareCourses(newConf, setWPCoursewareConf)
    })

  toast.promise(response, {
    success: __('Action Refreshed', 'bit-integrations'),
    error: __('Failed, Try Again', 'bit-integrations'),
    loading: __('Fetching...'),
  })
}

export const getWPCoursewareCourses = (wpCoursewareConf, setWPCoursewareConf) => {
  const response = bitsFetch({}, 'wpCourseware_courses')
    .then(result => {
      const newConf = { ...wpCoursewareConf }
      if (result.data.WPCWCourses) {
        newConf.default.WPCWCourses = result.data.WPCWCourses
      }
      setWPCoursewareConf({ ...newConf })
    })

  toast.promise(response, {
    success: __('Course Refreshed', 'bit-integrations'),
    error: __('Failed, Try Again', 'bit-integrations'),
    loading: __('Fetching...'),
  })
}

export const handleInput = (e, wpCoursewareConf, setWPCoursewareConf) => {
  const newConf = { ...wpCoursewareConf }
  newConf.name = e.target.value
  setWPCoursewareConf({ ...newConf })
}
