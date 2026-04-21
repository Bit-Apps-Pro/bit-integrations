<?php

namespace BitApps\Integrations\Actions\WordPress;

use BitApps\Integrations\Config;
use BitApps\Integrations\Core\Util\Common;
use BitApps\Integrations\Core\Util\Hooks;
use BitApps\Integrations\Log\LogHandler;

class RecordApiHelper
{
    private $_integrationID;

    private $_integrationDetails;

    public function __construct($integrationDetails, $integId)
    {
        $this->_integrationDetails = $integrationDetails;
        $this->_integrationID      = $integId;
    }

    public function execute($fieldValues, $fieldMap, $integrationDetails)
    {
        $fieldData  = $this->generateReqDataFromFieldMap($fieldMap, $fieldValues);
        $mainAction = isset($this->_integrationDetails->mainAction) ? $this->_integrationDetails->mainAction : '';

        $defaultResponse = [
            'success' => false,
            'message' => wp_sprintf(
                // translators: %s: Plugin name
                __('%s plugin is not installed or activated', 'bit-integrations'),
                'Bit Integrations Pro'
            ),
        ];

        switch ($mainAction) {
            // === User Management ===
            case 'createNewUser':
                $response = Hooks::apply(Config::withPrefix('wordpress_createNewUser'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'updateUser':
                $response = Hooks::apply(Config::withPrefix('wordpress_updateUser'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'deleteExitingUser':
                $response = Hooks::apply(Config::withPrefix('wordpress_deleteExitingUser'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            // === User Retrieval ===
            case 'getAllUsers':
                $response = Hooks::apply(Config::withPrefix('wordpress_getAllUsers'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getAllUsersByRole':
                $response = Hooks::apply(Config::withPrefix('wordpress_getAllUsersByRole'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getUserById':
                $response = Hooks::apply(Config::withPrefix('wordpress_getUserById'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getUserByEmail':
                $response = Hooks::apply(Config::withPrefix('wordpress_getUserByEmail'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getUserByField':
                $response = Hooks::apply(Config::withPrefix('wordpress_getUserByField'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            // === User Metadata ===
            case 'getUserMetadata':
                $response = Hooks::apply(Config::withPrefix('wordpress_getUserMetadata'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getUserMetadataByMetaKey':
                $response = Hooks::apply(Config::withPrefix('wordpress_getUserMetadataByMetaKey'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'updateUserMetadata':
                $response = Hooks::apply(Config::withPrefix('wordpress_updateUserMetadata'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            // === Role Management ===
            case 'createRole':
                $response = Hooks::apply(Config::withPrefix('wordpress_createRole'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'deleteRole':
                $response = Hooks::apply(Config::withPrefix('wordpress_deleteRole'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getAllRoles':
                $response = Hooks::apply(Config::withPrefix('wordpress_getAllRoles'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'addUserRoles':
                $response = Hooks::apply(Config::withPrefix('wordpress_addUserRoles'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'removeUserRole':
                $response = Hooks::apply(Config::withPrefix('wordpress_removeUserRole'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'updateUserRole':
                $response = Hooks::apply(Config::withPrefix('wordpress_updateUserRole'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            // === Capabilities ===
            case 'getAllCapabilities':
                $response = Hooks::apply(Config::withPrefix('wordpress_getAllCapabilities'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getRoleCapabilities':
                $response = Hooks::apply(Config::withPrefix('wordpress_getRoleCapabilities'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'addRoleCapabilities':
                $response = Hooks::apply(Config::withPrefix('wordpress_addRoleCapabilities'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'removeRoleCapabilities':
                $response = Hooks::apply(Config::withPrefix('wordpress_removeRoleCapabilities'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getUserCapabilities':
                $response = Hooks::apply(Config::withPrefix('wordpress_getUserCapabilities'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'addUserCapabilities':
                $response = Hooks::apply(Config::withPrefix('wordpress_addUserCapabilities'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'removeUserCapabilities':
                $response = Hooks::apply(Config::withPrefix('wordpress_removeUserCapabilities'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            // === Post Management ===
            case 'getAllPosts':
                $response = Hooks::apply(Config::withPrefix('wordpress_getAllPosts'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getPostById':
                $response = Hooks::apply(Config::withPrefix('wordpress_getPostById'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getPostsByPostType':
                $response = Hooks::apply(Config::withPrefix('wordpress_getPostsByPostType'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getPostsByMetadata':
                $response = Hooks::apply(Config::withPrefix('wordpress_getPostsByMetadata'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getPostMetadata':
                $response = Hooks::apply(Config::withPrefix('wordpress_getPostMetadata'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getPostMetadataByMetaKey':
                $response = Hooks::apply(Config::withPrefix('wordpress_getPostMetadataByMetaKey'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getPostPermalink':
                $response = Hooks::apply(Config::withPrefix('wordpress_getPostPermalink'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getPostContent':
                $response = Hooks::apply(Config::withPrefix('wordpress_getPostContent'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getPostExcerpt':
                $response = Hooks::apply(Config::withPrefix('wordpress_getPostExcerpt'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getPostStatus':
                $response = Hooks::apply(Config::withPrefix('wordpress_getPostStatus'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'createNewPost':
                $response = Hooks::apply(Config::withPrefix('wordpress_createNewPost'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'updateExistingPost':
                $response = Hooks::apply(Config::withPrefix('wordpress_updateExistingPost'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'updatePostStatus':
                $response = Hooks::apply(Config::withPrefix('wordpress_updatePostStatus'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'deleteExistingPost':
                $response = Hooks::apply(Config::withPrefix('wordpress_deleteExistingPost'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            // === Comments ===
            case 'getAllPostComments':
                $response = Hooks::apply(Config::withPrefix('wordpress_getAllPostComments'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getPostComments':
                $response = Hooks::apply(Config::withPrefix('wordpress_getPostComments'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getUserComments':
                $response = Hooks::apply(Config::withPrefix('wordpress_getUserComments'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getUserCommentsByEmail':
                $response = Hooks::apply(Config::withPrefix('wordpress_getUserCommentsByEmail'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getCommentMetadata':
                $response = Hooks::apply(Config::withPrefix('wordpress_getCommentMetadata'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getCommentMetadataByMetaKey':
                $response = Hooks::apply(Config::withPrefix('wordpress_getCommentMetadataByMetaKey'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'createNewComment':
                $response = Hooks::apply(Config::withPrefix('wordpress_createNewComment'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'replyToComment':
                $response = Hooks::apply(Config::withPrefix('wordpress_replyToComment'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'deleteExistingComment':
                $response = Hooks::apply(Config::withPrefix('wordpress_deleteExistingComment'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            // === Post Types ===
            case 'getAllPostTypes':
                $response = Hooks::apply(Config::withPrefix('wordpress_getAllPostTypes'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getPostType':
                $response = Hooks::apply(Config::withPrefix('wordpress_getPostType'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'registerPostType':
                $response = Hooks::apply(Config::withPrefix('wordpress_registerPostType'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'unregisterPostType':
                $response = Hooks::apply(Config::withPrefix('wordpress_unregisterPostType'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'addPostTypeFeatures':
                $response = Hooks::apply(Config::withPrefix('wordpress_addPostTypeFeatures'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            // === Post Tags ===
            case 'createPostTag':
                $response = Hooks::apply(Config::withPrefix('wordpress_createPostTag'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'updatePostTag':
                $response = Hooks::apply(Config::withPrefix('wordpress_updatePostTag'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'deletePostTag':
                $response = Hooks::apply(Config::withPrefix('wordpress_deletePostTag'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getAllPostTags':
                $response = Hooks::apply(Config::withPrefix('wordpress_getAllPostTags'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getPostTag':
                $response = Hooks::apply(Config::withPrefix('wordpress_getPostTag'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'addTaxonomyToPost':
                $response = Hooks::apply(Config::withPrefix('wordpress_addTaxonomyToPost'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'removeTaxonomyFromPost':
                $response = Hooks::apply(Config::withPrefix('wordpress_removeTaxonomyFromPost'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'addTagsToPost':
                $response = Hooks::apply(Config::withPrefix('wordpress_addTagsToPost'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'removeTagsFromPost':
                $response = Hooks::apply(Config::withPrefix('wordpress_removeTagsFromPost'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            // === Media ===
            case 'addNewImage':
                $response = Hooks::apply(Config::withPrefix('wordpress_addNewImage'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'deleteMedia':
                $response = Hooks::apply(Config::withPrefix('wordpress_deleteMedia'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'renameMedia':
                $response = Hooks::apply(Config::withPrefix('wordpress_renameMedia'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getAllMedia':
                $response = Hooks::apply(Config::withPrefix('wordpress_getAllMedia'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getMediaByTitle':
                $response = Hooks::apply(Config::withPrefix('wordpress_getMediaByTitle'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getMediaById':
                $response = Hooks::apply(Config::withPrefix('wordpress_getMediaById'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            // === Taxonomies ===
            case 'getAllTaxonomies':
                $response = Hooks::apply(Config::withPrefix('wordpress_getAllTaxonomies'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getTaxonomy':
                $response = Hooks::apply(Config::withPrefix('wordpress_getTaxonomy'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'registerTaxonomy':
                $response = Hooks::apply(Config::withPrefix('wordpress_registerTaxonomy'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'unregisterTaxonomy':
                $response = Hooks::apply(Config::withPrefix('wordpress_unregisterTaxonomy'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            // === Terms ===
            case 'getAllTerms':
                $response = Hooks::apply(Config::withPrefix('wordpress_getAllTerms'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getTerm':
                $response = Hooks::apply(Config::withPrefix('wordpress_getTerm'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getTermByField':
                $response = Hooks::apply(Config::withPrefix('wordpress_getTermByField'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getTermByTaxonomy':
                $response = Hooks::apply(Config::withPrefix('wordpress_getTermByTaxonomy'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'createNewTerm':
                $response = Hooks::apply(Config::withPrefix('wordpress_createNewTerm'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'updateTerm':
                $response = Hooks::apply(Config::withPrefix('wordpress_updateTerm'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'termDelete':
                $response = Hooks::apply(Config::withPrefix('wordpress_termDelete'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            // === Categories ===
            case 'createCategory':
                $response = Hooks::apply(Config::withPrefix('wordpress_createCategory'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'updateCategory':
                $response = Hooks::apply(Config::withPrefix('wordpress_updateCategory'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'deleteCategory':
                $response = Hooks::apply(Config::withPrefix('wordpress_deleteCategory'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'addCategoryToPost':
                $response = Hooks::apply(Config::withPrefix('wordpress_addCategoryToPost'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getAllCategories':
                $response = Hooks::apply(Config::withPrefix('wordpress_getAllCategories'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getCategory':
                $response = Hooks::apply(Config::withPrefix('wordpress_getCategory'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            // === Product Tags (WooCommerce) ===
            case 'createProductTag':
                $response = Hooks::apply(Config::withPrefix('wordpress_createProductTag'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'updateProductTag':
                $response = Hooks::apply(Config::withPrefix('wordpress_updateProductTag'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'deleteProductTag':
                $response = Hooks::apply(Config::withPrefix('wordpress_deleteProductTag'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getAllProductTags':
                $response = Hooks::apply(Config::withPrefix('wordpress_getAllProductTags'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getProductTag':
                $response = Hooks::apply(Config::withPrefix('wordpress_getProductTag'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            // === Product Categories (WooCommerce) ===
            case 'createProductCategory':
                $response = Hooks::apply(Config::withPrefix('wordpress_createProductCategory'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'updateProductCategory':
                $response = Hooks::apply(Config::withPrefix('wordpress_updateProductCategory'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'deleteProductCategory':
                $response = Hooks::apply(Config::withPrefix('wordpress_deleteProductCategory'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getAllProductCategories':
                $response = Hooks::apply(Config::withPrefix('wordpress_getAllProductCategories'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getProductCategory':
                $response = Hooks::apply(Config::withPrefix('wordpress_getProductCategory'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            // === Product Types (WooCommerce) ===
            case 'createProductType':
                $response = Hooks::apply(Config::withPrefix('wordpress_createProductType'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'updateProductType':
                $response = Hooks::apply(Config::withPrefix('wordpress_updateProductType'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'deleteProductType':
                $response = Hooks::apply(Config::withPrefix('wordpress_deleteProductType'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getAllProductTypes':
                $response = Hooks::apply(Config::withPrefix('wordpress_getAllProductTypes'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'getProductType':
                $response = Hooks::apply(Config::withPrefix('wordpress_getProductType'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            // === Plugin Management ===
            case 'checkPluginActivationStatus':
                $response = Hooks::apply(Config::withPrefix('wordpress_checkPluginActivationStatus'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            case 'activatePlugin':
                $response = Hooks::apply(Config::withPrefix('wordpress_activatePlugin'), $defaultResponse, $fieldData, $integrationDetails);

                break;

            default:
                $response = [
                    'success' => false,
                    'message' => __('Invalid action', 'bit-integrations'),
                ];

                break;
        }

        $responseType = isset($response['success']) && $response['success'] ? 'success' : 'error';
        LogHandler::save($this->_integrationID, ['type' => 'WordPress', 'type_name' => $mainAction], $responseType, $response);

        return $response;
    }

    private function generateReqDataFromFieldMap($fieldMap, $fieldValues)
    {
        $dataFinal = [];

        foreach ($fieldMap as $item) {
            $triggerValue = $item->formField;
            $actionValue  = $item->wordPressField;

            $dataFinal[$actionValue] = $triggerValue === 'custom' && isset($item->customValue)
                ? Common::replaceFieldWithValue($item->customValue, $fieldValues)
                : ($fieldValues[$triggerValue] ?? '');
        }

        return $dataFinal;
    }
}
