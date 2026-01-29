import { memo, useCallback, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import noData from '../../resource/img/nodata.svg'
import bitsFetch from '../../Utils/bitsFetch'
import { __ } from '../../Utils/i18nwrap'
import Button from '../Utilities/Button'
import CopyText from '../Utilities/CopyText'
import EyeIcn from '../Utilities/EyeIcn'
import Modal from '../Utilities/Modal'
import Reload from '../Utilities/Reload'
import SnackMsg from '../Utilities/SnackMsg'
import Table from '../Utilities/Table'
import DataPreviewTabs from './DataPreviewTabs'

function Log({ allIntegURL }) {
  const { id, type } = useParams()
  const [snack, setSnackbar] = useState({ show: false })
  const fetchIdRef = useRef(0)
  const [confMdl, setconfMdl] = useState({ show: false })
  const [pageCount, setPageCount] = useState(0)
  const [countEntries, setCountEntries] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [refreshLog, setRefreshLog] = useState(0)
  const [response, setResponse] = useState(false)
  const [dataPreview, setDataPreview] = useState({ input: null, output: null })

  const [log, setLog] = useState([])
  const [cols, setCols] = useState([
    {
      width: 100,
      minWidth: 80,
      Header: __('Status', 'bit-integrations'),
      accessor: 'response_type'
    },
    {
      width: 400,
      minWidth: 80,
      Header: __('Record Type', 'bit-integrations'),
      accessor: 'api_type'
    },
    { width: 220, minWidth: 200, Header: __('Date', 'bit-integrations'), accessor: 'created_at' },
    {
      width: 100,
      minWidth: 200,
      Header: __('Response', 'bit-integrations'),
      accessor: 'response_obj',
      Cell: val => (
        <>
          <Button
            type="button"
            className="btn btcd-btn-o-blue ml-1"
            style={{
              padding: '5px 12px',
              fontSize: '13px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onClick={() => {
              setDataPreview({
                input: val.row.original.field_data,
                output: val.row.values.response_obj
              })
              setResponse(true)
            }}>
            <EyeIcn width="16" height="16" />
            <span>{__('View', 'bit-integrations')}</span>
          </Button>
        </>
      )
    },
    {
      width: 180,
      minWidth: 120,
      Header: __('Re-execute', 'bit-integrations'),
      accessor: 'id',
      Cell: val => (
        <>
          {val.row.original.field_data && (
            <Button
              type="button"
              className="btn btcd-btn-o-purple"
              style={{
                padding: '5px 12px',
                fontSize: '13px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              disabled={isLoading}
              onClick={() => handleReexecute(val.row.original.id)}>
              <Reload width="16" height="16" />
              <span>{__('Re-execute', 'bit-integrations')}</span>
            </Button>
          )}
        </>
      )
    }
  ])
  const setTableCols = useCallback(newCols => {
    setCols(newCols)
  }, [])
  // route is info/:id but for redirect uri need to make new/:type
  // const location = window.location.toString()

  // const toReplaceInd = location.indexOf('/info')
  // location = window.encodeURI(`${location.slice(0, toReplaceInd)}/new/${integrations[id].type}`)

  const closeConfMdl = useCallback(() => {
    confMdl.show = false
    setconfMdl({ ...confMdl })
  }, [confMdl])

  const setBulkDelete = useCallback((rows, action) => {
    const rowID = []
    const entries = []
    if (typeof rows[0] === 'object') {
      for (let i = 0; i < rows.length; i += 1) {
        rowID.push(rows[i].id)
        entries.push(rows[i].original.id)
      }
    } else {
      rowID.push(rows.id)
      entries.push(rows.original.id)
    }
    const ajaxData = { id: entries }
    bitsFetch(ajaxData, 'log/delete').then(res => {
      if (res.success) {
        if (action && action.fetchData && action.data) {
          action.fetchData(action.data)
        }
        setSnackbar({ show: true, msg: __('Response delete successfully', 'bit-integrations') })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleReexecute = useCallback(logId => {
    if (!logId) return

    setSnackbar({ show: true, msg: __('Re-executing integration...', 'bit-integrations') })

    bitsFetch({ log_id: logId }, 'log/reexecute')
      .then(res => {
        if (res.success) {
          setSnackbar({
            show: true,
            msg: __('Integration re-executed successfully', 'bit-integrations')
          })
          setRefreshLog(1)
        } else {
          setSnackbar({ show: true, msg: res.data || __('Re-execution failed', 'bit-integrations') })
        }
      })
      .catch(err => {
        setSnackbar({ show: true, msg: __('Error during re-execution', 'bit-integrations') })
      })
  }, [])

  const delConfMdl = useCallback(
    (row, data) => {
      if (row.idx !== undefined) {
        // eslint-disable-next-line no-param-reassign
        row.id = row.idx
        // eslint-disable-next-line no-param-reassign
        row.original = row.data[0].row.original
      }
      confMdl.btnTxt = __('Delete', 'bit-integrations')
      confMdl.body = __('Are you sure to delete this entry', 'bit-integrations')
      confMdl.btnClass = ''

      confMdl.action = () => {
        setBulkDelete(row, data)
        closeConfMdl()
      }
      confMdl.show = true
      setconfMdl({ ...confMdl })
    },
    [closeConfMdl, confMdl, setBulkDelete]
  )

  const fetchData = useCallback(
    ({ pageSize, pageIndex }) => {
      // eslint-disable-next-line no-plusplus
      if (refreshLog) {
        setRefreshLog(0)
        setIsLoading(true)
      }

      // eslint-disable-next-line no-plusplus
      const fetchId = ++fetchIdRef.current
      if (log.length < 1) {
        setIsLoading(true)
      }
      if (fetchId === fetchIdRef.current) {
        const startRow = pageSize * pageIndex
        bitsFetch(
          {
            id,
            offset: startRow,
            pageSize
          },
          'log/get'
        ).then(res => {
          if (res?.success) {
            setPageCount(Math.ceil(res.data.count / pageSize))
            setCountEntries(res.data.count)
            setLog(res.data.data)
          }
          setIsLoading(false)
        })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [delConfMdl, id, refreshLog]
  )
  return (
    <>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="flx">
        <div>
          <Link to={allIntegURL} className="btn btcd-btn-o-gray">
            <span className="btcd-icn icn-chevron-left" />
            &nbsp;{__('Back', 'bit-integrations')}
          </Link>
          <button
            onClick={() => setRefreshLog(1)}
            className="icn-btn ml-2 mr-2 tooltip"
            style={{ '--tooltip-txt': `'${__('Refresh Log', 'bit-integrations')}'` }}
            type="button"
            disabled={isLoading}>
            &#x21BB;
          </button>
        </div>
        <div className="w-8 txt-center">
          <b className="f-lg">{type}</b>
          <div>{__('Integration Log', 'bit-integrations')}</div>
        </div>
      </div>

      <div className="forms">
        <Table
          className="f-table btcd-all-frm"
          height={500}
          columns={cols}
          data={log}
          loading={isLoading}
          countEntries={countEntries}
          rowSeletable
          resizable
          columnHidable
          setTableCols={setTableCols}
          setBulkDelete={setBulkDelete}
          fetchData={fetchData}
          pageCount={pageCount}
        />

        {!isLoading && log.length === 0 && (
          <div className="btcd-no-data txt-center">
            <img src={noData} alt="no data found" />
            <div className="mt-2 data-txt">{__('No Log Found.', 'bit-integrations')}</div>
          </div>
        )}
      </div>

      {response && (
        <Modal
          closeIcon
          show={response}
          setModal={() => setResponse(false)}
          title={__('Data Preview', 'bit-integrations')}
          style={{ width: '90vw', maxWidth: '1200px', height: 'min-content' }}>
          <DataPreviewTabs inputData={dataPreview.input} outputData={dataPreview.output} />
        </Modal>
      )}
    </>
  )
}

export default memo(Log)
