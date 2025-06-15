// eslint-disable-next-line import/no-extraneous-dependencies
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import { getWPCoursewareCourses } from './WPCoursewareCommonFunc'
import Note from '../../Utilities/Note'

export default function WPCoursewareIntegLayout({ wpCoursewareConf, setWPCoursewareConf, isLoading, setIsLoading, setSnackbar }) {
  const inputHandler = ({ target: { name, value } }) => {
    setWPCoursewareConf({ ...wpCoursewareConf, [name]: value })
  }

  const setCourses = (val) => {
    const newConf = { ...wpCoursewareConf }

    if (val.includes('select_all_course')) {
      newConf.selectedAllCourse = wpCoursewareConf.default.WPCWCourses
        .filter(course => course.id !== 'select_all_course')
        .map(course => course.id)
    } else {
      delete newConf.selectedAllCourse
    }

    newConf.course = val ? val.split(',') : []
    setWPCoursewareConf({ ...newConf })
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('WP Courseware Actions:', 'bit-integrations')}</b>
        <select onChange={(e) => inputHandler(e)} name="action" value={wpCoursewareConf.action} className="btcd-paper-inp w-5">
          <option value="">{__('Select Action', 'bit-integrations')}</option>
          {wpCoursewareConf?.default?.WPCWActions && Object.values(wpCoursewareConf.default.WPCWActions).map(({ id, title }) => (
            <option key={`${id}-1`} value={id}>
              {title}
            </option>
          ))}
        </select>
      </div>

      {wpCoursewareConf?.action && (
        <div className="flx mt-4">
          <b className="wdt-200 d-in-b">{__('WP Courseware Courses: ', 'bit-integrations')}</b>
          <MultiSelect
            defaultValue={wpCoursewareConf?.course}
            className="btcd-paper-drpdwn w-5"
            options={wpCoursewareConf?.default?.WPCWCourses && Object.values(wpCoursewareConf.default.WPCWCourses).map(({ id, title }) => ({ label: title, value: id.toString() }))}
            onChange={val => setCourses(val)}
          />
          <button onClick={() => getWPCoursewareCourses(wpCoursewareConf, setWPCoursewareConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh WP Courseware Courses', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
        </div>
      )}
      <br />
      <br />
      <Note
        note="This integration will only work for logged-in users."
      />
    </>
  )
}
