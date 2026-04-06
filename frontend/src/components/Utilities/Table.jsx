/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */

import { forwardRef, memo, useEffect, useRef, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { ReactSortable } from 'react-sortablejs'
import {
  useColumnOrder,
  useFilters,
  useFlexLayout,
  useGlobalFilter,
  usePagination,
  useResizeColumns,
  useRowSelect,
  useSortBy,
  useTable
} from 'react-table'
import { useSticky } from 'react-table-sticky'
import TrashIcn from '../../Icons/TrashIcn'
import { __ } from '../../Utils/i18nwrap'
import TableLoader2 from '../Loaders/TableLoader2'
import ConfirmModal from './ConfirmModal'
import Menu from './Menu'
import TableCheckBox from './TableCheckBox'

const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef()
  const resolvedRef = ref || defaultRef
  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate
  }, [resolvedRef, indeterminate])
  return <TableCheckBox refer={resolvedRef} rest={rest} />
})

function VerticalDotsIcn({ size = 16 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ pointerEvents: 'none' }}>
      <circle cx="12" cy="5" r="2" fill="currentColor" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="19" r="2" fill="currentColor" />
    </svg>
  )
}

function TagAssignIcn({ size = 15 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ pointerEvents: 'none' }}>
      <path
        className="svg-icn"
        d="M3.5 12.5L12.5 3.5h6l2 2v6l-9 9a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8z"
      />
      <circle cx="16" cy="8" r="1.5" fill="currentColor" />
    </svg>
  )
}

function GlobalFilter({
  globalFilter,
  setGlobalFilter,
  setSearch,
  exportImportMenu,
  data,
  cols,
  formID,
  report,
  placeholder
}) {
  const [delay, setDelay] = useState(null)
  const handleSearch = e => {
    delay && clearTimeout(delay)
    const { value } = e.target

    setGlobalFilter(value || undefined)

    setDelay(
      setTimeout(() => {
        setSearch(value || undefined)
      }, 1000)
    )
  }

  return (
    <div className="f-search">
      <button
        type="button"
        className="icn-btn"
        aria-label="icon-btn"
        onClick={() => {
          setSearch(globalFilter || undefined)
        }}>
        <span className="btcd-icn icn-search" />
      </button>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label>
        <input
          value={globalFilter || ''}
          onChange={handleSearch}
          placeholder={placeholder || __('Search', 'bit-integrations')}
        />
      </label>
    </div>
  )
}

function ColumnHide({ cols, setCols, tableCol, tableAllCols }) {
  return (
    <Menu
      icn="icn-layout"
      title={__('Columns', 'bit-integrations')}
      btnClassName="btcd-columns-btn"
      menuClassName="btcd-columns-menu"
      showTooltip={false}>
      <div className="btcd-columns-scroll">
        <ReactSortable list={cols} setList={l => setCols(l)} handle=".btcd-pane-drg">
          {tableCol.map((column, i) => (
            <div
              key={tableAllCols[i + 1].id}
              className={`btcd-pane ${
                (column.Header === 'Actions' || column.accessor === 't_action') && 'd-non'
              }`}>
              <TableCheckBox
                cls="scl-7"
                id={tableAllCols[i + 1].id}
                title={column.Header}
                rest={tableAllCols[i + 1].getToggleHiddenProps()}
              />
              <span className="btcd-pane-drg">&#8759;</span>
            </div>
          ))}
        </ReactSortable>
      </div>
    </Menu>
  )
}

function Table(props) {
  const [confMdl, setconfMdl] = useState({ show: false, btnTxt: '' })
  const [isBulkMenuOpen, setIsBulkMenuOpen] = useState(false)
  const bulkMenuRef = useRef(null)
  const { columns, data, fetchData, report } = props
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    selectedFlatRows, // row select
    allColumns, // col hide
    setGlobalFilter,
    state: { pageIndex, pageSize, sortBy, filters, globalFilter, hiddenColumns },
    setColumnOrder,
    setHiddenColumns
  } = useTable(
    {
      debug: true,
      fetchData,
      columns,
      data,
      manualPagination: typeof props.pageCount !== 'undefined',
      pageCount: props?.pageCount || Math.ceil(data?.length / 10),
      autoResetPage: false,
      autoResetHiddenColumns: false,
      autoResetSortBy: false,
      autoResetFilters: false,
      autoResetGlobalFilter: false
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useSticky,
    useColumnOrder,
    // useBlockLayout,
    useFlexLayout,
    props.resizable ? useResizeColumns : '', // resize
    props.rowSeletable ? useRowSelect : '', // row select
    props.rowSeletable
      ? hooks => {
          hooks.allColumns.push(cols => [
            {
              id: 'selection',
              width: 50,
              maxWidth: 50,
              minWidth: 67,
              sticky: 'left',
              Header: ({ getToggleAllRowsSelectedProps }) => (
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              ),
              Cell: ({ row }) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            },
            ...cols
          ])
        }
      : ''
  )

  const [search, setSearch] = useState(globalFilter)
  const hasSelectedRows = props.rowSeletable && selectedFlatRows.length > 0
  const hasBulkMenuActions =
    'setBulkStatus' in props ||
    'duplicateData' in props ||
    'setBulkTagAssign' in props ||
    'setBulkDelete' in props

  useEffect(() => {
    if (fetchData) {
      fetchData({ pageIndex, pageSize })
    }
  }, [fetchData, pageIndex, pageSize])

  useEffect(() => {
    if (!isBulkMenuOpen) {
      return undefined
    }

    const handleClickOutside = e => {
      if (bulkMenuRef.current && !bulkMenuRef.current.contains(e.target)) {
        setIsBulkMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [isBulkMenuOpen])

  useEffect(() => {
    if (!hasSelectedRows && isBulkMenuOpen) {
      setIsBulkMenuOpen(false)
    }
  }, [hasSelectedRows, isBulkMenuOpen])

  useEffect(() => {
    if (pageIndex > pageCount) {
      gotoPage(0)
    }
  }, [gotoPage, pageCount, pageIndex])

  const showBulkDupMdl = () => {
    confMdl.action = () => {
      props.duplicateData(selectedFlatRows, data, {
        fetchData,
        data: { pageIndex, pageSize, sortBy, filters, globalFilter: search }
      })
      closeConfMdl()
    }
    confMdl.btnTxt = __('Clone', 'bit-integrations')
    confMdl.btn2Txt = null
    confMdl.btnClass = 'purple'
    confMdl.body = `${__('Do You want Deplicate these', 'bit-integrations')} ${
      selectedFlatRows.length
    } ${__('item', 'bit-integrations')} ?`
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  const showStModal = () => {
    confMdl.action = e => {
      props.setBulkStatus(e, selectedFlatRows)
      closeConfMdl()
    }
    confMdl.btn2Action = e => {
      props.setBulkStatus(e, selectedFlatRows)
      closeConfMdl()
    }
    confMdl.btnTxt = __('Disable', 'bit-integrations')
    confMdl.btn2Txt = __('Enable', 'bit-integrations')
    confMdl.body = `${__('Do you want to change these', 'bit-integrations')} ${
      selectedFlatRows.length
    } ${__('status', 'bit-integrations')} ?`
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  const showDelModal = () => {
    confMdl.action = () => {
      props.setBulkDelete(selectedFlatRows, {
        fetchData,
        data: { pageIndex, pageSize, sortBy, filters, globalFilter: search }
      })
      closeConfMdl()
    }
    confMdl.btnTxt = __('Delete', 'bit-integrations')
    confMdl.btn2Txt = null
    confMdl.btnClass = ''
    confMdl.body = `${__('Are you sure to delete these', 'bit-integrations')} ${
      selectedFlatRows.length
    } ${__('items', 'bit-integrations')} ?`
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  const showBulkTagAssignModal = () => {
    props.setBulkTagAssign(selectedFlatRows, {
      fetchData,
      data: { pageIndex, pageSize, sortBy, filters, globalFilter: search }
    })
  }

  const closeConfMdl = () => {
    confMdl.show = false
    setconfMdl({ ...confMdl })
  }

  return (
    <>
      <ConfirmModal
        show={confMdl.show}
        body={confMdl.body}
        action={confMdl.action}
        close={closeConfMdl}
        btnTxt={confMdl.btnTxt}
        btn2Txt={confMdl.btn2Txt}
        btn2Action={confMdl.btn2Action}
        btnClass={confMdl.btnClass}
      />
      <div className="btcd-table-top">
        <div className="btcd-t-actions">
          {props.topLeftContent || <div />}
        </div>

        <div className="btcd-t-controls">
          {hasSelectedRows && hasBulkMenuActions && (
            <div className="btcd-bulk-top btcd-bulk-top-right">
              <small className="btcd-bulk-selected">
                {selectedFlatRows.length} {__('selected', 'bit-integrations')}
              </small>
              <div className="btcd-bulk-menu" ref={bulkMenuRef}>
                <button
                  type="button"
                  className="icn-btn btcd-bulk-menu-btn"
                  aria-label={__('Bulk actions', 'bit-integrations')}
                  onClick={() => setIsBulkMenuOpen(oldState => !oldState)}>
                  <VerticalDotsIcn size={16} />
                </button>

                {isBulkMenuOpen && (
                  <div className="btcd-bulk-menu-list">
                    {'setBulkTagAssign' in props && (
                      <button
                        type="button"
                        onClick={() => {
                          showBulkTagAssignModal()
                          setIsBulkMenuOpen(false)
                        }}>
                        <span className="btcd-bulk-menu-item-icon">
                          <TagAssignIcn size={14} />
                        </span>
                        <span>{props.bulkTagAssignLabel || __('Bulk Tag Assign', 'bit-integrations')}</span>
                      </button>
                    )}

                    {'setBulkDelete' in props && (
                      <button
                        type="button"
                        onClick={() => {
                          showDelModal()
                          setIsBulkMenuOpen(false)
                        }}>
                        <span className="btcd-bulk-menu-item-icon">
                          <TrashIcn size={14} />
                        </span>
                        <span>{props.bulkDeleteLabel || __('Delete', 'bit-integrations')}</span>
                      </button>
                    )}

                    {'setBulkStatus' in props && (
                      <button
                        type="button"
                        onClick={() => {
                          showStModal()
                          setIsBulkMenuOpen(false)
                        }}>
                        <span className="btcd-bulk-menu-item-icon">
                          <span className="btcd-icn icn-toggle_off" />
                        </span>
                        <span>{__('Change Status', 'bit-integrations')}</span>
                      </button>
                    )}

                    {'duplicateData' in props && (
                      <button
                        type="button"
                        onClick={() => {
                          showBulkDupMdl()
                          setIsBulkMenuOpen(false)
                        }}>
                        <span className="btcd-bulk-menu-item-icon">
                          <span className="btcd-icn icn-file_copy" />
                        </span>
                        <span>{__('Clone', 'bit-integrations')}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {props.search && (
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
              setSearch={setSearch}
              exportImportMenu={props.exportImportMenu}
              data={props.data}
              cols={props.columns}
              formID={props.formID}
              report={report}
              placeholder={props.searchPlaceholder}
            />
          )}

          {props.columnHidable && (
            <ColumnHide
              cols={props.columns}
              setCols={props.setTableCols}
              tableCol={columns}
              tableAllCols={allColumns}
            />
          )}
        </div>
      </div>

      <div className="mt-2">
        <Scrollbars className="btcd-scroll" style={{ height: props.height }}>
          <div
            {...getTableProps()}
            className={`${props.className} ${props.rowClickable && 'rowClickable'}`}>
            <div className="thead">
              {headerGroups.map((headerGroup, i) => (
                <div key={`t-th-${i + 8}`} className="tr" {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <div key={column.id} className="th flx" {...column.getHeaderProps()}>
                      <div {...(column.id !== 't_action' && column.getSortByToggleProps())}>
                        {column.render('Header')}{' '}
                        {column.id !== 't_action' && column.id !== 'selection' && (
                          <span>
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                String.fromCharCode(9662)
                              ) : (
                                String.fromCharCode(9652)
                              )
                            ) : (
                              <span
                                className="btcd-icn icn-sort"
                                style={{ fontSize: 10, marginLeft: 5 }}
                              />
                            )}
                          </span>
                        )}
                      </div>
                      {props.resizable && (
                        <div
                          {...column.getResizerProps()}
                          className={`btcd-t-resizer ${column.isResizing ? 'isResizing' : ''}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {props.loading ? (
              <TableLoader2 />
            ) : (
              <div className="tbody" {...getTableBodyProps()}>
                {page.map(row => {
                  prepareRow(row)
                  return (
                    <div
                      key={`t-r-${row.index}`}
                      className={`tr ${row.isSelected ? 'btcd-row-selected' : ''}`}
                      {...row.getRowProps()}>
                      {row.cells.map(cell => (
                        <div
                          key={`t-d-${cell.row.index}`}
                          className="td flx"
                          {...cell.getCellProps()}
                          onClick={e =>
                            props.rowClickable &&
                            typeof cell.column.Header === 'string' &&
                            props.onRowClick(e, row.cells, cell.row.index, {
                              fetchData,
                              data: { pageIndex, pageSize, sortBy, filters, globalFilter }
                            })
                          }
                          onKeyPress={e =>
                            props.rowClickable &&
                            typeof cell.column.Header === 'string' &&
                            props.onRowClick(e, row.cells, cell.row.index, {
                              fetchData,
                              data: { pageIndex, pageSize, sortBy, filters, globalFilter }
                            })
                          }
                          role="button"
                          tabIndex={0}
                          aria-label="cell">
                          {cell.render('Cell')}
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </Scrollbars>
      </div>

      <div className="btcd-pagination">
        <small>
          {props.countEntries >= 0 &&
            `${__('Total Response:', 'bit-integrations')}
            ${props.countEntries}`}
        </small>
        <div>
          <button
            aria-label="Go first"
            className="icn-btn"
            type="button"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}>
            &laquo;
          </button>{' '}
          <button
            aria-label="Back"
            className="icn-btn"
            type="button"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}>
            &lsaquo;
          </button>{' '}
          <button
            aria-label="Next"
            className="icn-btn"
            type="button"
            onClick={() => nextPage()}
            disabled={!canNextPage}>
            &rsaquo;
          </button>{' '}
          <button
            aria-label="Last"
            className="icn-btn"
            type="button"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}>
            &raquo;
          </button>{' '}
          <small>
            &nbsp;
            {__('Page', 'bit-integrations')}{' '}
            <strong>
              {pageIndex + 1} {__('of', 'bit-integrations')} {pageOptions.length} &nbsp;
            </strong>{' '}
          </small>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label>
            <select
              className="btcd-paper-inp"
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value))
                if (props.getPageSize) {
                  props.getPageSize(e.target.value, pageIndex)
                }
              }}>
              {[10, 20, 30, 40, 50].map(pageSiz => (
                <option key={pageSiz} value={pageSiz}>
                  {__('Show', 'bit-integrations')} {pageSiz}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </>
  )
}

export default memo(Table)
