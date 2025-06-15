/* eslint-disable no-unused-expressions */
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { getAllCourses, getAllLesson } from './AcademyLmsCommonFunc'
import Note from '../../Utilities/Note'

export default function AcademyLmsIntegLayout({ academyLmsConf, setAcademyLmsConf, isLoading, setIsLoading }) {
  const action = [
    { value: 'enroll-course', label: 'Enroll the user in a course' },
    { value: 'unenroll-course', label: 'Unenroll user from a course' },
    { value: 'complete-course', label: 'Mark a course complete for the user' },
    { value: 'complete-lesson', label: 'Mark a lesson complete for the user' },
    { value: 'reset-course', label: 'Reset the user progress in a course' },
  ]

  const handleAction = (e) => {
    const newConf = { ...academyLmsConf }
    const { name, value } = e.target
    if (e.target.value !== '') {
      newConf[name] = value
    } else {
      delete newConf[name]
    }
    if (name === 'actionName') {
      if (newConf?.selectedCourse) delete newConf.selectedCourse
      if (newConf?.selectedLesson) delete newConf.selectedLesson
      if (newConf?.selectedAllCourse) delete newConf.selectedAllCourse
      setAcademyLmsConf({ ...newConf })

      if (value !== '') {
        getAllCourses(newConf, setAcademyLmsConf, setIsLoading, value)
        if (value === 'complete-lesson') {
          getAllLesson(newConf, setAcademyLmsConf, setIsLoading)
        }
      }
    } else {
      setAcademyLmsConf({ ...newConf })
    }
  }

  const setChanges = (val, type) => {
    const newConf = { ...academyLmsConf }
    if (val) {
      if (type === 'selectedCourse' && val.includes('all-course')) {
        newConf.selectedAllCourse = newConf.default.courses
      }
      newConf[type] = val ? val.split(',') : []
    } else {
      newConf?.selectedAllCourse && delete newConf.selectedAllCourse
    }
    setAcademyLmsConf({ ...newConf })
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Action:', 'bit-integrations')}</b>
        <select onChange={handleAction} name="actionName" value={academyLmsConf?.actionName} className="btcd-paper-inp w-5">
          <option value="">{__('Select Action', 'bit-integrations')}</option>
          {
            action.map(({ label, value }) => (
              <option key={label} value={value}>
                {label}
              </option>
            ))
          }
        </select>
      </div>
      <br />

      {
        (academyLmsConf?.actionName === 'enroll-course' || academyLmsConf?.actionName === 'unenroll-course' || academyLmsConf?.actionName === 'complete-course' || academyLmsConf?.actionName === 'reset-course' || academyLmsConf?.actionName === 'complete-lesson')
        && (
          <div className="flx">
            <b className="wdt-200 d-in-b">{__('Select Course: ', 'bit-integrations')}</b>
            <MultiSelect
              defaultValue={academyLmsConf?.selectedCourse}
              className="btcd-paper-drpdwn w-5"
              options={academyLmsConf?.default?.courses && academyLmsConf.default.courses.map(course => ({ label: course.courseTitle, value: course.courseId.toString() }))}
              onChange={val => setChanges(val, 'selectedCourse')}
              singleSelect={academyLmsConf?.actionName === 'complete-course' || academyLmsConf?.actionName === 'complete-lesson' || academyLmsConf?.actionName === 'reset-course'}
            />
            <button onClick={() => getAllCourses(academyLmsConf, setAcademyLmsConf, setIsLoading, academyLmsConf?.actionName)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Courses', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
          </div>
        )
      }
      <br />
      {
        (academyLmsConf?.actionName === 'complete-lesson')
        && (

          <div className="flx">
            <b className="wdt-200 d-in-b">{__('Select Lessons: ', 'bit-integrations')}</b>
            <MultiSelect
              defaultValue={academyLmsConf?.selectedLesson}
              className="btcd-paper-drpdwn w-5"
              options={academyLmsConf?.default?.lessons && academyLmsConf.default.lessons.map(lesson => ({ label: lesson.lessonTitle, value: lesson.lessonId.toString() }))}
              onChange={val => setChanges(val, 'selectedLesson')}
              singleSelect
            />
            <button onClick={() => getAllLesson(academyLmsConf, setAcademyLmsConf, setIsLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Courses', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>

          </div>

        )
      }

      <br />
      <br />
      {
        isLoading && (
          <Loader style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
            transform: 'scale(0.7)',
          }}
          />
        )
      }
      <Note
        note="This integration will only work for logged-in users."
      />
    </>
  )
}
