/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
import { createContext, useReducer } from 'react'

const AllFormsDispatchHandler = (allForms, action) => {
  switch (action.type) {
    case 'add':
      return [...allForms, action.data]
    case 'remove': {
      allForms.splice(action.data, 1)
      return [...allForms]
    }
    case 'update': {
      allForms.map(form => {
        if (form.formID === action.data.formID) {
          Object.entries(action?.data || {})?.forEach(([field]) => {
            form[field] = action.data[field]
          })
        }
        return null
      })
      return [...allForms]
    }
    case 'set': {
      allForms = typeof action.data === 'undefined' ? [] : action.data
      return [...allForms]
    }
    default:
      break
  }
  return null
}
const reportsReducer = (reports, action) => {
  switch (action.type) {
    case 'add':
      return [...reports, action.report]
    case 'remove': {
      reports.splice(action.rport, 1)
      return [...reports]
    }
    case 'update': {
      const oldReports = [...reports]
      oldReports[action.reportID] = action.report
      return [...oldReports]
    }
    case 'set': {
      reports = typeof action.reports === 'undefined' ? [] : action.reports
      return [...reports]
    }
    default:
      break
  }
  return null
}

const AllFormContext = createContext()

const AllFormContextProvider = props => {
  let allFormsInitialState = []
  //  eslint-disable-next-line no-undef
  if (typeof btcbi !== 'undefined' && btcbi.allForms !== null) {
    allFormsInitialState = btcbi?.allForms?.map(form => ({
      formID: form.id,
      status: form.gclid,
      formName: form.title,
      shortcode: `wpforms id='${form.id}'`
    }))
  }
  const [allForms, allFormsDispatchHandler] = useReducer(AllFormsDispatchHandler, allFormsInitialState)

  return (
    <AllFormContext.Provider value={{ allFormsData: { allForms, allFormsDispatchHandler } }}>
      {props.children}
    </AllFormContext.Provider>
  )
}

export { AllFormContextProvider }
