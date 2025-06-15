/* eslint-disable max-len */
/* eslint-disable no-param-reassign */

import CloseIcn from '../Icons/CloseIcn'
import { deepCopy } from '../Utils/Helpers'
import Button from './Utilities/Button'
import LogicBlock from './Utilities/LogicBlock'
import LogicChip from './Utilities/LogicChip'

function ConditionalLogic({ formFields, dataConf, setDataConf }) {
  const changeLogicChip = (e, lgcInd, subLgcInd, subSubLgcInd) => {
    if (subSubLgcInd !== undefined) {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv.condition.logics[lgcInd][subLgcInd][subSubLgcInd] = e
        return prv
      })
    } else if (subLgcInd !== undefined) {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv.condition.logics[lgcInd][subLgcInd] = e
        return prv
      })
    } else {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv.condition.logics[lgcInd] = e
        return prv
      })
    }
  }

  const changeFormField = (val, lgcInd, subLgcInd, subSubLgcInd) => {
    if (subSubLgcInd !== undefined) {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv.condition.logics[lgcInd][subLgcInd][subSubLgcInd].field = val
        prv.condition.logics[lgcInd][subLgcInd][subSubLgcInd].val = ''
        return prv
      })
    } else if (subLgcInd !== undefined) {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv.condition.logics[lgcInd][subLgcInd].field = val
        prv.condition.logics[lgcInd][subLgcInd].val = ''
        return prv
      })
    } else {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv.condition.logics[lgcInd].field = val
        prv.condition.logics[lgcInd].val = ''
        return prv
      })
    }
  }
  const changeValue = (val, lgcInd, subLgcInd, subSubLgcInd) => {
    if (subSubLgcInd !== undefined) {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv.condition.logics[lgcInd][subLgcInd][subSubLgcInd].val = val
        return prv
      })
    } else if (subLgcInd !== undefined) {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv.condition.logics[lgcInd][subLgcInd].val = val
        return prv
      })
    } else {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv.condition.logics[lgcInd].val = val
        return prv
      })
    }
  }

  const changeLogic = (val, lgcInd, subLgcInd, subSubLgcInd) => {
    if (subSubLgcInd !== undefined) {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        if (val === 'null') {
          prv.condition.logics[lgcInd][subLgcInd][subSubLgcInd].val = ''
        }
        prv.condition.logics[lgcInd][subLgcInd][subSubLgcInd].logic = val
        return prv
      })
    } else if (subLgcInd !== undefined) {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        if (val === 'null') {
          prv.condition.logics[lgcInd][subLgcInd].val = ''
        }
        prv.condition.logics[lgcInd][subLgcInd].logic = val
        return prv
      })
    } else {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        if (val === 'null') {
          prv.condition.logics[lgcInd].val = ''
        }
        prv.condition.logics[lgcInd].logic = val
        return prv
      })
    }
  }

  const delLogic = (lgcInd, subLgcInd, subSubLgcInd) => {
    if (dataConf?.condition?.logics?.length > 1) {
      if (subSubLgcInd !== undefined) {
        setDataConf(prvSt => {
          const prv = deepCopy(prvSt)
          if (prv.condition.logics[lgcInd][subLgcInd].length === subSubLgcInd + 1) {
            if (prv.condition.logics[lgcInd][subLgcInd].length === 3) {
              const tmp = prv.condition.logics[lgcInd][subLgcInd][subSubLgcInd - 2]
              prv.condition.logics[lgcInd].splice(subLgcInd, 1)
              prv.condition.logics[lgcInd].push(tmp)
            } else {
              prv.condition.logics[lgcInd][subLgcInd].splice(subSubLgcInd - 1, 2)
            }
          } else {
            // eslint-disable-next-line no-lonely-if
            if (prv.condition.logics[lgcInd][subLgcInd].length === 3) {
              const tmp = prv.condition.logics[lgcInd][subLgcInd][subSubLgcInd + 2]
              prv.condition.logics[lgcInd].splice(subLgcInd, 1)
              prv.condition.logics[lgcInd].push(tmp)
            } else {
              prv.condition.logics[lgcInd][subLgcInd].splice(subSubLgcInd, 2)
            }
          }
          return prv
        })
      } else if (subLgcInd !== undefined) {
        setDataConf(prvSt => {
          const prv = deepCopy(prvSt)
          if (prv.condition.logics[lgcInd].length === subLgcInd + 1) {
            if (prv.condition.logics[lgcInd].length === 3) {
              const tmp = prv.condition.logics[lgcInd][subLgcInd - 2]
              prv.condition.logics.splice(lgcInd, 1)
              prv.condition.logics.splice(lgcInd, 0, tmp)
            } else {
              prv.condition.logics[lgcInd].splice(subLgcInd - 1, 2)
            }
          } else {
            // eslint-disable-next-line no-lonely-if
            if (prv.condition.logics[lgcInd].length === 3) {
              const tmp = prv.condition.logics[lgcInd][subLgcInd + 2]
              prv.condition.logics.splice(lgcInd, 1)
              prv.condition.logics.splice(lgcInd, 0, tmp)
            } else {
              prv.condition.logics[lgcInd].splice(subLgcInd, 2)
            }
          }
          return prv
        })
      } else {
        setDataConf(prvSt => {
          const prv = deepCopy(prvSt)
          if (lgcInd !== 0) {
            prv.condition.logics.splice(lgcInd - 1, 2)
          } else {
            prv.condition.logics.splice(lgcInd, 2)
          }
          return prv
        })
      }
    }
  }

  const addLogic = (typ) => {
    if (typ === 'and') {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv.condition.logics.push('and')
        prv.condition.logics.push({ field: '', logic: '', val: '' })
        return prv
      })
    } else if (typ === 'or') {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv.condition.logics.push('or')
        prv.condition.logics.push({ field: '', logic: '', val: '' })
        return prv
      })
    } else if (typ === 'orGrp') {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv.condition.logics.push('or')
        prv.condition.logics.push([{ field: '', logic: '', val: '' }, 'or', { field: '', logic: '', val: '' }])
        return prv
      })
    } else if (typ === 'andGrp') {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv.condition.logics.push('and')
        prv.condition.logics.push([{ field: '', logic: '', val: '' }, 'and', { field: '', logic: '', val: '' }])
        return prv
      })
    }
  }

  const addSubLogic = (typ, ind) => {
    if (typ === 'and') {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv.condition.logics[ind].push('and')
        prv.condition.logics[ind].push({ field: '', logic: '', val: '' })
        return prv
      })
    } else if (typ === 'or') {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv.condition.logics[ind].push('or')
        prv.condition.logics[ind].push({ field: '', logic: '', val: '' })
        return prv
      })
    } else if (typ === 'orGrp') {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv.condition.logics[ind].push('or')
        prv.condition.logics[ind].push([{ field: '', logic: '', val: '' }, 'or', { field: '', logic: '', val: '' }])
        return prv
      })
    } else if (typ === 'andGrp') {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv.condition.logics[ind].push('and')
        prv.condition.logics[ind].push([{ field: '', logic: '', val: '' }, 'and', { field: '', logic: '', val: '' }])
        return prv
      })
    }
  }

  const addSubSubLogic = (typ, ind, subInd) => {
    if (typ === 'and') {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv.condition.logics[ind][subInd].push('and')
        prv.condition.logics[ind][subInd].push({ field: '', logic: '', val: '' })
        return prv
      })
    } else if (typ === 'or') {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv.condition.logics[ind][subInd].push('or')
        prv.condition.logics[ind][subInd].push({ field: '', logic: '', val: '' })
        return prv
      })
    }
  }

  const setValue = (val, lgcInd, subLgcInd, subSubLgcInd) => {
    if (subSubLgcInd !== undefined) {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv.condition.logics[lgcInd][subLgcInd][subSubLgcInd].val = val
        return prv
      })
    } else if (subLgcInd !== undefined) {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv.condition.logics[lgcInd][subLgcInd].val = val
        return prv
      })
    } else {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv.condition.logics[lgcInd].val = val
        return prv
      })
    }
  }

  return (
    <div style={{ width: 900 }}>
      <div>
        {
          dataConf?.condition?.action_behavior === 'cond' && dataConf?.condition?.logics.map((logic, ind) => (
            <span key={`logic-${ind + 44}`}>
              {typeof logic === 'object' && !Array.isArray(logic) && <LogicBlock fieldVal={logic.field} changeFormField={changeFormField} changeValue={changeValue} logicValue={logic.logic} changeLogic={changeLogic} delLogic={delLogic} lgcInd={ind} value={logic.val} formFields={formFields} setValue={setValue} />}
              {typeof logic === 'string' && <LogicChip logic={logic} onChange={e => changeLogicChip(e.target.value, ind)} />}
              {Array.isArray(logic) && (
                <div className="p-2 pl-6 br-10 btcd-logic-grp">

                  {logic.map((subLogic, subInd) => (
                    <span key={`subLogic-${subInd * 7}`}>
                      {typeof subLogic === 'object' && !Array.isArray(subLogic) && <LogicBlock fieldVal={subLogic.field} changeFormField={changeFormField} changeValue={changeValue} logicValue={subLogic.logic} changeLogic={changeLogic} delLogic={delLogic} lgcGrpInd={0} lgcInd={ind} subLgcInd={subInd} value={subLogic.val} formFields={formFields} setValue={setValue} />}
                      {typeof subLogic === 'string' && <LogicChip logic={subLogic} nested onChange={e => changeLogicChip(e.target.value, ind, subInd)} />}
                      {Array.isArray(subLogic) && (
                        <div className="p-2 pl-6 br-10 btcd-logic-grp">

                          {subLogic.map((subSubLogic, subSubLgcInd) => (
                            <span key={`subsubLogic-${subSubLgcInd + 90}`}>
                              {typeof subSubLogic === 'object' && !Array.isArray(subSubLogic) && <LogicBlock fieldVal={subSubLogic.field} changeFormField={changeFormField} changeValue={changeValue} logicValue={subSubLogic.logic} changeLogic={changeLogic} delLogic={delLogic} lgcInd={ind} subLgcInd={subInd} subSubLgcInd={subSubLgcInd} value={subSubLogic.val} formFields={formFields} setValue={setValue} />}
                              {typeof subSubLogic === 'string' && <LogicChip logic={subSubLogic} nested onChange={e => changeLogicChip(e.target.value, ind, subInd, subSubLgcInd)} />}
                            </span>
                          ))}
                          <div className="btcd-workFlows-btns">
                            <div className="flx">
                              <Button icn className="blue"><CloseIcn size="14" className="icn-rotate-45" /></Button>
                              <Button onClick={() => addSubSubLogic('and', ind, subInd)} className="blue ml-2">
                                <CloseIcn size="10" className="icn-rotate-45 mr-1" />
                                AND
                                {' '}
                              </Button>
                              <Button onClick={() => addSubSubLogic('or', ind, subInd)} className="blue ml-2">
                                <CloseIcn size="10" className="icn-rotate-45 mr-1" />
                                OR
                                {' '}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </span>
                  ))}
                  <div className=" btcd-workFlows-btns">
                    <div className="flx">
                      <Button icn className="blue sh-sm"><CloseIcn size="14" className="icn-rotate-45" /></Button>
                      <Button onClick={() => addSubLogic('and', ind)} className="blue ml-2">
                        <CloseIcn size="10" className="icn-rotate-45 mr-1" />
                        AND
                      </Button>
                      <Button onClick={() => addSubLogic('or', ind)} className="blue ml-2">
                        <CloseIcn size="10" className="icn-rotate-45 mr-1" />
                        OR
                      </Button>
                      <Button onClick={() => addSubLogic('orGrp', ind)} className="blue ml-2">
                        <CloseIcn size="10" className="icn-rotate-45 mr-1" />
                        OR Group
                      </Button>
                      <Button onClick={() => addSubLogic('andGrp', ind)} className="blue ml-2">
                        <CloseIcn size="10" className="icn-rotate-45 mr-1" />
                        AND Group
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </span>
          ))
        }
      </div>
      {dataConf?.condition?.action_behavior === 'cond' && (
        <div className="btcd-workFlows-btns">
          <div className="flx">
            <Button onClick={() => addLogic('and')} className="blue ml-2">
              <CloseIcn size="10" className="icn-rotate-45 mr-1" />
              AND
            </Button>
            <Button onClick={() => addLogic('or')} className="blue ml-2">
              <CloseIcn size="10" className="icn-rotate-45 mr-1" />
              OR
            </Button>
            <Button onClick={() => addLogic('orGrp')} className="blue ml-2">
              <CloseIcn size="10" className="icn-rotate-45 mr-1" />
              OR Group
            </Button>
            <Button onClick={() => addLogic('andGrp')} className="blue ml-2">
              <CloseIcn size="10" className="icn-rotate-45 mr-1" />
              AND Group
            </Button>
          </div>
        </div>
      )}

    </div>
  )
}

export default ConditionalLogic
