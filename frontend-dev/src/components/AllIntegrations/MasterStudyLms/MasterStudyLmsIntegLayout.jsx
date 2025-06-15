import { useEffect } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import { fetchAllLesson, fetchAllMsLmsCourse, fetchAllQuiz } from './MasterStudyLmsCommonFunc'
import Note from '../../Utilities/Note'

export default function MasterStudyLmsIntegLayout({ formFields, handleInput, msLmsConf, setMsLmsConf, isLoading, setIsLoading, setSnackbar, allIntegURL, isInfo, edit }) {
  useEffect(() => {
    if (['1', '2', '3', '4', '5'].includes(msLmsConf.mainAction)) {
      fetchAllMsLmsCourse(msLmsConf, setMsLmsConf, setIsLoading, setSnackbar)
    }
  }, [msLmsConf.mainAction])

  const changeHandler = (val, status) => {
    const newConf = { ...msLmsConf }
    if (val !== '') {
      newConf[status] = val
      if (msLmsConf.mainAction === '2' || msLmsConf.mainAction === '5') {
        fetchAllLesson(newConf, setMsLmsConf, setIsLoading, setSnackbar)
      }
      if (msLmsConf.mainAction === '3') {
        fetchAllQuiz(newConf, setMsLmsConf, setIsLoading, setSnackbar)
      }
    } else {
      delete newConf[status]
    }
    setMsLmsConf({ ...newConf })
  }
  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('Actions:', 'bit-integrations')}</b>
      <select onChange={handleInput} name="mainAction" value={msLmsConf.mainAction} className="btcd-paper-inp w-5">
        <option value="">{__('Select Actions', 'bit-integrations')}</option>
        {
          msLmsConf.allActions && msLmsConf.allActions.map(({ key, label }) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))
        }
      </select>
      <br />
      <br />
      {(['1', '2', '3', '4', '5'].includes(msLmsConf.mainAction)) && (
        <div className="flx mt-4">
          <b className="wdt-200 d-in-b">{__('Select a Course: ', 'bit-integrations')}</b>
          <MultiSelect
            className="w-5"
            singleSelect
            defaultValue={msLmsConf?.courseId}
            options={msLmsConf?.default?.allCourse && msLmsConf.default.allCourse.map((item) => ({ label: item.post_title, value: item.ID.toString() }))}
            onChange={(val) => changeHandler(val, 'courseId')}
          />
          <button onClick={() => fetchAllCourse(msLmsConf, setMsLmsConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Fetch course list', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
        </div>
      )}
      {((msLmsConf.mainAction === '2' || msLmsConf.mainAction === '5') && msLmsConf?.courseId) && (
        <div className="flx mt-4">
          <b className="wdt-200 d-in-b">{__('Select lesson: ', 'bit-integrations')}</b>
          <MultiSelect
            className="w-5"
            singleSelect
            defaultValue={msLmsConf?.lessonId}
            options={msLmsConf?.default?.allLesson && msLmsConf.default.allLesson.map((item) => ({ label: item.post_title, value: item.ID.toString() }))}
            onChange={(val) => changeHandler(val, 'lessonId')}
          />
          <button onClick={() => fetchAllLesson(msLmsConf, setMsLmsConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Fetch lesson list', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
        </div>
      )}
      {(msLmsConf.mainAction === '3' && msLmsConf?.courseId) && (
        <div className="flx mt-4">
          <b className="wdt-200 d-in-b">{__('Select quiz: ', 'bit-integrations')}</b>
          <MultiSelect
            className="w-5"
            singleSelect
            defaultValue={msLmsConf?.quizId}
            options={msLmsConf?.default?.allQuiz && msLmsConf.default.allQuiz.map((item) => ({ label: item.post_title, value: item.ID.toString() }))}
            onChange={(val) => changeHandler(val, 'quizId')}
          />
          <button onClick={() => fetchAllQuiz(msLmsConf, setMsLmsConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Fetch quiz list', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
        </div>
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
      <Note
        note="This integration will only work for logged-in users."
      />
    </>
  )
}
