<?php

/**
 * GamiPress Record Api
 */

namespace BitCode\FI\Actions\GamiPress;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert, upsert
 */
class RecordApiHelper
{
    private static $integrationID;
    private $_integrationDetails;

    public function __construct($integrationDetails, $integId)
    {
        $this->_integrationDetails = $integrationDetails;
        self::$integrationID = $integId;
    }

    public static function getIntegrationId()
    {
        return $integrationID = self::$integrationID;
    }


    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];

        foreach ($fieldMap as $key => $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->gamiPressFormField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif (!is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }
        return $dataFinal;
    }

    public static function addRankToUser($selectedRank, $mainAction)
    {
        $user_id = get_current_user_id();
        if ($mainAction === '1') {
            return gamipress_update_user_rank($user_id, (int)$selectedRank);
        } else {
            // $user_id = get_current_user_id();
            $rank_types = gamipress_get_rank_types();

            $rank_id = (int)$selectedRank;
            $rank    = get_post($rank_id);

            if (! $rank || ! isset($rank_types[ $rank->post_type ])) {
                return;
            }

            $user_rank_id = gamipress_get_user_rank_id(absint($user_id), $rank->post_type);

            if (! empty($user_rank_id) && $rank_id == $user_rank_id) {
                return gamipress_revoke_rank_to_user(absint($user_id), $user_rank_id, 0, array( 'admin_id' => absint($user_id) ));

                // if still rank is assigned to user
                $user_rank_id = gamipress_get_user_rank_id(absint($user_id), $rank->post_type);
                if (! empty($user_rank_id) && $rank_id == $user_rank_id) {
                    $meta = "_gamipress_{$rank->post_type}_rank";
                    return gamipress_delete_user_meta($user_id, $meta);
                }
            } else {
                return false;
            }
        }
    }

    public static function addAchievementToUser($achievementId, $mainAction)
    {
        $user_id = get_current_user_id();
        if ($mainAction === '2') {
            if (!empty($achievementId) && !empty($user_id) && is_numeric((int)$achievementId)) {
                gamipress_award_achievement_to_user(absint((int)$achievementId), absint($user_id), get_current_user_id());
                return true;
            }
            return false;
        } else {
            if (!empty($achievementId) && !empty($user_id) && is_numeric((int)$achievementId)) {
                gamipress_revoke_achievement_to_user(absint((int)$achievementId), absint($user_id));
                return true;
            }
            return false;
        }
    }

    public static function addPointToUser($pointType, $points, $mainAction)
    {
        $user_id = get_current_user_id();
        if ($mainAction === '3') {
            return gamipress_award_points_to_user(absint($user_id), absint($points), $pointType);
        } else {
            $deduct_points = 0;

            $points_type = $pointType;

            $existing_points = gamipress_get_user_points(absint($user_id), $points_type);

            if (($existing_points - absint($points)) < 0) {
                $deduct_points = absint($points) + ($existing_points - absint($points));
            } else {
                $deduct_points = absint($points);
            }

            return gamipress_deduct_points_to_user(absint($user_id), absint($deduct_points), $points_type);
        }
    }


    public function execute(
        $mainAction,
        $fieldValues,
        $integrationDetails,
        $integrationData,
        $fieldMap
    ) {
        $fieldData = [];
        if ($mainAction === '1') {
            $apiResponse = self::addRankToUser($integrationDetails->selectedRank, $mainAction);
            if ($apiResponse) {
                LogHandler::save(self::getIntegrationId(), wp_json_encode(['type' => 'insert', 'type_name' => 'update-rank']), 'success', json_encode("Added successfully, post id {$apiResponse->ID} and post title {$apiResponse->post_title}"));
            } else {
                LogHandler::save(self::getIntegrationId(), wp_json_encode(['type' => 'insert', 'type_name' => 'update-rank']), 'error', json_encode("Failed to add rank"));
            }
        }

        if ($mainAction === '2') {
            $apiResponse = self::addAchievementToUser($integrationDetails->selectedAchievement, $mainAction);
            if ($apiResponse) {
                LogHandler::save(self::getIntegrationId(), wp_json_encode(['type' => 'insert', 'type_name' => 'update-award']), 'success', json_encode("Achievement added successfully"));
            } else {
                LogHandler::save(self::getIntegrationId(), wp_json_encode(['type' => 'insert', 'type_name' => 'update-award']), 'error', json_encode("Failed to add achievement"));
            }
        }

        if ($mainAction === '3') {
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            $point= (int)$finalData['point'];
            if (!empty($point) && is_numeric($point)) {
                $apiResponse = self::addPointToUser($integrationDetails->selectedPointType, $point, $mainAction);
                if ($apiResponse) {
                    LogHandler::save(self::getIntegrationId(), wp_json_encode(['type' => 'insert', 'type_name' => 'update-point']), 'success', json_encode("Point added successfully and total points are {$apiResponse}"));
                } else {
                    LogHandler::save(self::getIntegrationId(), wp_json_encode(['type' => 'insert', 'type_name' => 'update-point']), 'error', json_encode("Failed to add point"));
                }
            } else {
                LogHandler::save(self::getIntegrationId(), wp_json_encode(['type' => 'insert', 'type_name' => 'update-point']), 'error', json_encode("Failed to add point"));
            }
        }

        if ($mainAction === '4') {
            $apiResponse = self::addRankToUser($integrationDetails->selectedRank, $mainAction);
            if ($apiResponse) {
                LogHandler::save(self::getIntegrationId(), wp_json_encode(['type' => 'revoke', 'type_name' => 'revoke-rank']), 'success', json_encode("Revoked rank successfully, post id {$apiResponse->ID} and post title {$apiResponse->post_title}"));
            } else {
                LogHandler::save(self::getIntegrationId(), wp_json_encode(['type' => 'revoke', 'type_name' => 'revoke-rank']), 'error', json_encode("Failed to revoke rank"));
            }
        }

        if ($mainAction === '5') {
            $apiResponse = self::addAchievementToUser($integrationDetails->selectedAchievement, $mainAction);
            if ($apiResponse) {
                LogHandler::save(self::getIntegrationId(), wp_json_encode(['type' => 'revoke', 'type_name' => 'revoke-achievement']), 'success', json_encode("Achievement revoked successfully"));
            } else {
                LogHandler::save(self::getIntegrationId(), wp_json_encode(['type' => 'revoke', 'type_name' => 'revoke-achievement']), 'error', json_encode("Failed to revoke achievement"));
            }
        }

        if ($mainAction === '6') {
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            $point= (int)$finalData['point'];
            if (!empty($point) && is_numeric($point)) {
                $apiResponse = self::addPointToUser($integrationDetails->selectedPointType, $point, $mainAction);
                if ($apiResponse) {
                    LogHandler::save(self::getIntegrationId(), wp_json_encode(['type' => 'insert', 'type_name' => 'update-point']), 'success', json_encode("Point revoked successfully and total points are {$apiResponse}"));
                } else {
                    LogHandler::save(self::getIntegrationId(), wp_json_encode(['type' => 'insert', 'type_name' => 'update-point']), 'error', json_encode("Failed to revoke point"));
                }
            } else {
                LogHandler::save(self::getIntegrationId(), wp_json_encode(['type' => 'insert', 'type_name' => 'update-point']), 'error', json_encode("Failed operation , point is not valid number"));
            }
        }

        return $apiResponse;
    }
}
