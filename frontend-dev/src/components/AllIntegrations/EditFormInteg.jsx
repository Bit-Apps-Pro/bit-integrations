import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { $formFields, $newFlow } from '../../GlobalStates'
import bitsFetch from '../../Utils/bitsFetch'
import { __ } from '../../Utils/i18nwrap'
import { deepCopy } from '../../Utils/Helpers'
import getAllType from '../Triggers/TriggerHelpers/AffiliateHelper/AffiliateCommonFunction'
import { getBuddybossForum, getBuddybossGroup, getBuddybossTopicByForum } from '../Triggers/TriggerHelpers/BuddybossHelper/BuddybossCommonFunction'
import { getAllEDDDiscountCode, getAllEDDProduct } from '../Triggers/TriggerHelpers/EDDHelper/EDDCommonFunction.js'
import { getFluentCrmLists, getFluentCrmStatus, getFluentCrmTags } from '../Triggers/TriggerHelpers/FluentCrmHelper/FluentCrmCommonFunction'
import { getAllAchievementType, getAllRankType } from '../Triggers/TriggerHelpers/GamiPressHelper/GamiPressCommonFunction'
import getAllDonationForms, { getAllRecurringDonationForms } from '../Triggers/TriggerHelpers/GiveWpHelper/GiveWpCommonFunction'
import { getAllPostTypeJetEngine } from '../Triggers/TriggerHelpers/JetEngineHelper/JetEngineCommonFunction'
import { getAllCourses, getAllGroups, getAllQuizes } from '../Triggers/TriggerHelpers/LearndashHelper/LearnDashCommonFunction'
import { getAllLifterLmsQuiz, getAllLifterLmsLesson, getAllLifterLmsCourse, getAllLifterLmsMembership } from '../Triggers/TriggerHelpers/LifterLmsHelper/LifterLmsCommonFunction.js'
import { getAllMembership, getAllOneTimeMembership, getAllRecurringMembership } from '../Triggers/TriggerHelpers/MemberpressHelper/MemberpressCommonFunction'
import getAllPaidMembershipProLevel from '../Triggers/TriggerHelpers/PaidMembershipProHelper/PaidMembershipProCommonFunction'
import { getAllPostPosts, getAllPostType } from '../Triggers/TriggerHelpers/PostHelper/PostCommonFunction'
import getAllLevels from '../Triggers/TriggerHelpers/RestrictContentHelper/RestrictContentCommonFunction'
import getAllCommissionType from '../Triggers/TriggerHelpers/SliceWpHelper/SliceWpCommonFunction'
import getSureCartAllProduct from '../Triggers/TriggerHelpers/SureCartHelper/SureCartCommonFunction'
import { getAllOrderStatus, getAllSubscriptionProduct, getAllSubscriptionStatus, getAllWCProductCategory, getAllWCProducts } from '../Triggers/TriggerHelpers/WooCommerceHelper/WooCommerceCommonFunction'
import TriggerMultiOption from '../Triggers/TriggerMultiOption'
import { getAllMasterStudyLmsCourse, getAllMasterStudyLmsLesson } from '../Triggers/TriggerHelpers/MasterStudyLmsHelper/MasterStudyLmsCommonFunction.js'
import { getAllThriveApprenticeCourse, getAllThriveApprenticeLesson, getAllThriveApprenticeModule } from '../Triggers/TriggerHelpers/ThriveApprenticeHelper/ThriveApprenticeCommonFunction'
import { getAllUMrole } from '../Triggers/TriggerHelpers/UltimateMemberHelper/UltimatedMemberCommonFunction'
import { getAllGroundhoggTags } from '../Triggers/TriggerHelpers/GroundhoggHelper/GroundhoggCommonFunction'
import { create } from 'mutative'

function EditFormInteg({ setSnackbar, className = '' }) {
  const [forms, setForms] = useState([])
  const [formPost, setFormPost] = useState([])
  const [flow, setFlow] = useRecoilState($newFlow)
  const setFormFields = useSetRecoilState($formFields)
  const setFlowData = (val, type) => {
    // const tmpFlow = deepCopy(flow)
    // const tmpFlow = { ...flow }
    // tmpFlow.flow_details[type] = val
    // console.log(tmpFlow.flow_details)
    // setFlow({ ...tmpFlow })
    setFlow(prevFlow => create(prevFlow, (draftFlow) => {
      draftFlow.flow_details[type] = val
    }))
  }
  // console.log(flow.flow_details)
  const handle = (e) => {
    const tmpInteg = { ...flow }
    const { name, value } = e.target
    tmpInteg[name] = value
    setFlow(tmpInteg)
    let queryData = { id: value }
    if (
      flow.triggered_entity === 'Elementor'
      || flow.triggered_entity === 'Divi'
      || flow.triggered_entity === 'Bricks'
      || flow.triggered_entity === 'Brizy'
      || flow.triggered_entity === 'PiotnetAddon'
      || flow.triggered_entity === 'Breakdance'
      || flow.triggered_entity === 'CartFlow'
    ) {
      queryData = { ...queryData, postId: formPost[value] ?? flow.flow_details.postId }
    } else {
      baseDataLoad(flow.triggered_entity, tmpInteg)
    }

    const loadFormFields = bitsFetch(queryData, `${flow.triggered_entity.toLowerCase()}/get/form`).then((res) => {
      if (res.success) {
        setFormFields(res.data.fields)
      }
      return res.data
    })
    toast.promise(loadFormFields, {
      success: __('Form fields Refresh successfully', 'bit-integrations'),
      error: __('Error Occurred', 'bit-integrations'),
      loading: __('Loading Form Fields...'),
    })
  }

  const baseDataLoad = (trigger, data) => {
    if (trigger === 'LearnDash') {
      if (
        data.triggered_entity_id === '1'
        || data.triggered_entity_id === '2'
        || data.triggered_entity_id === '3'
        || data.triggered_entity_id === '4'
        || data.triggered_entity_id === '5'
        || data.triggered_entity_id === '11'
      ) {
        getAllCourses(data, setFlow)
      } else if (data.triggered_entity_id === '6' || data.triggered_entity_id === '7' || data.triggered_entity_id === '8') {
        getAllQuizes(data, setFlow)
      } else if (data.triggered_entity_id === '9' || data.triggered_entity_id === '10') {
        getAllGroups(data, setFlow)
      }
    }
    if (trigger === 'RestrictContent') {
      getAllLevels(data, setFlow)
    }

    if (trigger === 'BuddyBoss') {
      if (data.triggered_entity_id === '9' || data.triggered_entity_id === '10' || data.triggered_entity_id === '11' || data.triggered_entity_id === '12' || data.triggered_entity_id === '13') {
        getBuddybossGroup(data, setFlow)
      }
      if (data.triggered_entity_id === '3' || data.triggered_entity_id === '4') {
        getBuddybossForum(data, setFlow)
      }
    }
    if (trigger === 'Affiliate') {
      if (data.triggered_entity_id === '3' || data.triggered_entity_id === '4' || data.triggered_entity_id === '5') {
        getAllType(data, setFlow)
      }
    }
    if (trigger === 'WC') {
      if (['10', '19'].includes(data.triggered_entity_id)) {
        getAllWCProducts(data, setFlow)
      }
      if (['11'].includes(data.triggered_entity_id)) {
        getAllOrderStatus(data, setFlow)
      }
      if (['12', '13', '14', '15', '16'].includes(data.triggered_entity_id)) {
        getAllSubscriptionProduct(data, setFlow)
      }
      if (['15'].includes(data.triggered_entity_id)) {
        getAllSubscriptionStatus(data, setFlow)
      }
      if (['17'].includes(data.triggered_entity_id)) {
        getAllWCProductCategory(data, setFlow)
      }
    }
    if (trigger === 'Post') {
      if ([1, 2, 3, 6].includes(Number(data.triggered_entity_id))) {
        getAllPostType(data, setFlow)
      }
      if ([4, 5, 7, 8, 9].includes(Number(data.triggered_entity_id))) {
        getAllPostPosts(data, setFlow)
      }
    }
    if (trigger === 'FluentCrm') {
      if (
        data.triggered_entity_id === 'fluentcrm-1'
        || data.triggered_entity_id === 'fluentcrm-2'
      ) {
        getFluentCrmTags(data, setFlow)
      } else if (data.triggered_entity_id === 'fluentcrm-3'
        || data.triggered_entity_id === 'fluentcrm-4') {
        getFluentCrmLists(data, setFlow)
      } else if (data.triggered_entity_id === 'fluentcrm-5') {
        getFluentCrmStatus(data, setFlow)
      }
    }
    if (trigger === 'GamiPress') {
      if ([1].includes(Number(data.triggered_entity_id))) {
        getAllRankType(data, setFlow)
      }
      if ([2, 3, 5].includes(Number(data.triggered_entity_id))) {
        getAllAchievementType(data, setFlow)
      }
    }
    if (trigger === 'JetEngine') {
      if ([1, 2].includes(Number(data.triggered_entity_id))) {
        getAllPostTypeJetEngine(data, setFlow)
      }
    }
    if (trigger === 'Memberpress') {
      if ([3, 4].includes(Number(data.triggered_entity_id))) {
        getAllMembership(data, setFlow)
      }
      if ([1].includes(Number(data.triggered_entity_id))) {
        getAllOneTimeMembership(data, setFlow)
      }
      if ([2, 5].includes(Number(data.triggered_entity_id))) {
        getAllRecurringMembership(data, setFlow)
      }
    }
    if (trigger === 'PaidMembershipPro') {
      getAllPaidMembershipProLevel(data, setFlow)
    }
    if (trigger === 'SliceWp') {
      if ([2].includes(Number(data.triggered_entity_id))) {
        getAllCommissionType(data, setFlow)
      }
    }
    if (trigger === 'SureCart') {
      if ([1, 2, 3].includes(Number(data.triggered_entity_id))) {
        getSureCartAllProduct(data, setFlow)
      }
    }
    if (trigger === 'GiveWp') {
      if ([1].includes(Number(data.triggered_entity_id))) {
        getAllDonationForms(data, setFlow)
      }
      if ([2].includes(Number(data.triggered_entity_id))) {
        getAllRecurringDonationForms(data, setFlow)
      }
    }
    if (trigger === 'LifterLms') {
      if ([1, 2, 3].includes(Number(data.triggered_entity_id))) {
        getAllLifterLmsQuiz(data, setFlow)
      } else if ([4].includes(Number(data.triggered_entity_id))) {
        getAllLifterLmsLesson(data, setFlow)
      } else if ([5, 6, 7].includes(Number(data.triggered_entity_id))) {
        getAllLifterLmsCourse(data, setFlow)
      } else if ([8].includes(Number(data.triggered_entity_id))) {
        getAllLifterLmsMembership(data, setFlow)
      }
    }
    if (trigger === 'EDD') {
      if ([1].includes(Number(data.triggered_entity_id))) {
        getAllEDDProduct(data, setFlow)
      } else if ([2].includes(Number(data.triggered_entity_id))) {
        getAllEDDDiscountCode(data, setFlow)
      }
    }
    if (trigger === 'MasterStudyLms') {
      if ([1, 3, 4, 5].includes(Number(data.triggered_entity_id))) {
        getAllMasterStudyLmsCourse(data, setFlow)
      } else if ([2].includes(Number(data.triggered_entity_id))) {
        getAllMasterStudyLmsLesson(data, setFlow)
      }
    }
    if (trigger === 'Groundhogg') {
      if ([2, 3].includes(Number(data.triggered_entity_id))) {
        getAllGroundhoggTags(data, setFlow)
      }
    }
    if (trigger === 'ThriveApprentice') {
      if ([1].includes(Number(data.triggered_entity_id))) {
        getAllThriveApprenticeCourse(data, setFlow)
      } else if ([2].includes(Number(data.triggered_entity_id))) {
        getAllThriveApprenticeLesson(data, setFlow)
      } else if ([3].includes(Number(data.triggered_entity_id))) {
        getAllThriveApprenticeModule(data, setFlow)
      }
    }
    if (trigger === 'UltimateMember') {
      if (data.triggered_entity_id == 'roleSpecificChange') {
        getAllUMrole(data, setFlow)
      }
    }
  }

  useEffect(() => {
    bitsFetch({}, `${flow.triggered_entity.toLowerCase()}/get`, null, 'GET').then((res) => {
      if (res.success) {
        setForms(res.data)
        const tmpFormPost = {}
        res.data?.map((form) => {
          tmpFormPost[form.id] = form.post_id
        })
        setFormPost(tmpFormPost)
      }
    })
  }, [])
  return (
    <>
      <div className={`${className || 'flx'}`}>
        <b className="wdt-200 d-in-b">{__(' Form/Task Name:', 'bit-integrations')}</b>
        <select name="triggered_entity_id" value={flow.triggered_entity_id} onChange={handle} className={`btcd-paper-inp w-5 ${className}`}>
          <option value="">{__('Select Form', 'bit-integrations')}</option>
          {forms?.map((form) => (
            <option key={form.id} value={form.id}>
              {form.title}
            </option>
          ))}
        </select>
      </div>
      <TriggerMultiOption flow={flow} setFlowData={setFlowData} edit={true} />
    </>
  )
}

export default EditFormInteg
