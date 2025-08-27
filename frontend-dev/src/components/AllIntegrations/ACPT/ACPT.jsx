/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import toast from 'react-hot-toast'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import ACPTAuthorization from './ACPTAuthorization'
import { checkMappedFields } from './ACPTCommonFunc'
import ACPTIntegLayout from './ACPTIntegLayout'

function ACPT({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})

  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const [acptConf, setAcptConf] = useState({
    name: 'ACPT',
    type: 'ACPT',
    base_url: window.location.origin,
    api_key: 'd90d8700ed4b-5b93e5df9754',
    field_map: [{ formField: '', acptFormField: '' }],
    label_field_map: [{ formField: '', acptFormField: '' }],
    acptFields: [],
    acptLabels: [],
    utilities: {},
    module: '',
    cptFields,
    cptLabels,
    taxonomyLabels,
    taxonomyFields,
    optionPageFields,
    modules
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(flow, setFlow, allIntegURL, acptConf, navigate, '', '', setIsLoading)
    resp.then(res => {
      if (res.success) {
        toast.success(res.data?.msg)
        navigate(allIntegURL)
      } else {
        toast.error(res.data || res)
      }
    })
  }

  const nextPage = pageNo => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    if (acptConf.module != 'update_license' && !checkMappedFields(acptConf)) {
      toast.error(__('Please map mandatory fields', 'bit-integrations'))
      return
    }

    if (acptConf.module === 'create_license' && !acptConf?.selectedStatus) {
      toast.error(__('Please select Status', 'bit-integrations'))
      return
    }

    if (acptConf.module === 'update_license' && !acptConf?.selectedLicense) {
      toast.error(__('Please select Status', 'bit-integrations'))
      return
    }

    acptConf.field_map.length > 0 && setStep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <ACPTAuthorization
        acptConf={acptConf}
        setAcptConf={setAcptConf}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
      />

      {/* STEP 2 */}
      <div
        className="btcd-stp-page"
        style={{
          ...(step === 2 && { width: 900, minHeight: '400px', height: 'auto', overflow: 'visible' })
        }}>
        <ACPTIntegLayout
          formFields={formFields}
          acptConf={acptConf}
          setAcptConf={setAcptConf}
          loading={loading}
          setLoading={setLoading}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        {acptConf?.module && (
          <button
            onClick={() => nextPage(3)}
            disabled={!checkMappedFields(acptConf)}
            className="btn f-right btcd-btn-lg purple sh-sm flx"
            type="button">
            {__('Next', 'bit-integrations')} &nbsp;
            <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
          </button>
        )}
      </div>

      {/* STEP 3 */}
      {acptConf?.module && (
        <IntegrationStepThree
          step={step}
          saveConfig={() => saveConfig()}
          isLoading={isLoading}
          dataConf={acptConf}
          setDataConf={setAcptConf}
          formFields={formFields}
        />
      )}
    </div>
  )
}

export default ACPT

const modules = [
  { name: 'create_cpt', label: __('Create CPT', 'bit-integrations'), is_pro: false },
  { name: 'update_cpt', label: __('Update CPT', 'bit-integrations'), is_pro: true },
  { name: 'delete_cpt', label: __('Delete CPT', 'bit-integrations'), is_pro: true },
  { name: 'create_taxonomy', label: __('Create Taxonomy', 'bit-integrations'), is_pro: true },
  { name: 'update_taxonomy', label: __('Update Taxonomy', 'bit-integrations'), is_pro: true },
  { name: 'delete_taxonomy', label: __('Delete Taxonomy', 'bit-integrations'), is_pro: true },
  {
    name: 'associate_taxonomy_to_cpt',
    label: __('Associate Taxonomy To CPT', 'bit-integrations'),
    is_pro: true
  },
  { name: 'create_option_page', label: __('Create Option Page', 'bit-integrations'), is_pro: true },
  { name: 'update_option_page', label: __('Update Option Page', 'bit-integrations'), is_pro: true },
  { name: 'delete_option_page', label: __('Delete Option Page', 'bit-integrations'), is_pro: true },
  { name: 'delete_meta_group', label: __('Delete Meta Field Group', 'bit-integrations'), is_pro: true },
  { name: 'create_dynamic_block', label: __('Create Dynamic Block', 'bit-integrations'), is_pro: true },
  { name: 'update_dynamic_block', label: __('Update Dynamic Block', 'bit-integrations'), is_pro: true },
  { name: 'delete_dynamic_block', label: __('Delete Dynamic Block', 'bit-integrations'), is_pro: true }
]

const cptFields = [
  { label: __('Post Name', 'bit-integrations'), key: 'post_name', required: true },
  { label: __('Singular Label', 'bit-integrations'), key: 'singular_label', required: true },
  { label: __('Plural Label', 'bit-integrations'), key: 'plural_label', required: true },
  { label: __('Icon', 'bit-integrations'), key: 'icon', required: true },
  { label: __('REST API base slug', 'bit-integrations'), key: 'rest_base', required: false },
  { label: __('Menu position', 'bit-integrations'), key: 'menu_position', required: false },
  { label: __('Capability type', 'bit-integrations'), key: 'capability_type', required: false },
  { label: __('Custom rewrite rules', 'bit-integrations'), key: 'custom_rewrite', required: false },
  { label: __('Custom query var', 'bit-integrations'), key: 'custom_query_var', required: false }
]

const cptLabels = [
  { label: __('Menu Name', 'bit-integrations'), key: 'menu_name' },
  { label: __('All Items', 'bit-integrations'), key: 'all_items' },
  { label: __('Add New', 'bit-integrations'), key: 'add_new' },
  { label: __('Add New Item', 'bit-integrations'), key: 'add_new_item' },
  { label: __('Edit Item', 'bit-integrations'), key: 'edit_item' },
  { label: __('New Item', 'bit-integrations'), key: 'new_item' },
  { label: __('View Item', 'bit-integrations'), key: 'view_item' },
  { label: __('View Items', 'bit-integrations'), key: 'view_items' },
  { label: __('Search Item', 'bit-integrations'), key: 'search_item' },
  { label: __('Not Found', 'bit-integrations'), key: 'not_found' },
  { label: __('Not Found in Trash', 'bit-integrations'), key: 'not_found_in_trash' },
  { label: __('Parent Item Colon', 'bit-integrations'), key: 'parent_item_colon' },
  { label: __('Featured Image', 'bit-integrations'), key: 'featured_image' },
  { label: __('Set Featured Image', 'bit-integrations'), key: 'set_featured_image' },
  { label: __('Remove Featured Image', 'bit-integrations'), key: 'remove_featured_image' },
  { label: __('Use Featured Image', 'bit-integrations'), key: 'use_featured_image' },
  { label: __('Archives', 'bit-integrations'), key: 'archives' },
  { label: __('Insert into Item', 'bit-integrations'), key: 'insert_into_item' },
  { label: __('Uploaded to This Item', 'bit-integrations'), key: 'uploaded_to_this_item' },
  { label: __('Filter Items List', 'bit-integrations'), key: 'filter_items_list' },
  { label: __('Items List Navigation', 'bit-integrations'), key: 'items_list_navigation' },
  { label: __('Items List', 'bit-integrations'), key: 'items_list' },
  { label: __('Filter by Date', 'bit-integrations'), key: 'filter_by_date' },
  { label: __('Item Published', 'bit-integrations'), key: 'item_published' },
  { label: __('Item Published Privately', 'bit-integrations'), key: 'item_published_privately' },
  { label: __('Item Reverted to Draft', 'bit-integrations'), key: 'item_reverted_to_draft' },
  { label: __('Item Scheduled', 'bit-integrations'), key: 'item_scheduled' },
  { label: __('Item Updated', 'bit-integrations'), key: 'item_updated' }
]

const taxonomyLabels = [
  { label: __('Menu Name', 'bit-integrations'), key: 'name' },
  { label: __('Singular name', 'bit-integrations'), key: 'singular_name' },
  { label: __('Search Items', 'bit-integrations'), key: 'search_items' },
  { label: __('Popular Items', 'bit-integrations'), key: 'popular_items' },
  { label: __('All Items', 'bit-integrations'), key: 'all_items' },
  { label: __('Parent Item', 'bit-integrations'), key: 'parent_item' },
  { label: __('Parent Item Colon', 'bit-integrations'), key: 'parent_item_colon' },
  { label: __('Edit Item', 'bit-integrations'), key: 'edit_item' },
  { label: __('View Item', 'bit-integrations'), key: 'view_item' },
  { label: __('Update Item', 'bit-integrations'), key: 'update_item' },
  { label: __('Add New Item', 'bit-integrations'), key: 'add_new_item' },
  { label: __('New Item Name', 'bit-integrations'), key: 'new_item_name' },
  {
    label: __('Separate Items With Commas', 'bit-integrations'),
    key: 'separate_items_with_commas'
  },
  { label: __('Add or Remove Items', 'bit-integrations'), key: 'add_or_remove_items' },
  {
    label: __('Choose From Most Used', 'bit-integrations'),
    key: 'choose_from_most_used'
  },
  { label: __('Not Found', 'bit-integrations'), key: 'not_found' },
  { label: __('No Terms', 'bit-integrations'), key: 'no_terms' },
  { label: __('Filter By Item', 'bit-integrations'), key: 'filter_by_item' },
  {
    label: __('Items List Navigation', 'bit-integrations'),
    key: 'items_list_navigation'
  },
  { label: __('Items List', 'bit-integrations'), key: 'items_list' },
  { label: __('Most Used', 'bit-integrations'), key: 'most_used' },
  { label: __('Back To Items', 'bit-integrations'), key: 'back_to_items' }
]

const taxonomyFields = [
  { label: __('Slug', 'bit-integrations'), key: 'slug', required: true },
  { label: __('Singular Label', 'bit-integrations'), key: 'singular_label', required: true },
  { label: __('Plural Label', 'bit-integrations'), key: 'plural_label', required: true },
  { label: __('REST API base slug', 'bit-integrations'), key: 'rest_base', required: false },
  {
    label: __('REST API Controller Class', 'bit-integrations'),
    key: 'rest_controller_class',
    required: false
  },
  { label: __('Menu position', 'bit-integrations'), key: 'menu_position', required: false },
  { label: __('Capability type', 'bit-integrations'), key: 'capability_type', required: false },
  { label: __('Custom rewrite rules', 'bit-integrations'), key: 'custom_rewrite', required: false },
  { label: __('Custom query var', 'bit-integrations'), key: 'custom_query_var', required: false },
  { label: __('Default Term', 'bit-integrations'), key: 'default_term', required: false }
]

const optionPageFields = [
  { label: __('Page Title', 'bit-integrations'), key: 'pageTitle', required: true },
  { label: __('Menu Title', 'bit-integrations'), key: 'menuTitle', required: true },
  { label: __('Menu Slug', 'bit-integrations'), key: 'menuSlug', required: true },
  { label: __('Menu Icon', 'bit-integrations'), key: 'icon', required: true },
  { label: __('Menu Position', 'bit-integrations'), key: 'position', required: true },
  { label: __('Capability', 'bit-integrations'), key: 'capability', required: true },
  { label: __('Page Description', 'bit-integrations'), key: 'description', required: false }
]
