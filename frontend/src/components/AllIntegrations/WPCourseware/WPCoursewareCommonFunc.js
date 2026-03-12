import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'
import { create } from 'mutative'

export const getWPCoursewareCourses = (wpCoursewareConf, setWPCoursewareConf) => {
  const response = bitsFetch({}, 'wpCourseware_courses').then(result => {
    const newConf = { ...wpCoursewareConf }
    setWPCoursewareConf(prevConf =>
      create(prevConf, draftConf => {
        if (result.data.WPCWCourses) {
          draftConf.default.WPCWCourses = result.data.WPCWCourses
        }
      })
    )
  })

  toast.promise(response, {
    success: __('Course Refreshed', 'bit-integrations'),
    error: __('Failed, Try Again', 'bit-integrations'),
    loading: __('Fetching...')
  })
}

export const handleInput = (e, wpCoursewareConf, setWPCoursewareConf) => {
  const newConf = { ...wpCoursewareConf }
  newConf.name = e.target.value
  setWPCoursewareConf({ ...newConf })
}
