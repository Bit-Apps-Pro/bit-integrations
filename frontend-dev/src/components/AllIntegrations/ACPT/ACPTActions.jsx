/* eslint-disable max-len */
/* eslint-disable no-param-reassign */

import { create } from 'mutative'
import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import { capabilities, supports } from './staticData'

export default function ACPTActions({
  acptConf,
  setACPTConf,
  loading,
  setLoading,
  isLoading,
  setIsLoading,
  setSnackbar
}) {
  const [actionMdl, setActionMdl] = useState({ show: false })
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const actionHandler = (e, type) => {
    setACPTConf(prevConf =>
      create(prevConf, draftConf => {
        if (type !== 'support' && type !== 'capabilities') {
          draftConf.utilities[type] = !draftConf.utilities[type]
        }
      })
    )

    setActionMdl({ show: type })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, type) => {
    setACPTConf(prevConf =>
      create(prevConf, draftConf => {
        if (type === 'capabilities') {
          draftConf.utilities[type] = val

          return
        }

        draftConf[type] = val
      })
    )
  }

  return (
    <>
      <div className="pos-rel">
        <div className="d-flx flx-wrp">
          {(acptConf?.module === 'create_cpt' || acptConf?.module === 'update_cpt') && (
            <>
              <TableCheckBox
                onChange={e => actionHandler(e, 'support')}
                checked={acptConf?.supports || false}
                className="wdt-200 mt-4 mr-2"
                value="support"
                title={__('Supports', 'bit-integrations')}
                subTitle={__(
                  'Add support for various available post edit features.',
                  'bit-integrations'
                )}
              />
              <TableCheckBox
                onChange={e => actionHandler(e, 'show_in_admin_bar')}
                checked={acptConf?.utilities?.show_in_admin_bar || false}
                className="wdt-200 mt-4 mr-2"
                value="show_in_admin_bar"
                title={__('Show In Admin Bar', 'bit-integrations')}
                subTitle={__(
                  'Makes this post type available via the admin bar. Default is value of $show_in_menu.',
                  'bit-integrations'
                )}
              />
              <TableCheckBox
                onChange={e => actionHandler(e, 'has_archive')}
                checked={acptConf?.utilities?.has_archive || false}
                className="wdt-200 mt-4 mr-2"
                value="has_archive"
                title={__('Has archive', 'bit-integrations')}
                subTitle={__(
                  'Whether there should be post type archives, or if a string, the archive slug to use. Will generate the proper rewrite rules if $rewrite is enabled. Default false.',
                  'bit-integrations'
                )}
              />
            </>
          )}

          {(acptConf?.module === 'create_taxonomy' || acptConf?.module === 'update_taxonomy') && (
            <>
              <TableCheckBox
                onChange={e => actionHandler(e, 'capabilities')}
                checked={acptConf?.utilities?.capabilities || false}
                className="wdt-200 mt-4 mr-2"
                value="capabilities"
                title={__('Capabilities', 'bit-integrations')}
                subTitle={__('Capabilities for this taxonomy.', 'bit-integrations')}
              />
              <TableCheckBox
                onChange={e => actionHandler(e, 'hierarchical')}
                checked={acptConf?.utilities?.hierarchical || false}
                className="wdt-200 mt-4 mr-2"
                value="hierarchical"
                title={__('Hierarchical', 'bit-integrations')}
                subTitle={__('Whether the taxonomy is hierarchical. Default false.', 'bit-integrations')}
              />
              <TableCheckBox
                onChange={e => actionHandler(e, 'show_tagcloud')}
                checked={acptConf?.utilities?.show_tagcloud || false}
                className="wdt-200 mt-4 mr-2"
                value="show_tagcloud"
                title={__('Show Tagcloud', 'bit-integrations')}
                subTitle={__(
                  'Whether to list the taxonomy in the Tag Cloud Widget controls. If not set, the default is inherited from $show_ui (default true).',
                  'bit-integrations'
                )}
              />
              <TableCheckBox
                onChange={e => actionHandler(e, 'show_in_quick_edit')}
                checked={acptConf?.utilities?.show_in_quick_edit || false}
                className="wdt-200 mt-4 mr-2"
                value="show_in_quick_edit"
                title={__('Show in quick edit', 'bit-integrations')}
                subTitle={__(
                  'Whether to show the taxonomy in the quick/bulk edit panel. It not set, the default is inherited from $show_ui (default true).',
                  'bit-integrations'
                )}
              />
              <TableCheckBox
                onChange={e => actionHandler(e, 'show_admin_column')}
                checked={acptConf?.utilities?.show_admin_column || false}
                className="wdt-200 mt-4 mr-2"
                value="show_admin_column"
                title={__('Show admin column', 'bit-integrations')}
                subTitle={__(
                  'Whether to display a column for the taxonomy on its post type listing screens. Default false.',
                  'bit-integrations'
                )}
              />
              <TableCheckBox
                onChange={e => actionHandler(e, 'sort')}
                checked={acptConf?.utilities?.sort || false}
                className="wdt-200 mt-4 mr-2"
                value="sort"
                title={__('Sort', 'bit-integrations')}
                subTitle={__(
                  'Whether terms in this taxonomy should be sorted in the order they are provided to wp_set_object_terms(). Default null which equates to false.',
                  'bit-integrations'
                )}
              />
            </>
          )}

          <TableCheckBox
            onChange={e => actionHandler(e, 'public')}
            checked={acptConf?.utilities?.public || false}
            className="wdt-200 mt-4 mr-2"
            value="public"
            title={__('public', 'bit-integrations')}
            subTitle={__(
              'Whether a post type is intended for use publicly either via the admin interface or by front-end users.',
              'bit-integrations'
            )}
          />
          <TableCheckBox
            onChange={e => actionHandler(e, 'publicly_queryable')}
            checked={acptConf?.utilities?.publicly_queryable || false}
            className="wdt-200 mt-4 mr-2"
            value="publicly_queryable"
            title={__('Publicly Queryable', 'bit-integrations')}
            subTitle={__(
              'Whether queries can be performed on the front end for the post type as part of parse_request().',
              'bit-integrations'
            )}
          />
          <TableCheckBox
            onChange={e => actionHandler(e, 'show_ui')}
            checked={acptConf?.utilities?.show_ui || false}
            className="wdt-200 mt-4 mr-2"
            value="show_ui"
            title={__('Show UI', 'bit-integrations')}
            subTitle={__(
              'Whether to generate and allow a UI for managing this post type in the admin. Default is value of $public.',
              'bit-integrations'
            )}
          />
          <TableCheckBox
            onChange={e => actionHandler(e, 'show_in_menu')}
            checked={acptConf?.utilities?.show_in_menu || false}
            className="wdt-200 mt-4 mr-2"
            value="show_in_menu"
            title={__('Show In Menu', 'bit-integrations')}
            subTitle={__(
              'Where to show the post type in the admin menu. To work, $show_ui must be true. If true, the post type is shown in its own top level menu. If false, no menu is shown.',
              'bit-integrations'
            )}
          />
          <TableCheckBox
            onChange={e => actionHandler(e, 'show_in_nav_menus')}
            checked={acptConf?.utilities?.show_in_nav_menus || false}
            className="wdt-200 mt-4 mr-2"
            value="show_in_nav_menus"
            title={__('Show In Nav Menus', 'bit-integrations')}
            subTitle={__(
              'Makes this post type available for selection in navigation menus. Default is value of $public.',
              'bit-integrations'
            )}
          />
          <TableCheckBox
            onChange={e => actionHandler(e, 'show_in_rest')}
            checked={acptConf?.utilities?.show_in_rest || false}
            className="wdt-200 mt-4 mr-2"
            value="show_in_rest"
            title={__('Show In Rest API', 'bit-integrations')}
            subTitle={__(
              'Whether to include the post type in the REST API. Set this to true for the post type to be available in the block editor. SET TRUE TO ENABLE GUTENBERG EDITOR.',
              'bit-integrations'
            )}
          />
          <TableCheckBox
            onChange={e => actionHandler(e, 'rewrite')}
            checked={acptConf?.utilities?.rewrite || false}
            className="wdt-200 mt-4 mr-2"
            value="rewrite"
            title={__('Rewrite', 'bit-integrations')}
            subTitle={__(
              'Triggers the handling of rewrites for this post type. To prevent rewrite, set to false. Defaults to true, using $post_type as slug. To specify rewrite rules, an array can be passed with any of these keys.',
              'bit-integrations'
            )}
          />
          <TableCheckBox
            onChange={e => actionHandler(e, 'query_var')}
            checked={acptConf?.utilities?.query_var || false}
            className="wdt-200 mt-4 mr-2"
            value="query_var"
            title={__('Query var', 'bit-integrations')}
            subTitle={__(
              'Sets the query_var key for this post type. Defaults to key. If false, a post type cannot be loaded at ?{query_var}={post_slug}. If specified as a string, the query {post_slug} will be valid.',
              'bit-integrations'
            )}
          />

          <ConfirmModal
            className="custom-conf-mdl"
            mainMdlCls="o-v"
            btnClass="purple"
            btnTxt={__('Ok', 'bit-integrations')}
            show={actionMdl.show === 'support'}
            close={clsActionMdl}
            action={clsActionMdl}
            title={__('Select Support', 'bit-integrations')}>
            <div className="btcd-hr mt-2 mb-2" />
            <div className="flx mt-2">
              <MultiSelect
                className="msl-wrp-options w-9"
                defaultValue={acptConf?.supports}
                options={supports}
                onChange={val => setChanges(val, 'supports')}
              />
            </div>
          </ConfirmModal>
          <ConfirmModal
            className="custom-conf-mdl"
            mainMdlCls="o-v"
            btnClass="purple"
            btnTxt={__('Ok', 'bit-integrations')}
            show={actionMdl.show === 'capabilities'}
            close={clsActionMdl}
            action={clsActionMdl}
            title={__('Select Capabilities', 'bit-integrations')}>
            <div className="btcd-hr mt-2 mb-2" />
            <div className="flx mt-2">
              <MultiSelect
                className="msl-wrp-options w-9"
                defaultValue={acptConf?.utilities?.capabilities}
                options={capabilities}
                onChange={val => setChanges(val, 'capabilities')}
              />
            </div>
          </ConfirmModal>
        </div>
      </div>
    </>
  )
}
