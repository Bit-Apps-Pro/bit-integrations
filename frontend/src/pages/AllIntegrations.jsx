/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
import { lazy, memo, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { Link } from 'react-router'
import { useRecoilState } from 'recoil'
import { $flowStep, $newFlow } from '../GlobalStates'
import Loader from '../components/Loaders/Loader'
import ConfirmModal from '../components/Utilities/ConfirmModal'
import MenuBtn from '../components/Utilities/MenuBtn'
import SingleToggle2 from '../components/Utilities/SingleToggle2'
import SnackMsg from '../components/Utilities/SnackMsg'
import Table from '../components/Utilities/Table'
import useFetch from '../hooks/useFetch'
import bitsFetch from '../Utils/bitsFetch'
import { __ } from '../Utils/i18nwrap'

const Welcome = lazy(() => import('./Welcome'))
const preloadFlowBuilder = () => import('./FlowBuilder')

function AllIntegrations({ isValidUser }) {
  const { data, isLoading, mutate } = useFetch({ payload: {}, action: 'flow/list', method: 'get' })
  const [integrations, setIntegrations] = useState(
    !isLoading && data.success && data?.data?.integrations ? data.data.integrations : []
  )
  const [snack, setSnackbar] = useState({ show: false })
  const [confMdl, setconfMdl] = useState({ show: false, btnTxt: '' })

  const [, setNewFlow] = useRecoilState($newFlow)
  const [, setFlowStep] = useRecoilState($flowStep)

  const [tags, setTags] = useState([])
  const [integrationTags, setIntegrationTags] = useState({})
  const [selectedTags, setSelectedTags] = useState([])
  const [showTagPickerModal, setShowTagPickerModal] = useState(false)
  const [tagPickerInput, setTagPickerInput] = useState('')
  const [showEditTagModal, setShowEditTagModal] = useState(false)
  const [tagToEdit, setTagToEdit] = useState(null)
  const [editTagName, setEditTagName] = useState('')
  const [editingIntegrationId, setEditingIntegrationId] = useState(null)
  const [bulkTagIntegrationIds, setBulkTagIntegrationIds] = useState([])
  const [tagToDelete, setTagToDelete] = useState(null)
  const [isCompactTagColumn, setIsCompactTagColumn] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 1100 : false
  )

  useEffect(() => {
    setFlowStep(1)
    setNewFlow({})
  }, [])

  const fetchTagData = useCallback(
    (showErrorMsg = true) =>
      bitsFetch({}, 'integration-tags/get', null, 'GET')
        .then(res => {
          if (!res?.success) {
            throw new Error('tag_load_failed')
          }

          const fetchedTags = Array.isArray(res?.data?.tags) ? res.data.tags : []
          const fetchedIntegrationTags =
            res?.data?.integrationTags && typeof res.data.integrationTags === 'object'
              ? res.data.integrationTags
              : {}

          setTags(fetchedTags)
          setIntegrationTags(fetchedIntegrationTags)
        })
        .catch(() => {
          if (showErrorMsg) {
            toast.error(__('Failed to load tags', 'bit-integrations'))
          }
        }),
    []
  )

  useEffect(() => {
    fetchTagData()
  }, [fetchTagData])

  useEffect(() => {
    const updateTagColumnMode = () => {
      setIsCompactTagColumn(window.innerWidth <= 1100)
    }

    updateTagColumnMode()
    window.addEventListener('resize', updateTagColumnMode)

    return () => {
      window.removeEventListener('resize', updateTagColumnMode)
    }
  }, [])

  const persistTagData = useCallback(
    (nextTags, nextIntegrationTags, successMsg = '') =>
      bitsFetch(
        {
          tags: nextTags,
          integrationTags: nextIntegrationTags
        },
        'integration-tags/save'
      )
        .then(res => {
          if (!res?.success) {
            throw new Error('tag_save_failed')
          }

          const savedTags = Array.isArray(res?.data?.tags) ? res.data.tags : nextTags
          const savedIntegrationTags =
            res?.data?.integrationTags && typeof res.data.integrationTags === 'object'
              ? res.data.integrationTags
              : nextIntegrationTags

          setTags(savedTags)
          setIntegrationTags(savedIntegrationTags)

          if (successMsg) {
            toast.success(successMsg)
          }
        })
        .catch(() => {
          fetchTagData(false)
          toast.error(__('Failed to save tags', 'bit-integrations'))
          throw new Error('tag_save_failed')
        }),
    [fetchTagData]
  )

  const [cols, setCols] = useState([
    {
      width: 250,
      minWidth: 80,
      Header: __('Trigger', 'bit-integrations'),
      accessor: 'triggered_entity'
    },
    { width: 250, minWidth: 80, Header: __('Action Name', 'bit-integrations'), accessor: 'name' },
    {
      width: 200,
      minWidth: 200,
      Header: __('Created At', 'bit-integrations'),
      accessor: 'created_at'
    }
  ])

  useEffect(() => {
    !isLoading && setIntegrations(data.success ? data.data.integrations : [])
  }, [data])

  useEffect(() => {
    const ncols = cols.filter(
      itm => itm.accessor !== 't_action' && itm.accessor !== 'status' && itm.accessor !== 'tags'
    )

    ncols.push({
      width: isCompactTagColumn ? 170 : 220,
      minWidth: isCompactTagColumn ? 140 : 180,
      Header: __('Tags', 'bit-integrations'),
      accessor: 'tags',
      className: 'table-tags-cell',
      Cell: value => {
        const integrationId = String(value.row.original.id)
        const assignedTagIds = integrationTags[integrationId] || []
        const assignedTags = assignedTagIds
          .map(tagId => tags.find(currentTag => String(currentTag.id) === String(tagId)))
          .filter(Boolean)
        const visibleAssignedTags = assignedTags.slice(0, isCompactTagColumn ? 1 : 2)
        const hiddenAssignedTagsCount = Math.max(assignedTags.length - visibleAssignedTags.length, 0)

        return (
          <div className="table-tags-container">
            {visibleAssignedTags.map(tag => (
              <span key={`${integrationId}-${tag.id}`} className="table-tag-badge" title={tag.name}>
                <span className="table-tag-badge-label">{tag.name}</span>
                <button
                  type="button"
                  className="table-tag-remove-btn"
                  onClick={e => {
                    e.stopPropagation()
                    removeTagFromIntegration(integrationId, tag.id)
                  }}
                  title={__('Remove tag', 'bit-integrations')}>
                  <span className="btcd-icn icn-clear" />
                </button>
              </span>
            ))}
            {hiddenAssignedTagsCount > 0 && (
              <span className="table-tag-more-badge" title={__('More tags', 'bit-integrations')}>
                +{hiddenAssignedTagsCount}
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                const assignedTagNames = assignedTagIds
                  .map(tagId => tags.find(currentTag => String(currentTag.id) === String(tagId))?.name)
                  .filter(Boolean)
                setEditingIntegrationId(value.row.original.id)
                setBulkTagIntegrationIds([])
                setTagPickerInput(assignedTagNames.join(','))
                setShowTagPickerModal(true)
              }}
              className="table-tag-add-btn"
              title={__('Manage tags', 'bit-integrations')}>
              +
            </button>
          </div>
        )
      }
    })

    ncols.push({
      width: 70,
      minWidth: 60,
      Header: __('Status', 'bit-integrations'),
      accessor: 'status',
      Cell: value => (
        <SingleToggle2
          className="flx"
          action={e => handleStatus(e, value.row.original.id)}
          checked={Number(value.row.original.status) === 1}
        />
      )
    })
    ncols.push({
      sticky: 'right',
      width: 64,
      minWidth: 52,
      Header: '',
      accessor: 't_action',
      Cell: val => (
        <div className="table-actions-cell">
          <MenuBtn
            isValidUser={isValidUser}
            id={val.row.original.id}
            name={val.row.original.name}
            index={val.row.id}
            del={() => showDelModal(val.row.original.id, val.row.index)}
            dup={() => showDupMdl(val.row.original.id, val.row.index)}
          />
        </div>
      )
    })
    setCols([...ncols])
  }, [integrations, tags, integrationTags, isCompactTagColumn])

  const handleStatus = (e, id) => {
    const status = e.target.checked
    const tmp = [...integrations]
    const integ = tmp.find(int => int.id === id)
    integ.status = status === true ? '1' : '0'
    setIntegrations(tmp)

    const param = { id, status }
    bitsFetch(param, 'flow/toggleStatus')
      .then(res => {
        toast.success(__(res.data, 'bit-integrations'))
      })
      .catch(() => {
        toast.error(__('Something went wrong', 'bit-integrations'))
      })
  }

  const handleDelete = (id, index) => {
    const tmpIntegrations = [...integrations]
    const deleteLoad = bitsFetch({ id }, 'flow/delete').then(response => {
      if (response.success) {
        tmpIntegrations.splice(index, 1)
        mutate(tmpIntegrations)
        setIntegrations(tmpIntegrations)

        const integrationKey = String(id)
        if (integrationTags[integrationKey]) {
          const updatedMapping = { ...integrationTags }
          delete updatedMapping[integrationKey]
          setIntegrationTags(updatedMapping)
          persistTagData(tags, updatedMapping).catch(() => { })
        }

        return __('Integration deleted successfully', 'bit-integrations')
      }
      return response.data
    })

    toast.promise(deleteLoad, {
      success: msg => msg,
      error: __('Error Occurred', 'bit-integrations'),
      loading: __('delete...')
    })
  }

  const handleClone = id => {
    const loadClone = bitsFetch({ id }, 'flow/clone').then(response => {
      if (response.success) {
        const newInteg = response.data
        const tmpIntegrations = [...integrations]
        const exist = tmpIntegrations.find(item => item.id === id)
        const cpyInteg = {
          id: newInteg.id,
          name: `duplicate of ${exist.name}`,
          triggered_entity: exist.triggered_entity,
          status: exist.status,
          created_at: newInteg.created_at
        }
        tmpIntegrations.push(cpyInteg)
        setIntegrations(tmpIntegrations)
        return __('Integration clone successfully', 'bit-integrations')
      }
      return response.data
    })

    toast.promise(loadClone, {
      success: msg => msg,
      error: __('Error Occurred', 'bit-integrations'),
      loading: __('cloning...')
    })
  }

  const setBulkDelete = useCallback(
    rows => {
      const rowID = []
      const flowID = []
      for (let i = 0; i < rows.length; i += 1) {
        rowID.push(rows[i].id)
        flowID.push(rows[i].original.id)
      }
      const bulkDeleteLoading = bitsFetch({ flowID }, 'flow/bulk-delete').then(response => {
        if (response.success) {
          const newData = [...integrations]
          for (let i = rowID.length - 1; i >= 0; i -= 1) {
            newData.splice(Number(rowID[i]), 1)
          }
          setIntegrations(newData)

          const updatedMapping = { ...integrationTags }
          let isMappingUpdated = false
          flowID.forEach(deletedIntegId => {
            const integrationKey = String(deletedIntegId)
            if (updatedMapping[integrationKey]) {
              delete updatedMapping[integrationKey]
              isMappingUpdated = true
            }
          })

          if (isMappingUpdated) {
            setIntegrationTags(updatedMapping)
            persistTagData(tags, updatedMapping).catch(() => { })
          }

          return __('Integration Deleted Successfully', 'bit-integrations')
        }
        return response.data
      })

      toast.promise(bulkDeleteLoading, {
        success: msg => msg,
        error: __('Error Occurred', 'bit-integrations'),
        loading: __('delete...')
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [integrations, integrationTags, tags, persistTagData]
  )

  const setTableCols = useCallback(newCols => {
    setCols(newCols)
  }, [])

  const setBulkTagAssign = useCallback(rows => {
    const selectedIntegrationIds = []
    const selectedIntegrationIdsSet = new Set()

    rows.forEach(row => {
      const integrationId = row?.original?.id
      if (integrationId === undefined || integrationId === null) {
        return
      }

      const integrationIdKey = String(integrationId)
      if (selectedIntegrationIdsSet.has(integrationIdKey)) {
        return
      }

      selectedIntegrationIdsSet.add(integrationIdKey)
      selectedIntegrationIds.push(integrationId)
    })

    if (!selectedIntegrationIds.length) {
      toast.error(__('Please select at least one integration', 'bit-integrations'))
      return
    }

    setBulkTagIntegrationIds(selectedIntegrationIds)
    setEditingIntegrationId(null)
    setTagPickerInput('')
    setShowTagPickerModal(true)
  }, [])

  const handleCreateIntegrationIntent = useCallback(() => {
    void preloadFlowBuilder()
  }, [])

  const closeConfMdl = () => {
    confMdl.show = false
    setconfMdl({ ...confMdl })
  }

  const showDelModal = (id, index) => {
    confMdl.action = () => {
      handleDelete(id, index)
      closeConfMdl()
    }
    confMdl.btnTxt = __('Delete', 'bit-integrations')
    confMdl.btn2Txt = null
    confMdl.btnClass = ''
    confMdl.body = __('Are you sure to delete this Integration?', 'bit-integrations')
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  const showDupMdl = formID => {
    confMdl.action = () => {
      handleClone(formID)
      closeConfMdl()
    }
    confMdl.btnTxt = __('Clone', 'bit-integration')
    confMdl.btn2Txt = null
    confMdl.btnClass = 'purple'
    confMdl.body = __('Are you sure to clone this Integration ?', 'bitform')
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  const closeTagPickerModal = () => {
    setShowTagPickerModal(false)
    setTagPickerInput('')
    setEditingIntegrationId(null)
    setBulkTagIntegrationIds([])
  }

  const saveTagFromPicker = () => {
    const normalizedTagNames = []
    const seenTagNames = new Set()

    tagPickerInput
      .split(',')
      .map(tagName => tagName.trim().replace(/\s+/g, ' '))
      .filter(Boolean)
      .forEach(tagName => {
        const normalizedNameKey = tagName.toLowerCase()
        if (seenTagNames.has(normalizedNameKey)) {
          return
        }
        seenTagNames.add(normalizedNameKey)
        normalizedTagNames.push(tagName)
      })

    if (!normalizedTagNames.length && !editingIntegrationId) {
      toast.error(__('Please select or create at least one tag', 'bit-integrations'))
      return Promise.resolve(false)
    }

    const overLimitTag = normalizedTagNames.find(tagName => tagName.length > 20)
    if (overLimitTag) {
      toast.error(__('Tag name must be 20 characters or less', 'bit-integrations'))
      return Promise.resolve(false)
    }

    const updatedTags = [...tags]
    const resolvedTagIds = []
    let createdTagCount = 0

    normalizedTagNames.forEach((tagName, index) => {
      const existingTag = updatedTags.find(
        tag => tag.name.trim().toLowerCase() === tagName.toLowerCase()
      )

      if (existingTag) {
        resolvedTagIds.push(existingTag.id)
        return
      }

      const newTag = {
        id: `${Date.now()}-${index}`,
        name: tagName,
        color: '#6f42c1'
      }

      updatedTags.push(newTag)
      resolvedTagIds.push(newTag.id)
      createdTagCount += 1
    })

    const uniqueResolvedTagIds = []
    const seenTagIds = new Set()
    resolvedTagIds.forEach(tagId => {
      const tagIdKey = String(tagId)
      if (!seenTagIds.has(tagIdKey)) {
        seenTagIds.add(tagIdKey)
        uniqueResolvedTagIds.push(tagId)
      }
    })

    if (editingIntegrationId) {
      const integrationKey = String(editingIntegrationId)
      const updatedMapping = { ...integrationTags }
      const currentTagIds = (updatedMapping[integrationKey] || []).map(tagId => String(tagId))
      const nextTagIds = uniqueResolvedTagIds.map(tagId => String(tagId))
      const isAssignmentChanged =
        currentTagIds.length !== nextTagIds.length ||
        currentTagIds.some(tagId => !nextTagIds.includes(tagId))

      if (!isAssignmentChanged && createdTagCount === 0) {
        toast.success(__('No changes found', 'bit-integrations'))
        closeTagPickerModal()
        return Promise.resolve(true)
      }

      if (uniqueResolvedTagIds.length > 0) {
        updatedMapping[integrationKey] = uniqueResolvedTagIds
      } else {
        delete updatedMapping[integrationKey]
      }

      const successMessage =
        createdTagCount > 0
          ? __('Tags created and assigned successfully', 'bit-integrations')
          : __('Tags assigned successfully', 'bit-integrations')

      return persistTagData(updatedTags, updatedMapping, successMessage)
        .then(() => {
          closeTagPickerModal()
          return true
        })
        .catch(() => false)
    }

    if (bulkTagIntegrationIds.length > 0) {
      const updatedMapping = { ...integrationTags }
      let hasAssignmentChange = false

      bulkTagIntegrationIds.forEach(integrationId => {
        const integrationKey = String(integrationId)
        const currentTagIds = updatedMapping[integrationKey] || []
        const mergedTagIds = [...currentTagIds]

        uniqueResolvedTagIds.forEach(tagId => {
          if (!mergedTagIds.some(currentTagId => String(currentTagId) === String(tagId))) {
            mergedTagIds.push(tagId)
          }
        })

        if (
          mergedTagIds.length !== currentTagIds.length ||
          mergedTagIds.some(
            mergedTagId =>
              !currentTagIds.some(currentTagId => String(currentTagId) === String(mergedTagId))
          )
        ) {
          hasAssignmentChange = true
        }

        if (mergedTagIds.length > 0) {
          updatedMapping[integrationKey] = mergedTagIds
        }
      })

      if (!hasAssignmentChange && createdTagCount === 0) {
        toast.success(__('No changes found', 'bit-integrations'))
        closeTagPickerModal()
        return Promise.resolve(true)
      }

      const successMessage =
        createdTagCount > 0
          ? __('Tags created and assigned successfully', 'bit-integrations')
          : __('Tags assigned successfully', 'bit-integrations')

      return persistTagData(updatedTags, updatedMapping, successMessage)
        .then(() => {
          closeTagPickerModal()
          return true
        })
        .catch(() => false)
    }

    if (createdTagCount === 0) {
      setSelectedTags(prevSelectedTags => {
        const nextSelectedTags = [...prevSelectedTags]
        uniqueResolvedTagIds.forEach(tagId => {
          if (!nextSelectedTags.some(selectedTagId => String(selectedTagId) === String(tagId))) {
            nextSelectedTags.push(tagId)
          }
        })
        return nextSelectedTags
      })
      toast.success(__('Tag selected successfully', 'bit-integrations'))
      closeTagPickerModal()
      return Promise.resolve(true)
    }

    return persistTagData(
      updatedTags,
      integrationTags,
      __('Tags created successfully', 'bit-integrations')
    )
      .then(() => {
        setSelectedTags(prevSelectedTags => {
          const nextSelectedTags = [...prevSelectedTags]
          uniqueResolvedTagIds.forEach(tagId => {
            if (!nextSelectedTags.some(selectedTagId => String(selectedTagId) === String(tagId))) {
              nextSelectedTags.push(tagId)
            }
          })
          return nextSelectedTags
        })

        closeTagPickerModal()
        return true
      })
      .catch(() => false)
  }

  const deleteTag = tagId => {
    const updatedTags = tags.filter(tag => String(tag.id) !== String(tagId))
    const updatedMapping = { ...integrationTags }

    Object.keys(updatedMapping).forEach(integrationId => {
      const tagIds = updatedMapping[integrationId].filter(currentTagId => currentTagId !== tagId)
      if (tagIds.length) {
        updatedMapping[integrationId] = tagIds
      } else {
        delete updatedMapping[integrationId]
      }
    })

    setSelectedTags(prev => prev.filter(selectedTagId => selectedTagId !== tagId))
    setTagToDelete(null)

    persistTagData(
      updatedTags,
      updatedMapping,
      __('Tag deleted successfully', 'bit-integrations')
    ).catch(() => { })
  }

  const confirmDeleteTag = tagId => {
    setTagToDelete(tagId)
  }

  const openEditTagModal = tag => {
    setTagToEdit(tag.id)
    setEditTagName(tag.name)
    setShowEditTagModal(true)
  }

  const closeEditTagModal = () => {
    setShowEditTagModal(false)
    setTagToEdit(null)
    setEditTagName('')
  }

  const updateTag = () => {
    const trimmedTagName = editTagName.trim()

    if (!trimmedTagName) {
      toast.error(__('Please enter a tag name', 'bit-integrations'))
      return Promise.resolve(false)
    }

    if (trimmedTagName.length > 20) {
      toast.error(__('Tag name must be 20 characters or less', 'bit-integrations'))
      return Promise.resolve(false)
    }

    if (
      tags.some(
        tag =>
          String(tag.id) !== String(tagToEdit) && tag.name.toLowerCase() === trimmedTagName.toLowerCase()
      )
    ) {
      toast.error(__('Tag already exists', 'bit-integrations'))
      return Promise.resolve(false)
    }

    const updatedTags = tags.map(tag =>
      String(tag.id) === String(tagToEdit) ? { ...tag, name: trimmedTagName } : tag
    )

    return persistTagData(
      updatedTags,
      integrationTags,
      __('Tag updated successfully', 'bit-integrations')
    )
      .then(() => {
        closeEditTagModal()
        return true
      })
      .catch(() => false)
  }

  const removeTagFromIntegration = (integrationId, tagId) => {
    const integrationKey = String(integrationId)
    const updatedMapping = { ...integrationTags }
    const currentTags = updatedMapping[integrationKey] || []
    const nextTags = currentTags.filter(currentTagId => String(currentTagId) !== String(tagId))

    if (nextTags.length > 0) {
      updatedMapping[integrationKey] = nextTags
    } else {
      delete updatedMapping[integrationKey]
    }

    setIntegrationTags(updatedMapping)
    persistTagData(tags, updatedMapping, __('Tag removed successfully', 'bit-integrations')).catch(
      () => { }
    )
  }

  const toggleTagFilter = tagId => {
    if (tagId === 'ALL') {
      setSelectedTags([])
      return
    }

    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId))
    } else {
      setSelectedTags([...selectedTags, tagId])
    }
  }

  const clearTagFilters = () => {
    setSelectedTags([])
  }

  const filteredIntegrations =
    selectedTags.length > 0
      ? integrations.filter(integration => {
        const assignedTagIds = integrationTags[String(integration.id)] || []
        return selectedTags.some(tagId => assignedTagIds.includes(tagId))
      })
      : integrations

  const selectedTagNamesFromPicker = []
  const selectedTagNamesSet = new Set()
  tagPickerInput
    .split(',')
    .map(tagName => tagName.trim().replace(/\s+/g, ' '))
    .filter(Boolean)
    .forEach(tagName => {
      const normalizedTagName = tagName.toLowerCase()
      if (!selectedTagNamesSet.has(normalizedTagName)) {
        selectedTagNamesSet.add(normalizedTagName)
        selectedTagNamesFromPicker.push(tagName)
      }
    })

  const hasCustomTagInPicker = selectedTagNamesFromPicker.some(
    tagName => !tags.some(tag => tag.name.trim().toLowerCase() === tagName.toLowerCase())
  )

  const tagPickerOptions = []
  const tagOptionNames = new Set()
  tags.forEach(tag => {
    const tagName = tag?.name?.trim()
    if (!tagName) {
      return
    }
    const tagNameKey = tagName.toLowerCase()
    if (tagOptionNames.has(tagNameKey)) {
      return
    }
    tagOptionNames.add(tagNameKey)
    tagPickerOptions.push({
      label: tagName,
      value: tagName
    })
  })

  let tagPickerPrimaryBtnLabel = __('Select Tag', 'bit-integrations')
  if (bulkTagIntegrationIds.length > 0) {
    tagPickerPrimaryBtnLabel = hasCustomTagInPicker
      ? __('Create & Assign', 'bit-integrations')
      : __('Assign Tags', 'bit-integrations')
  } else if (editingIntegrationId) {
    tagPickerPrimaryBtnLabel = hasCustomTagInPicker
      ? __('Create & Assign', 'bit-integrations')
      : __('Save Tags', 'bit-integrations')
  } else if (hasCustomTagInPicker) {
    tagPickerPrimaryBtnLabel = __('Create Tag', 'bit-integrations')
  }

  const loaderStyle = {
    display: 'flex',
    height: '82vh',
    justifyContent: 'center',
    alignItems: 'center'
  }

  if (isLoading) {
    return <Loader style={loaderStyle} />
  }

  return (
    <div id="all-forms">
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
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

      {tagToDelete && (
        <ConfirmModal
          show={tagToDelete !== null}
          close={() => setTagToDelete(null)}
          action={() => deleteTag(tagToDelete)}
          body={__(
            'Are you sure you want to delete this tag? It will be removed from all integrations.',
            'bit-integrations'
          )}
          btnTxt={__('Delete', 'bit-integrations')}
          btnClass=""
        />
      )}

      {showTagPickerModal && (
        <div className="tag-modal-overlay" onClick={closeTagPickerModal}>
          <div className="tag-modal-content tag-picker-modal-content" onClick={e => e.stopPropagation()}>
            <div className="tag-picker-header">
              <h4 className="tag-modal-title">
                {bulkTagIntegrationIds.length > 0
                  ? __('Bulk Assign Tags', 'bit-integrations')
                  : editingIntegrationId
                    ? __('Assign Tags', 'bit-integrations')
                    : __('Create Tags', 'bit-integrations')}
              </h4>
              <p className="tag-picker-subtitle">
                {bulkTagIntegrationIds.length > 0
                  ? __(
                    'Search existing tags or create new tags, then assign them to all selected integrations.',
                    'bit-integrations'
                  )
                  : editingIntegrationId
                    ? __(
                      'Search existing tags or create new tags, then save assignment.',
                      'bit-integrations'
                    )
                    : __('Search existing tags or create new ones for filtering.', 'bit-integrations')}
              </p>
            </div>

            <div className="tag-picker-field-wrap">
              <label className="tag-modal-label">{__('Tags', 'bit-integrations')}</label>
              <MultiSelect
                className="tag-picker-multiselect msl-wrp-options w-10"
                defaultValue={tagPickerInput}
                options={tagPickerOptions}
                onChange={value =>
                  setTagPickerInput(Array.isArray(value) ? value.join(',') : value || '')
                }
                placeholder={__('Search or create new tag', 'bit-integrations')}
                customValue
                closeOnSelect={false}
              />
              <p className="tag-picker-counter">
                {bulkTagIntegrationIds.length > 0
                  ? __(
                    'Tip: selected tags will be added to all selected integrations (20 characters max).',
                    'bit-integrations'
                  )
                  : __('Tip: press Enter to create a new tag (20 characters max).', 'bit-integrations')}
              </p>
            </div>

            <div className="tag-modal-actions tag-picker-actions">
              <button
                type="button"
                onClick={closeTagPickerModal}
                className="tag-modal-btn-cancel tag-picker-btn-cancel">
                {__('Cancel', 'bit-integrations')}
              </button>
              <button
                type="button"
                onClick={saveTagFromPicker}
                className="tag-modal-btn-create tag-picker-btn-primary">
                {tagPickerPrimaryBtnLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditTagModal && (
        <div className="tag-modal-overlay" onClick={closeEditTagModal}>
          <div
            className="tag-modal-content tag-picker-modal-content tag-edit-modal-content"
            onClick={e => e.stopPropagation()}>
            <div className="tag-picker-header tag-edit-header">
              <h3 className="tag-modal-title">{__('Edit Tag', 'bit-integrations')}</h3>
              <p className="tag-picker-subtitle">
                {__('Rename this tag for filters and integration assignments.', 'bit-integrations')}
              </p>
            </div>

            <div className="tag-picker-field-wrap tag-edit-field-wrap">
              <label className="tag-modal-label">{__('Tag Name', 'bit-integrations')}</label>
              <input
                type="text"
                value={editTagName}
                onChange={e => setEditTagName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    updateTag()
                  }
                }}
                placeholder={__('Enter tag name...', 'bit-integrations')}
                maxLength={20}
                autoFocus
                className="tag-modal-input tag-edit-input"
              />
              <p className="tag-picker-counter tag-edit-counter">
                {`${editTagName.length}/20 ${__('characters', 'bit-integrations')}`}
              </p>
            </div>

            <div className="tag-modal-actions tag-picker-actions tag-edit-actions">
              <button
                type="button"
                onClick={closeEditTagModal}
                className="tag-modal-btn-cancel tag-picker-btn-cancel">
                {__('Cancel', 'bit-integrations')}
              </button>
              <button
                type="button"
                onClick={updateTag}
                className="tag-modal-btn-create tag-picker-btn-primary tag-edit-btn-primary">
                {__('Update Tag', 'bit-integrations')}
              </button>
            </div>
          </div>
        </div>
      )}

      {integrations && integrations?.length ? (
        <>
          <div className="af-header flx flx-between">
            <h2>{__('Integrations', 'bit-integrations')}</h2>

            <Link
              to="/flow/new"
              className="btn btcd-btn-lg purple purple-sh"
              onMouseEnter={handleCreateIntegrationIntent}
              onFocus={handleCreateIntegrationIntent}
              onTouchStart={handleCreateIntegrationIntent}
              onMouseDown={handleCreateIntegrationIntent}>
              {__('Create Integration', 'bit-integrations')}
            </Link>
          </div>

          <div className="forms">
            <Table
              className="f-table btcd-all-frm"
              height="60vh"
              columns={cols}
              data={filteredIntegrations}
              rowSeletable
              resizable
              columnHidable
              setTableCols={setTableCols}
              setBulkDelete={setBulkDelete}
              setBulkTagAssign={setBulkTagAssign}
              search
              searchPlaceholder={__('Search integrations...', 'bit-integrations')}
              bulkDeleteLabel={__('Delete Integration', 'bit-integrations')}
              bulkTagAssignLabel={__('Bulk Tag Assign', 'bit-integrations')}
              topLeftContent={
                <div className="tag-filter-inline table-top-tag-filter">
                  <h4 className="tag-filter-title">{__('Filter by Tags', 'bit-integrations')}</h4>
                  <div className="tag-buttons-container">
                    <button
                      type="button"
                      onClick={() => toggleTagFilter('ALL')}
                      className={`tag-btn-all ${selectedTags.length === 0 ? 'active' : ''}`}>
                      {__('ALL', 'bit-integrations')}
                    </button>

                    {tags.map(tag => {
                      const isSelected = selectedTags.includes(tag.id)
                      return (
                        <div key={tag.id} className={`tag-pill ${isSelected ? 'active show-actions' : ''}`}>
                          <button type="button" onClick={() => toggleTagFilter(tag.id)} className="tag-btn">
                            {tag.name}
                          </button>
                          <div className="tag-pill-actions">
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation()
                                openEditTagModal(tag)
                              }}
                              className="tag-icon-btn"
                              title={__('Edit tag', 'bit-integrations')}>
                              <span className="btcd-icn icn-edit" />
                            </button>
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation()
                                confirmDeleteTag(tag.id)
                              }}
                              className="tag-icon-btn delete"
                              title={__('Delete tag', 'bit-integrations')}>
                              <span className="btcd-icn icn-trash-2" />
                            </button>
                          </div>
                        </div>
                      )
                    })}

                    <button
                      type="button"
                      onClick={() => {
                        setEditingIntegrationId(null)
                        setBulkTagIntegrationIds([])
                        setTagPickerInput('')
                        setShowTagPickerModal(true)
                      }}
                      className="tag-add-btn"
                      title={__('Add or select tag', 'bit-integrations')}>
                      +
                    </button>
                  </div>
                  {selectedTags.length > 0 && (
                    <button type="button" onClick={clearTagFilters} className="tag-clear-btn">
                      <span className="tag-clear-icon">×</span>
                      {__('Clear filter', 'bit-integrations')}
                    </button>
                  )}
                </div>
              }
            />
          </div>
        </>
      ) : (
        <Welcome isValidUser={isValidUser} integrations={integrations} />
      )}
    </div>
  )
}

export default memo(AllIntegrations)
