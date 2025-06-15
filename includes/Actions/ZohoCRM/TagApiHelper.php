<?php

/**
 * ZohoCrm Tag Api Helper
 */

namespace BitCode\FI\Actions\ZohoCRM;

use WP_Error;
use BitCode\FI\Core\Util\HttpHelper;

/**
 * Provide functionality for Tags in Zoho CRM
 */
final class TagApiHelper
{
    private $_defaultHeader;
    private $_apiDomain;
    private $_module;

    /**
     * Constructor function
     *
     * @param Object $tokenDetails Api token details
     * @param String $module       Module Name
     */
    public function __construct($tokenDetails, $module)
    {
        $this->_defaultHeader['Authorization'] = "Zoho-oauthtoken {$tokenDetails->access_token}";
        $this->_apiDomain = \urldecode($tokenDetails->api_domain) . '/crm/v6';
        $this->_module = $module;
    }

    /**
     * Helps to get Tags List of zcrm module
     *
     * @return Array|Object|WP_Error $tags Tags List
     */
    public function getTagList()
    {
        $getTagsEndpoint = "{$this->_apiDomain}/settings/tags";

        $tagListResponse = HttpHelper::get($getTagsEndpoint, ['module' => $this->_module], $this->_defaultHeader);
        if (is_wp_error($tagListResponse)) {
            return $tagListResponse;
        }

        $tags = [];
        if (!empty($tagListResponse->status) && $tagListResponse->status === 'error') {
            return new WP_Error($tagListResponse->code, $tagListResponse);
        }
        if (!empty($tagListResponse->tags)) {
            foreach ($tagListResponse->tags as $tagDetails) {
                $tags[] = $tagDetails->name;
            }
        }
        return $tags;
    }
    /**
     * Helps to add Tags to a specific record of a module
     *
     * @param Integer $recordID ID of record to add tags
     * @param String  $tagNames urlencoded string of tag names
     *
     * @return Json $addTagsResponse Tags List
     */
    public function addTagsSingleRecord($recordID, $tagNames)
    {
        $addTagsEndpoint = "{$this->_apiDomain}/{$this->_module}/{$recordID}/actions/add_tags";

        $addTagsResponse = HttpHelper::post($addTagsEndpoint, ['tag_names' => $tagNames], $this->_defaultHeader);

        return $addTagsResponse;
    }
}
