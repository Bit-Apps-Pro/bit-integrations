/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { DELETE_LIST_ARRAY, TASK_LIST_VALUES } from './jetEngineConstants'
import { $btcbi } from '../../../GlobalStates'
import { useRecoilValue } from 'recoil'
import ConfirmModal from '../../Utilities/ConfirmModal'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { getJetEngineOptions } from './jetEngineCommonFunctions'
import Loader from '../../Loaders/Loader'

export default function JetEngineActions({ jetEngineConf, setJetEngineConf, loading, setLoading }) {
  const [actionMdl, setActionMdl] = useState({ show: false })
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi
  const [actionOptions, setActionsOptions] = useState({})

  const actionHandler = (e, type) => {
    const newConf = { ...jetEngineConf }

    if (type === 'checkbox') {
      if (e.target.checked) {
        newConf.actions[e.target.value] = true
      } else {
        delete newConf.actions[e.target.value]
      }
    } else if (type === 'menuPosition') {
      getJetEngineOptions(
        'jetEngine_menu_positions',
        actionOptions,
        setActionsOptions,
        type,
        loading,
        setLoading
      )
      setActionMdl({ show: 'menuPosition' })
    } else if (type === 'menuIcon') {
      getJetEngineOptions(
        'jetEngine_menu_icons',
        actionOptions,
        setActionsOptions,
        type,
        loading,
        setLoading
      )
      setActionMdl({ show: 'menuIcon' })
    } else if (type === 'supports') {
      getJetEngineOptions(
        'jetEngine_supports',
        actionOptions,
        setActionsOptions,
        type,
        loading,
        setLoading
      )
      setActionMdl({ show: 'supports' })
    } else if (type === 'taxPostTypes') {
      getJetEngineOptions(
        'jetEngine_tax_post_types',
        actionOptions,
        setActionsOptions,
        type,
        loading,
        setLoading
      )
      setActionMdl({ show: 'taxPostTypes' })
    }

    setJetEngineConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, type) => {
    const newConf = { ...jetEngineConf }
    newConf[type] = val
    setJetEngineConf({ ...newConf })
  }

  return (
    <>
      <div className="pos-rel d-flx flx-wrp">
        {!isPro &&
          (jetEngineConf.selectedTask === TASK_LIST_VALUES.CREATE_TAXONOMY ||
            jetEngineConf.selectedTask === TASK_LIST_VALUES.UPDATE_TAXONOMY) && (
            <>
              <TableCheckBox
                checked={jetEngineConf.selectedTaxPostTypes || false}
                onChange={(e) => actionHandler(e, 'taxPostTypes')}
                className="wdt-200 mt-4 mr-2"
                value="select_menu_post_type"
                title={__('Select Post Type', 'bit-integrations')}
                subTitle={__('Select post types to add this taxonomy for.', 'bit-integrations')}
              />
              <ConfirmModal
                className="custom-conf-mdl"
                mainMdlCls="o-v"
                btnClass="blue"
                btnTxt={__('Ok', 'bit-integrations')}
                show={actionMdl.show === 'taxPostTypes'}
                close={clsActionMdl}
                action={clsActionMdl}
                title={__('Post Types', 'bit-integrations')}>
                <div className="btcd-hr mt-2 mb-2" />
                <div className="mt-2 flx">{__('Select Menu Position', 'bit-integrations')}</div>
                {loading.cptOptions ? (
                  <Loader
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 45,
                      transform: 'scale(0.5)'
                    }}
                  />
                ) : (
                  <div className="mt-2">
                    <MultiSelect
                      options={actionOptions?.taxPostTypes}
                      className="msl-wrp-options"
                      defaultValue={jetEngineConf?.selectedTaxPostTypes}
                      onChange={(val) => setChanges(val, 'selectedTaxPostTypes')}
                      style={{ width: '100%' }}
                    />
                  </div>
                )}
              </ConfirmModal>
            </>
          )}
        {jetEngineConf.selectedTask === TASK_LIST_VALUES.DELETE_POST_TYPE && (
          <>
            <TableCheckBox
              checked={jetEngineConf.actions?.delete_all_posts || false}
              onChange={(e) => actionHandler(e, 'checkbox')}
              className="wdt-200 mt-4 mr-2"
              value="delete_all_posts"
              title={__('Delete All Posts', 'bit-integrations')}
              subTitle={__('Delete all posts related to the post type.', 'bit-integrations')}
            />
          </>
        )}
        {jetEngineConf.selectedTask === TASK_LIST_VALUES.DELETE_TAXONOMY && (
          <>
            <TableCheckBox
              checked={jetEngineConf.actions?.delete_all_tax_terms || false}
              onChange={(e) => actionHandler(e, 'checkbox')}
              className="wdt-200 mt-4 mr-2"
              value="delete_all_tax_terms"
              title={__('Delete All Terms', 'bit-integrations')}
              subTitle={__('Delete all terms related to the taxonomy.', 'bit-integrations')}
            />
          </>
        )}
      </div>
      {!isPro && !DELETE_LIST_ARRAY.includes(jetEngineConf.selectedTask) && (
        <div className="pt-2">
          <span className="actions-note">
            {__(
              'The Bit Integrations Pro plugin needs to be installed and activated to utilize these features',
              'bit-integrations'
            )}
          </span>
        </div>
      )}
      <div className="pos-rel d-flx flx-wrp">
        {(jetEngineConf.selectedTask === TASK_LIST_VALUES.CREATE_TAXONOMY ||
          jetEngineConf.selectedTask === TASK_LIST_VALUES.UPDATE_TAXONOMY) &&
          isPro && (
            <>
              <TableCheckBox
                checked={jetEngineConf.selectedTaxPostTypes || false}
                onChange={(e) => actionHandler(e, 'taxPostTypes')}
                className="wdt-200 mt-4 mr-2"
                value="select_menu_post_type"
                title={__('Select Post Type', 'bit-integrations')}
                subTitle={__('Select post types to add this taxonomy for.', 'bit-integrations')}
              />
              <ConfirmModal
                className="custom-conf-mdl"
                mainMdlCls="o-v"
                btnClass="blue"
                btnTxt={__('Ok', 'bit-integrations')}
                show={actionMdl.show === 'taxPostTypes'}
                close={clsActionMdl}
                action={clsActionMdl}
                title={__('Post Types', 'bit-integrations')}>
                <div className="btcd-hr mt-2 mb-2" />
                <div className="mt-2 flx">{__('Select Menu Position', 'bit-integrations')}</div>
                {loading.cptOptions ? (
                  <Loader
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 45,
                      transform: 'scale(0.5)'
                    }}
                  />
                ) : (
                  <div className="mt-2">
                    <MultiSelect
                      options={actionOptions?.taxPostTypes}
                      className="msl-wrp-options"
                      defaultValue={jetEngineConf?.selectedTaxPostTypes}
                      onChange={(val) => setChanges(val, 'selectedTaxPostTypes')}
                      style={{ width: '100%' }}
                    />
                  </div>
                )}
              </ConfirmModal>
            </>
          )}
        {(jetEngineConf.selectedTask === TASK_LIST_VALUES.CREATE_POST_TYPE ||
          jetEngineConf.selectedTask === TASK_LIST_VALUES.CREATE_CONTENT_TYPE ||
          jetEngineConf.selectedTask === TASK_LIST_VALUES.UPDATE_POST_TYPE ||
          jetEngineConf.selectedTask === TASK_LIST_VALUES.UPDATE_CONTENT_TYPE) && (
          <>
            <TableCheckBox
              checked={jetEngineConf.selectedMenuPosition || false}
              onChange={(e) => actionHandler(e, 'menuPosition')}
              className="wdt-200 mt-4 mr-2"
              value="select_menu_position"
              title={__('Select Menu Position', 'bit-integrations')}
              subTitle={__('Select existing menu item to add page after.', 'bit-integrations')}
              isInfo={!isPro}
            />
            <ConfirmModal
              className="custom-conf-mdl"
              mainMdlCls="o-v"
              btnClass="blue"
              btnTxt={__('Ok', 'bit-integrations')}
              show={actionMdl.show === 'menuPosition'}
              close={clsActionMdl}
              action={clsActionMdl}
              title={__('Menu Position', 'bit-integrations')}>
              <div className="btcd-hr mt-2 mb-2" />
              <div className="mt-2 flx">{__('Select Menu Position', 'bit-integrations')}</div>
              {loading.cptOptions ? (
                <Loader
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 45,
                    transform: 'scale(0.5)'
                  }}
                />
              ) : (
                <div className="mt-2">
                  <MultiSelect
                    options={actionOptions?.menuPosition}
                    className="msl-wrp-options"
                    defaultValue={jetEngineConf?.selectedMenuPosition}
                    onChange={(val) => setChanges(val, 'selectedMenuPosition')}
                    style={{ width: '100%' }}
                    singleSelect
                  />
                </div>
              )}
            </ConfirmModal>
            <TableCheckBox
              checked={jetEngineConf.selectedMenuIcon || false}
              onChange={(e) => actionHandler(e, 'menuIcon')}
              className="wdt-200 mt-4 mr-2"
              value="select_menu_icon"
              title={__('Select Menu Icon', 'bit-integrations')}
              subTitle={__('Icon will be visible in admin menu.', 'bit-integrations')}
              isInfo={!isPro}
            />
            <ConfirmModal
              className="custom-conf-mdl"
              mainMdlCls="o-v"
              btnClass="blue"
              btnTxt={__('Ok', 'bit-integrations')}
              show={actionMdl.show === 'menuIcon'}
              close={clsActionMdl}
              action={clsActionMdl}
              title={__('Menu Position', 'bit-integrations')}>
              <div className="btcd-hr mt-2 mb-2" />
              <div className="mt-2 flx">{__('Select Menu Icon', 'bit-integrations')}</div>
              {loading.cptOptions ? (
                <Loader
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 45,
                    transform: 'scale(0.5)'
                  }}
                />
              ) : (
                <div className="mt-2">
                  <MultiSelect
                    options={actionOptions?.menuIcon}
                    className="msl-wrp-options"
                    defaultValue={jetEngineConf?.selectedMenuIcon}
                    onChange={(val) => setChanges(val, 'selectedMenuIcon')}
                    style={{ width: '100%' }}
                    singleSelect
                  />
                </div>
              )}
            </ConfirmModal>
          </>
        )}

        {(jetEngineConf.selectedTask === TASK_LIST_VALUES.CREATE_POST_TYPE ||
          jetEngineConf.selectedTask === TASK_LIST_VALUES.UPDATE_POST_TYPE) && (
          <>
            <TableCheckBox
              checked={jetEngineConf.selectedSupports || false}
              onChange={(e) => actionHandler(e, 'supports')}
              className="wdt-200 mt-4 mr-2"
              value="select_support"
              title={__('Select Supports', 'bit-integrations')}
              subTitle={__(
                'Registers support of certain feature(s) for a current post type.',
                'bit-integrations'
              )}
              isInfo={!isPro}
            />
            <ConfirmModal
              className="custom-conf-mdl"
              mainMdlCls="o-v"
              btnClass="blue"
              btnTxt={__('Ok', 'bit-integrations')}
              show={actionMdl.show === 'supports'}
              close={clsActionMdl}
              action={clsActionMdl}
              title={__('Menu Position', 'bit-integrations')}>
              <div className="btcd-hr mt-2 mb-2" />
              <div className="mt-2 flx">{__('Select Supports', 'bit-integrations')}</div>
              {loading.cptOptions ? (
                <Loader
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 45,
                    transform: 'scale(0.5)'
                  }}
                />
              ) : (
                <div className="mt-2">
                  <MultiSelect
                    options={actionOptions?.supports}
                    className="msl-wrp-options"
                    defaultValue={jetEngineConf?.selectedSupports}
                    onChange={(val) => setChanges(val, 'selectedSupports')}
                    style={{ width: '100%' }}
                  />
                </div>
              )}
            </ConfirmModal>
            <TableCheckBox
              checked={jetEngineConf.actions?.custom_storage || false}
              onChange={(e) => actionHandler(e, 'checkbox')}
              className="wdt-200 mt-4 mr-2"
              value="custom_storage"
              title={__('Custom Meta Storage', 'bit-integrations')}
              subTitle={__(
                'Store meta fields added below in the custom DB table instead of default `postmeta` table.',
                'bit-integrations'
              )}
              isInfo={!isPro}
            />
          </>
        )}

        {(jetEngineConf.selectedTask === TASK_LIST_VALUES.CREATE_POST_TYPE ||
          jetEngineConf.selectedTask === TASK_LIST_VALUES.CREATE_TAXONOMY ||
          jetEngineConf.selectedTask === TASK_LIST_VALUES.UPDATE_POST_TYPE ||
          jetEngineConf.selectedTask === TASK_LIST_VALUES.UPDATE_TAXONOMY) && (
          <>
            <TableCheckBox
              checked={jetEngineConf.actions?.delete_metadata || false}
              onChange={(e) => actionHandler(e, 'checkbox')}
              className="wdt-200 mt-4 mr-2"
              value="delete_metadata"
              title={__('Delete metadata', 'bit-integrations')}
              subTitle={__(
                'Check this option to delete metadata from the database for the deleted meta fields.',
                'bit-integrations'
              )}
              isInfo={!isPro}
            />
            <TableCheckBox
              checked={jetEngineConf.actions?.show_edit_link || false}
              onChange={(e) => actionHandler(e, 'checkbox')}
              className="wdt-200 mt-4 mr-2"
              value="show_edit_link"
              title={__('`Edit post type/meta box` link', 'bit-integrations')}
              subTitle={__(
                'Add `Edit post type/meta box` link to post edit page.',
                'bit-integrations'
              )}
              isInfo={!isPro}
            />
            <TableCheckBox
              checked={jetEngineConf.actions?.hide_field_names || false}
              onChange={(e) => actionHandler(e, 'checkbox')}
              className="wdt-200 mt-4 mr-2"
              value="hide_field_names"
              title={__('Hide meta field names', 'bit-integrations')}
              subTitle={__('Hide meta field names on post edit page.', 'bit-integrations')}
              isInfo={!isPro}
            />
            <TableCheckBox
              checked={jetEngineConf.actions?.public || false}
              onChange={(e) => actionHandler(e, 'checkbox')}
              className="wdt-200 mt-4 mr-2"
              value="public"
              title={__('Is Public', 'bit-integrations')}
              subTitle={__(
                'Controls how the type is visible to authors and readers.',
                'bit-integrations'
              )}
              isInfo={!isPro}
            />
            {(jetEngineConf.selectedTask === TASK_LIST_VALUES.CREATE_POST_TYPE ||
              jetEngineConf.selectedTask === TASK_LIST_VALUES.UPDATE_POST_TYPE) && (
              <TableCheckBox
                checked={jetEngineConf.actions?.exclude_from_search || false}
                onChange={(e) => actionHandler(e, 'checkbox')}
                className="wdt-200 mt-4 mr-2"
                value="exclude_from_search"
                title={__('Exclude From Search', 'bit-integrations')}
                subTitle={__(
                  'Whether to exclude posts with this post type from front end search results.',
                  'bit-integrations'
                )}
                isInfo={!isPro}
              />
            )}
            <TableCheckBox
              checked={jetEngineConf.actions?.publicly_queryable || false}
              onChange={(e) => actionHandler(e, 'checkbox')}
              className="wdt-200 mt-4 mr-2"
              value="publicly_queryable"
              title={__('Publicly Queryable', 'bit-integrations')}
              subTitle={__(
                'Whether queries can be performed on the front end as part of parse_request().',
                'bit-integrations'
              )}
              isInfo={!isPro}
            />
            <TableCheckBox
              checked={jetEngineConf.actions?.show_ui || false}
              onChange={(e) => actionHandler(e, 'checkbox')}
              className="wdt-200 mt-4 mr-2"
              value="show_ui"
              title={__('Show Admin UI', 'bit-integrations')}
              subTitle={__(
                'Whether to generate a default UI for managing this post type in the admin.',
                'bit-integrations'
              )}
              isInfo={!isPro}
            />
            <TableCheckBox
              checked={jetEngineConf.actions?.show_in_menu || false}
              onChange={(e) => actionHandler(e, 'checkbox')}
              className="wdt-200 mt-4 mr-2"
              value="show_in_menu"
              title={__('Show in Admin Menu', 'bit-integrations')}
              subTitle={__(
                'Where to show the post type in the admin menu. show_ui must be true.',
                'bit-integrations'
              )}
              isInfo={!isPro}
            />
            <TableCheckBox
              checked={jetEngineConf.actions?.show_in_nav_menus || false}
              onChange={(e) => actionHandler(e, 'checkbox')}
              className="wdt-200 mt-4 mr-2"
              value="show_in_nav_menus"
              title={__('Show in Nav Menu', 'bit-integrations')}
              subTitle={__(
                'Whether post_type is available for selection in navigation menus.',
                'bit-integrations'
              )}
              isInfo={!isPro}
            />
            <TableCheckBox
              checked={jetEngineConf.actions?.show_in_rest || false}
              onChange={(e) => actionHandler(e, 'checkbox')}
              className="wdt-200 mt-4 mr-2"
              value="show_in_rest"
              title={__('Show in Rest API', 'bit-integrations')}
              subTitle={__(
                'Whether to expose this post type in the REST API. Also enable/disable Gutenberg editor for current post type.',
                'bit-integrations'
              )}
              isInfo={!isPro}
            />
            {(jetEngineConf.selectedTask === TASK_LIST_VALUES.CREATE_POST_TYPE ||
              jetEngineConf.selectedTask === TASK_LIST_VALUES.UPDATE_POST_TYPE) && (
              <>
                <TableCheckBox
                  checked={jetEngineConf.actions?.query_var || false}
                  onChange={(e) => actionHandler(e, 'checkbox')}
                  className="wdt-200 mt-4 mr-2"
                  value="query_var"
                  title={__('Register Query Var', 'bit-integrations')}
                  subTitle={__('Sets the query_var key for this post type.', 'bit-integrations')}
                  isInfo={!isPro}
                />
                <TableCheckBox
                  checked={jetEngineConf.actions?.has_archive || false}
                  onChange={(e) => actionHandler(e, 'checkbox')}
                  className="wdt-200 mt-4 mr-2"
                  value="has_archive"
                  title={__('Map Meta Cap', 'bit-integrations')}
                  subTitle={__(
                    'Whether to use the internal default meta capability handling.',
                    'bit-integrations'
                  )}
                  isInfo={!isPro}
                />
              </>
            )}
            <TableCheckBox
              checked={jetEngineConf.actions?.hierarchical || false}
              onChange={(e) => actionHandler(e, 'checkbox')}
              className="wdt-200 mt-4 mr-2"
              value="hierarchical"
              title={
                jetEngineConf.selectedTask === TASK_LIST_VALUES.CREATE_POST_TYPE
                  ? __('Hierarchical', 'bit-integrations')
                  : __('Rewrite Hierarchical', 'bit-integrations')
              }
              subTitle={__(
                `${
                  jetEngineConf.selectedTask === TASK_LIST_VALUES.CREATE_POST_TYPE
                    ? 'Whether the post type is hierarchical (e.g. page).'
                    : 'Either hierarchical rewrite tag or not.'
                }`,
                'bit-integrations'
              )}
              isInfo={!isPro}
            />
          </>
        )}
        {(jetEngineConf.selectedTask === TASK_LIST_VALUES.CREATE_RELATION ||
          jetEngineConf.selectedTask === TASK_LIST_VALUES.UPDATE_RELATION) && (
          <>
            <TableCheckBox
              checked={jetEngineConf.actions?.parent_control || false}
              onChange={(e) => actionHandler(e, 'checkbox')}
              className="wdt-200 mt-4 mr-2"
              value="parent_control"
              title={__('Register controls for parent object', 'bit-integrations')}
              subTitle={__(
                'Adds controls to manage related children items to the edit page of the parent object.',
                'bit-integrations'
              )}
              isInfo={!isPro}
            />
            <TableCheckBox
              checked={jetEngineConf.actions?.parent_manager || false}
              onChange={(e) => actionHandler(e, 'checkbox')}
              className="wdt-200 mt-4 mr-2"
              value="parent_manager"
              title={__('Allow to create new children from parent', 'bit-integrations')}
              subTitle={__(
                'If enabled, allows to create new children items from the related items control for parent object page.',
                'bit-integrations'
              )}
              isInfo={!isPro}
            />
            <TableCheckBox
              checked={jetEngineConf.actions?.parent_allow_delete || false}
              onChange={(e) => actionHandler(e, 'checkbox')}
              className="wdt-200 mt-4 mr-2"
              value="parent_allow_delete"
              title={__('Allow to delete children from parent', 'bit-integrations')}
              subTitle={__(
                'If enabled, allows to delete children items from the related items control for parent object page.',
                'bit-integrations'
              )}
              isInfo={!isPro}
            />
            <TableCheckBox
              checked={jetEngineConf.actions?.child_control || false}
              onChange={(e) => actionHandler(e, 'checkbox')}
              className="wdt-200 mt-4 mr-2"
              value="child_control"
              title={__('Register controls for child object', 'bit-integrations')}
              subTitle={__(
                'Adds controls to manage related parent items to the edit page of the child object.',
                'bit-integrations'
              )}
              isInfo={!isPro}
            />
            <TableCheckBox
              checked={jetEngineConf.actions?.child_manager || false}
              onChange={(e) => actionHandler(e, 'checkbox')}
              className="wdt-200 mt-4 mr-2"
              value="child_manager"
              title={__('Allow to create new parents from children', 'bit-integrations')}
              subTitle={__(
                'If enabled, allows to create new parent items from the related items control for child object page.',
                'bit-integrations'
              )}
              isInfo={!isPro}
            />
            <TableCheckBox
              checked={jetEngineConf.actions?.child_allow_delete || false}
              onChange={(e) => actionHandler(e, 'checkbox')}
              className="wdt-200 mt-4 mr-2"
              value="child_allow_delete"
              title={__('Allow to delete parents from children', 'bit-integrations')}
              subTitle={__(
                'If enabled, allows to delete parent items from the related items control for child object page.',
                'bit-integrations'
              )}
              isInfo={!isPro}
            />
            <TableCheckBox
              checked={jetEngineConf.actions?.db_table || false}
              onChange={(e) => actionHandler(e, 'checkbox')}
              className="wdt-200 mt-4 mr-2"
              value="db_table"
              title={__('Register separate DB table', 'bit-integrations')}
              subTitle={__(
                'Register separate DB tables to store current relation items and meta data. If you plan to create multiple relations with a big amount of items, this option will help optimize performance.',
                'bit-integrations'
              )}
              isInfo={!isPro}
            />
          </>
        )}
      </div>
    </>
  )
}
