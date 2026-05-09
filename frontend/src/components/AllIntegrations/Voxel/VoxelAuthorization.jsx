import { useCallback } from 'react'
import { AUTH_TYPES } from '../../../Utils/connectionAuth'
import { __ } from '../../../Utils/i18nwrap'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import PlatformAuthorization from '../../Connections/PlatformAuthorization'

export default function VoxelAuthorization({
  voxelConf,
  setVoxelConf,
  step,
  setStep,
  isInfo
}) {
  return (
    <PlatformAuthorization
      config={voxelConf}
      setConfig={setVoxelConf}
      step={step}
      setStep={setStep}
      isInfo={isInfo}
      tutorialTitle="Voxel"
      tutorialLinks={tutorialLinks?.voxel || {}}
      authDetails={{
        authType: AUTH_TYPES.NO_AUTH,
        platformCheck: { checks: [{ type: 'class', value: 'Voxel\\Post_Type' }], logic: 'AND' }
      }}
      noteDetails={{
        note: __(
          'To use Voxel integration, make sure the Voxel theme is installed and active on your site.',
          'bit-integrations'
        )
      }}
    />
  )
}
