import FluentCrmHelper from './TriggerHelpers/FluentCrmHelper'
import TutorLmsHelper from './TriggerHelpers/TutorLmsHelper'
import WPCoursewareHelper from './TriggerHelpers/WPCoursewareHelper'
import PostHelper from './TriggerHelpers/PostHelper'
import GroundhoggHelper from './TriggerHelpers/GroundhoggHelper'
import LearnDashHelper from './TriggerHelpers/LearnDashHelper'
import WooCommerceHelper from './TriggerHelpers/WooCommerceHelper'
import BuddyBossHelper from './TriggerHelpers/BuddyBossHelper'
import RestrictContentHelper from './TriggerHelpers/RestrictContentHelper'
import AffiliateHelper from './TriggerHelpers/AffiliateHelper'
import GamiPressHelper from './TriggerHelpers/GamiPressHelper'
import JetEngineHelper from './TriggerHelpers/JetEngineHelper'
import MemberpressHelper from './TriggerHelpers/MemberpressHelper'
import PaidMembershipProHelper from './TriggerHelpers/PaidMembershipProHelper'
import SliceWpHelper from './TriggerHelpers/SliceWpHelper'
import SureCartHelper from './TriggerHelpers/SureCartHelper'
import GiveWpHelper from './TriggerHelpers/GiveWpHelper'
import LifterLmsHelper from './TriggerHelpers/LifterLmsHelper'
import EDDHelper from './TriggerHelpers/EDDHelper'
import MasterStudyLmsHelper from './TriggerHelpers/MasterStudyLmsHelper'
import ThriveApprenticeHelper from './TriggerHelpers/ThriveApprenticeHelper'
import UltimateMemberHelper from './TriggerHelpers/UltimateMemberHelper'
import AcademyLmsHelper from './TriggerHelpers/AcademyLmsHelper'

const TriggerMultiOption = ({ flow, setFlowData, edit = false }) => (
  <div>
    {flow?.triggered_entity === 'TutorLms' && <TutorLmsHelper flow={flow} setFlowData={setFlowData} />}
    {flow?.triggered_entity === 'WC' && <WooCommerceHelper flow={flow} setFlowData={setFlowData} edit={edit} />}
    {flow?.triggered_entity === 'Groundhogg' && <GroundhoggHelper flow={flow} setFlowData={setFlowData} edit={edit} />}
    {flow?.triggered_entity === 'RestrictContent' && <RestrictContentHelper flow={flow} setFlowData={setFlowData} edit={edit} />}
    {flow?.triggered_entity === 'WPCourseware' && <WPCoursewareHelper flow={flow} setFlowData={setFlowData} />}
    {flow?.triggered_entity === 'FluentCrm' && <FluentCrmHelper flow={flow} setFlowData={setFlowData} edit={edit} />}
    {flow?.triggered_entity === 'Post' && <PostHelper flow={flow} setFlowData={setFlowData} edit={edit} />}
    {flow?.triggered_entity === 'LearnDash' && <LearnDashHelper flow={flow} setFlowData={setFlowData} edit={edit} />}
    {flow?.triggered_entity === 'BuddyBoss' && <BuddyBossHelper flow={flow} setFlowData={setFlowData} edit={edit} />}
    {flow?.triggered_entity === 'Affiliate' && <AffiliateHelper flow={flow} setFlowData={setFlowData} edit={edit} />}
    {flow?.triggered_entity === 'GamiPress' && <GamiPressHelper flow={flow} setFlowData={setFlowData} edit={edit} />}
    {flow?.triggered_entity === 'JetEngine' && <JetEngineHelper flow={flow} setFlowData={setFlowData} edit={edit} />}
    {flow?.triggered_entity === 'Memberpress' && <MemberpressHelper flow={flow} setFlowData={setFlowData} edit={edit} />}
    {flow?.triggered_entity === 'PaidMembershipPro' && <PaidMembershipProHelper flow={flow} setFlowData={setFlowData} edit={edit} />}
    {flow?.triggered_entity === 'SliceWp' && <SliceWpHelper flow={flow} setFlowData={setFlowData} edit={edit} />}
    {flow?.triggered_entity === 'SureCart' && <SureCartHelper flow={flow} setFlowData={setFlowData} edit={edit} />}
    {flow?.triggered_entity === 'GiveWp' && <GiveWpHelper flow={flow} setFlowData={setFlowData} edit={edit} />}
    {flow?.triggered_entity === 'LifterLms' && <LifterLmsHelper flow={flow} setFlowData={setFlowData} edit={edit} />}
    {flow?.triggered_entity === 'EDD' && <EDDHelper flow={flow} setFlowData={setFlowData} edit={edit} />}
    {flow?.triggered_entity === 'MasterStudyLms' && <MasterStudyLmsHelper flow={flow} setFlowData={setFlowData} edit={edit} />}
    {flow?.triggered_entity === 'ThriveApprentice' && <ThriveApprenticeHelper flow={flow} setFlowData={setFlowData} edit={edit} />}
    {flow?.triggered_entity === 'UltimateMember' && <UltimateMemberHelper flow={flow} setFlowData={setFlowData} edit={edit} />}
    {flow?.triggered_entity === 'AcademyLms' && <AcademyLmsHelper flow={flow} setFlowData={setFlowData} />}
  </div>
)

export default TriggerMultiOption
