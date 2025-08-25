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
        draftConf[type] = !draftConf[type]
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
        draftConf[type] = val
      })
    )
  }

  return (
    <>
      <div className="pos-rel">
        <div className="d-flx flx-wrp">
          <TableCheckBox
            onChange={e => actionHandler(e, 'support')}
            checked={acptConf?.supports || false}
            className="wdt-200 mt-4 mr-2"
            value="support"
            title={__('Supports', 'bit-integrations')}
            subTitle={__('Add support for various available post edit features.', 'bit-integrations')}
          />
          <TableCheckBox
            onChange={e => actionHandler(e, 'public')}
            checked={acptConf?.public || false}
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
            checked={acptConf?.publicly_queryable || false}
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
            checked={acptConf?.show_ui || false}
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
            checked={acptConf?.show_in_menu || false}
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
            checked={acptConf?.show_in_nav_menus || false}
            className="wdt-200 mt-4 mr-2"
            value="show_in_nav_menus"
            title={__('Show In Nav Menus', 'bit-integrations')}
            subTitle={__(
              'Makes this post type available for selection in navigation menus. Default is value of $public.',
              'bit-integrations'
            )}
          />
          <TableCheckBox
            onChange={e => actionHandler(e, 'show_in_admin_bar')}
            checked={acptConf?.show_in_admin_bar || false}
            className="wdt-200 mt-4 mr-2"
            value="show_in_admin_bar"
            title={__('Show In Admin Bar', 'bit-integrations')}
            subTitle={__(
              'Makes this post type available via the admin bar. Default is value of $show_in_menu.',
              'bit-integrations'
            )}
          />
          <TableCheckBox
            onChange={e => actionHandler(e, 'show_in_rest')}
            checked={acptConf?.show_in_rest || false}
            className="wdt-200 mt-4 mr-2"
            value="show_in_rest"
            title={__('Show In Rest API', 'bit-integrations')}
            subTitle={__(
              'Whether to include the post type in the REST API. Set this to true for the post type to be available in the block editor. SET TRUE TO ENABLE GUTENBERG EDITOR.',
              'bit-integrations'
            )}
          />
          <TableCheckBox
            onChange={e => actionHandler(e, 'has_archive')}
            checked={acptConf?.has_archive || false}
            className="wdt-200 mt-4 mr-2"
            value="has_archive"
            title={__('Has archive', 'bit-integrations')}
            subTitle={__(
              'Whether there should be post type archives, or if a string, the archive slug to use. Will generate the proper rewrite rules if $rewrite is enabled. Default false.',
              'bit-integrations'
            )}
          />
          <TableCheckBox
            onChange={e => actionHandler(e, 'rewrite')}
            checked={acptConf?.rewrite || false}
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
            checked={acptConf?.query_var || false}
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
                options={[
                  { label: __('Title'), value: 'title' },
                  { label: __('Editor'), value: 'editor' },
                  { label: __('Comments'), value: 'comments' },
                  { label: __('Revisions'), value: 'revisions' },
                  { label: __('Trackbacks'), value: 'trackbacks' },
                  { label: __('Author'), value: 'author' },
                  { label: __('Excerpt'), value: 'excerpt' },
                  { label: __('Page Attributes'), value: 'page-attributes' },
                  { label: __('Thumbnail'), value: 'thumbnail' },
                  { label: __('Custom Fields'), value: 'custom-fields' },
                  { label: __('Post Formats'), value: 'post-formats' }
                ]}
                onChange={val => setChanges(val, 'supports')}
              />
            </div>
          </ConfirmModal>
        </div>
      </div>
    </>
  )
}
