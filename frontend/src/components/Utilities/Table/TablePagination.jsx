import { __ } from '../../../Utils/i18nwrap'

function TablePagination({
  countEntries,
  gotoPage,
  canPreviousPage,
  previousPage,
  nextPage,
  canNextPage,
  pageCount,
  pageIndex,
  pageOptions,
  pageSize,
  setPageSize,
  getPageSize
}) {
  return (
    <div className="btcd-pagination">
      <small>
        {countEntries >= 0 &&
          `${__('Total Response:', 'bit-integrations')}
            ${countEntries}`}
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
              if (getPageSize) {
                getPageSize(e.target.value, pageIndex)
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
  )
}

export default TablePagination
