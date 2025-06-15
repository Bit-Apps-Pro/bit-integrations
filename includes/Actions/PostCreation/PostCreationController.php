<?php

/**
 *  Wordpres Post  Creation
 *  added MB  Custom Fields
 *  Added ACF Custom Fields
 */

namespace BitCode\FI\Actions\PostCreation;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\Helper;
use BitCode\FI\Flow\Flow;
use BitCode\FI\Log\LogHandler;

final class PostCreationController {

    public static function postFieldMapping( $postData, $mappingFields, $fieldValues ) {
        foreach ( $mappingFields as $mapped ) {
            if ( isset( $mapped->formField ) && isset( $mapped->postField ) ) {
                $triggerValue = $mapped->formField;
                $actionValue = $mapped->postField;
                if ( $triggerValue === 'custom' ) {
                    $postData[$actionValue] = Common::replaceFieldWithValue( $mapped->customValue, $fieldValues );
                } else if ( !is_null( $fieldValues[$triggerValue] ) && $actionValue !== '_thumbnail_id' ) {
                    $postData[$actionValue] = $fieldValues[$triggerValue];
                } else if ( $actionValue === '_thumbnail_id' ) {
                    Helper::uploadFeatureImg( $fieldValues[$triggerValue], $postData['post_id'] );
                }
            }
        }
        return $postData;
    }

    public static function acfFileMapping( $acfMapField, $fieldValues, $postId ) {
        $fileTypes = ['file', 'image'];

        foreach ( $acfMapField as $fieldPair ) {
            if ( property_exists( $fieldPair, "acfFileUpload" ) ) {
                $triggerValue = $fieldPair->formField;
                $actionValue = $fieldPair->acfFileUpload;
                $fieldObject = get_field_object( $actionValue );
                if ( !empty( $fieldValues[$fieldPair->formField] ) ) {
                    if ( in_array( $fieldObject['type'], $fileTypes ) ) {
                        $filePath = is_array( $fieldValues[$triggerValue] ) ? $fieldValues[$triggerValue][0] : $fieldValues[$triggerValue];

                        $attachMentId = Helper::singleFileMoveWpMedia( $filePath, $postId );
                        if ( !empty( $attachMentId ) ) {
                            update_post_meta( $postId, '_' . $actionValue, $fieldObject['key'] );
                            update_post_meta( $postId, $fieldObject['name'], json_encode( $attachMentId ) );
                        }
                    } else {
                        $attachMentId = Helper::multiFileMoveWpMedia( $fieldValues[$triggerValue], $postId );
                        if ( !empty( $attachMentId ) ) {
                            update_post_meta( $postId, '_' . $actionValue, $fieldObject['key'] );
                            update_post_meta( $postId, $fieldObject['name'], $attachMentId );
                        }
                    }
                }
            }
        }
    }

    public static function acfFieldMapping( $mappingFields, $fieldValues ) {
        $acfFieldData = [];
        foreach ( $mappingFields as $key => $mapped ) {
            if(isset($mapped->acfField)){
                $fieldObject = get_field_object( $mapped->acfField );
                if ( $fieldObject && isset( $mapped->formField ) && $mapped->acfField ) {
                    $triggerValue = $mapped->formField;
                    $actionValue = $mapped->acfField;
                    $acfFieldData[$key]['key'] = $actionValue;
                    $acfFieldData[$key]['name'] = $fieldObject['name'];
                    if ( $triggerValue === 'custom' ) {
                        $acfFieldData[$key]['value'] = Common::replaceFieldWithValue( $mapped->customValue, $fieldValues );
                    } else if ( !is_null( $fieldValues[$triggerValue] ) && gettype( $fieldValues[$triggerValue] ) !== 'array' ) {
                        $acfFieldData[$key]['value'] = $fieldValues[$triggerValue];
                    } else if ( !is_null( $fieldValues[$triggerValue] ) && gettype( $fieldValues[$triggerValue] ) === 'array' ) {
                        $acfFieldData[$key]['value'] = $fieldValues[$triggerValue];
                    }
                }
            }
           
        }
        return $acfFieldData;
    }

    public static function mbFieldMapping( $mappingFields, $fieldValues, $metaboxFields, $postId ) {
        $metaboxFieldData = [];
        foreach ( $mappingFields as $key => $mapped ) {
            if ( isset( $mapped->formField ) && isset( $mapped->metaboxField ) ) {
                $triggerValue = $mapped->formField;
                $actionValue = $mapped->metaboxField;
                $fieldObject = $metaboxFields[$actionValue];

                if ( $fieldObject ) {
                    $metaboxFieldData[$key]['name'] = $fieldObject['field_name'];
                    if ( $triggerValue === 'custom' ) {
                        $metaboxFieldData[$key]['value'] = Common::replaceFieldWithValue( $mapped->customValue, $fieldValues );
                    } else if ( !is_null( $fieldValues[$triggerValue] ) && gettype( $fieldValues[$triggerValue] ) !== 'array' ) {
                        $metaboxFieldData[$key]['value'] = $fieldValues[$triggerValue];
                    } else if ( !is_null( $fieldValues[$triggerValue] ) && gettype( $fieldValues[$triggerValue] ) === 'array' ) {
                        foreach ( $fieldValues[$triggerValue] as $value ) {
                            add_post_meta( $postId, $fieldObject['field_name'], $value );
                        }
                    }
                }
            }
        }
        return $metaboxFieldData;
    }

    public static function mbFileMapping( $metaboxMapField, $fieldValues, $metaboxFields, $postId ) {
        foreach ( $metaboxMapField as $fieldPair ) {
            if ( property_exists( $fieldPair, "metaboxFileUpload" ) ) {
                if ( !empty( $fieldValues[$fieldPair->formField] ) ) {
                    $triggerValue = $fieldPair->formField;
                    $actionValue = $fieldPair->metaboxFile;
                    $fieldObject = $metaboxFields->$actionValue;

                    if ( $fieldObject['multiple'] == false ) {
                        $filePath = is_array( $fieldValues[$triggerValue] ) ? $fieldValues[$triggerValue][0] : $fieldValues[$triggerValue];
                        $attachMentId = Helper::singleFileMoveWpMedia( $filePath, $postId );

                        if ( !empty( $attachMentId ) ) {
                            add_post_meta( $postId, $fieldObject['field_name'], $attachMentId );
                        }
                    } else if ( $fieldObject['multiple'] == true ) {
                        $attachMentId = Helper::multiFileMoveWpMedia( $fieldValues[$triggerValue], $postId );

                        if ( !empty( $attachMentId ) && is_array( $attachMentId ) ) {
                            foreach ( $attachMentId as $attachemnt ) {
                                add_post_meta( $postId, $fieldObject['field_name'], $attachemnt );
                            }
                        }
                    }
                }
            }
        }
    }

    public function postFieldData( $postData ) {
        $data = [];
        $data['comment_status'] = isset( $postData->comment_status ) ? $postData->comment_status : '';
        $data['post_status'] = isset( $postData->post_status ) ? $postData->post_status : '';
        $data['post_type'] = isset( $postData->post_type ) ? $postData->post_type : '';

        if ( isset( $postData->post_author ) && $postData->post_author !== 'logged_in_user' ) {
            $data['post_author'] = $postData->post_author;
        } else {
            $data['post_author'] = get_current_user_id();
        }

        return $data;
    }

    public function execute( $integrationData, $fieldValues ) {
        $flowDetails = $integrationData->flow_details;
        $triggers = ['WPF', 'GF'];
        if ( in_array( $fieldValues['bit-integrator%trigger_data%']['triggered_entity'], $triggers ) ) {
            $fieldValues = Helper::splitStringToarray( $fieldValues );
        }

        $postData = $this->postFieldData( $flowDetails );
        $postFieldMap = $flowDetails->post_map;
        $acfFieldMap = $flowDetails->acf_map;
        $acfFileMap = $flowDetails->acf_file_map;

        $mbFieldMap = $flowDetails->metabox_map;
        $mbFileMap = $flowDetails->metabox_file_map;

        $postId = wp_insert_post( ['post_title' => '(no title)', 'post_content' => ''] );

        $postData['post_id'] = $postId;
        $specialTagValue = Flow::specialTagMappingValue( $postFieldMap );
        $updatedPostValues = $fieldValues + $specialTagValue;

        $updateData = self::postFieldMapping( $postData, $postFieldMap, $updatedPostValues );
        $updateData['ID'] = $postId;

        unset( $updateData['_thumbnail_id'] );
        unset( $updateData['post_id'] );
        $result = wp_update_post( $updateData, true );

        if ( is_wp_error( $result ) || !$result ) {
            $message = is_wp_error( $result ) ? $result->get_error_message() : 'error';
            LogHandler::save( $integrationData->id, 'Post Creation', 'error', $message );
        } else {
            LogHandler::save( $integrationData->id, 'Post Creation', 'success', $result );
        }

        if ( class_exists( 'ACF' ) ) {
            $specialTagValue = Flow::specialTagMappingValue( $acfFieldMap );
            $updatedAcfValues = $fieldValues + $specialTagValue;
            $acfFieleData = self::acfFieldMapping( $acfFieldMap, $updatedAcfValues );
            self::acfFileMapping( $acfFileMap, $fieldValues, $postId );
            foreach ( $acfFieleData as $data ) {
                if ( isset( $data['key'] ) && isset( $data['value'] ) ) {
                    add_post_meta( $postId, '_' . $data['name'], $data['key'] );
                    add_post_meta( $postId, $data['name'], $data['value'] );
                }
            }
        }

        if ( function_exists( 'rwmb_meta' ) ) {
            $mbFields = rwmb_get_object_fields( $flowDetails->post_type );
            $specialTagValue = Flow::specialTagMappingValue( $mbFieldMap );

            $updatedAcfValues = $fieldValues + $specialTagValue;
            $mbFieldData = self::mbFieldMapping( $mbFieldMap, $updatedAcfValues, $mbFields, $postId );
            foreach ( $mbFieldData as $data ) {
                if ( isset( $data['name'] ) && isset( $data['value'] ) ) {
                    add_post_meta( $postId, $data['name'], $data['value'] );
                }
            }
            self::mbFileMapping( $mbFileMap, $fieldValues, $mbFields, $postId );
        }

    }

}
