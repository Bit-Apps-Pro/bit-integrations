import { create } from 'mutative'
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import {
  AddCategoryToPostFields,
  AddImageFields,
  CategoryIdField,
  CommentIdField,
  CreateCategoryFields,
  CreateCommentFields,
  CreatePostFields,
  CreateProductCategoryFields,
  CreateProductTagFields,
  CreateProductTypeFields,
  CreateRoleFields,
  CreateTagFields,
  CreateTermFields,
  CreateUserFields,
  EmptyFields,
  MediaIdField,
  PluginPathField,
  PostIdField,
  PostTypeFeaturesFields,
  PostTypeField,
  ProductTypeIdField,
  RegisterPostTypeFields,
  RegisterTaxonomyFields,
  RenameMediaFields,
  ReplyCommentFields,
  RoleCapabilitiesFields,
  RoleNameField,
  TagIdField,
  TagsToPostFields,
  TaxonomyField,
  TaxonomyToPostFields,
  TermIdTaxonomyFields,
  UpdateCategoryFields,
  UpdatePostFields,
  UpdatePostStatusFields,
  UpdateProductCategoryFields,
  UpdateProductTagFields,
  UpdateProductTypeFields,
  UpdateTagFields,
  UpdateTermFields,
  UpdateUserFields,
  UpdateUserMetaFields,
  UpdateUserRoleFields,
  UserCapabilitiesFields,
  UserIdField,
  UserRoleManageFields
} from './staticData'

export const handleInput = (e, wordPressConf, setWordPressConf) => {
  const { name, value } = e.target
  setWordPressConf(prevConf =>
    create(prevConf, draftConf => {
      draftConf[name] = value
    })
  )
}

export const getFieldsForAction = action => {
  switch (action) {
    // User Management
    case 'createNewUser':
      return CreateUserFields
    case 'updateUser':
      return UpdateUserFields
    case 'deleteExistingUser':
      return UserIdField
    // User Metadata
    case 'updateUserMetadata':
      return UpdateUserMetaFields
    // Role Management
    case 'createRole':
      return CreateRoleFields
    case 'deleteRole':
      return RoleNameField
    case 'addUserRoles':
      return UserRoleManageFields
    case 'removeUserRole':
      return UserRoleManageFields
    case 'updateUserRole':
      return UpdateUserRoleFields
    // Capabilities
    case 'addRoleCapabilities':
      return RoleCapabilitiesFields
    case 'removeRoleCapabilities':
      return RoleCapabilitiesFields
    case 'addUserCapabilities':
      return UserCapabilitiesFields
    case 'removeUserCapabilities':
      return UserCapabilitiesFields
    // Post Management
    case 'createNewPost':
      return CreatePostFields
    case 'updateExistingPost':
      return UpdatePostFields
    case 'updatePostStatus':
      return UpdatePostStatusFields
    case 'deleteExistingPost':
      return PostIdField
    // Comments
    case 'createNewComment':
      return CreateCommentFields
    case 'replyToComment':
      return ReplyCommentFields
    case 'deleteExistingComment':
      return CommentIdField
    // Post Types
    case 'registerPostType':
      return RegisterPostTypeFields
    case 'unregisterPostType':
      return PostTypeField
    case 'addPostTypeFeatures':
      return PostTypeFeaturesFields
    // Post Tags
    case 'createPostTag':
      return CreateTagFields
    case 'updatePostTag':
      return UpdateTagFields
    case 'deletePostTag':
      return TagIdField
    case 'addTaxonomyToPost':
      return TaxonomyToPostFields
    case 'removeTaxonomyFromPost':
      return TaxonomyToPostFields
    case 'addTagsToPost':
      return TagsToPostFields
    case 'removeTagsFromPost':
      return TagsToPostFields
    // Media
    case 'addNewImage':
      return AddImageFields
    case 'deleteMedia':
      return MediaIdField
    case 'renameMedia':
      return RenameMediaFields
    // Taxonomies
    case 'registerTaxonomy':
      return RegisterTaxonomyFields
    case 'unregisterTaxonomy':
      return TaxonomyField
    // Terms
    case 'createNewTerm':
      return CreateTermFields
    case 'updateTerm':
      return UpdateTermFields
    case 'termDelete':
      return TermIdTaxonomyFields
    // Categories
    case 'createCategory':
      return CreateCategoryFields
    case 'updateCategory':
      return UpdateCategoryFields
    case 'deleteCategory':
      return CategoryIdField
    case 'addCategoryToPost':
      return AddCategoryToPostFields
    // WooCommerce Product Tags
    case 'createProductTag':
      return CreateProductTagFields
    case 'updateProductTag':
      return UpdateProductTagFields
    case 'deleteProductTag':
      return TagIdField
    // WooCommerce Product Categories
    case 'createProductCategory':
      return CreateProductCategoryFields
    case 'updateProductCategory':
      return UpdateProductCategoryFields
    case 'deleteProductCategory':
      return CategoryIdField
    // WooCommerce Product Types
    case 'createProductType':
      return CreateProductTypeFields
    case 'updateProductType':
      return UpdateProductTypeFields
    case 'deleteProductType':
      return ProductTypeIdField
    // Plugin
    case 'checkPluginActivationStatus':
      return PluginPathField
    case 'activatePlugin':
      return PluginPathField
    default:
      return EmptyFields
  }
}

export const generateMappedField = fields => {
  const requiredFlds = fields.filter(fld => fld.required === true)
  return requiredFlds.length > 0
    ? requiredFlds.map(field => ({ formField: '', wordPressField: field.key }))
    : [{ formField: '', wordPressField: '' }]
}

export const checkMappedFields = wordPressConf => {
  const mappedFields = wordPressConf?.field_map
    ? wordPressConf.field_map.filter(
        mappedField =>
          !mappedField.formField ||
          !mappedField.wordPressField ||
          (mappedField.formField === 'custom' && !mappedField.customValue)
      )
    : []
  return mappedFields.length === 0
}

export const refreshWordPressUsers = (setWordPressConf, setIsLoading) => {
  setIsLoading(true)
  bitsFetch(null, 'get_wordpress_users')
    .then(result => {
      if (result?.success) {
        setWordPressConf(prevConf =>
          create(prevConf, draftConf => {
            draftConf.allUsers = result.data
          })
        )
        toast.success(__('Users refreshed', 'bit-integrations'))
      } else {
        toast.error(__('Failed to fetch users', 'bit-integrations'))
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const refreshWordPressRoles = (setWordPressConf, setIsLoading) => {
  setIsLoading(true)
  bitsFetch(null, 'get_wordpress_user_roles')
    .then(result => {
      if (result?.success) {
        setWordPressConf(prevConf =>
          create(prevConf, draftConf => {
            draftConf.allRoles = result.data
          })
        )
        toast.success(__('Roles refreshed', 'bit-integrations'))
      } else {
        toast.error(__('Failed to fetch roles', 'bit-integrations'))
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const refreshWordPressPostTypes = (setWordPressConf, setIsLoading) => {
  setIsLoading(true)
  bitsFetch(null, 'get_wordpress_post_types')
    .then(result => {
      if (result?.success) {
        setWordPressConf(prevConf =>
          create(prevConf, draftConf => {
            draftConf.allPostTypes = result.data
          })
        )
        toast.success(__('Post types refreshed', 'bit-integrations'))
      } else {
        toast.error(__('Failed to fetch post types', 'bit-integrations'))
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const refreshWordPressPosts = (postType, setWordPressConf, setIsLoading) => {
  setIsLoading(true)
  bitsFetch({ postType: postType || '' }, 'get_wordpress_posts')
    .then(result => {
      if (result?.success) {
        setWordPressConf(prevConf =>
          create(prevConf, draftConf => {
            draftConf.allPosts = result.data
          })
        )
        toast.success(__('Posts refreshed', 'bit-integrations'))
      } else {
        toast.error(__('Failed to fetch posts', 'bit-integrations'))
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const refreshWordPressTaxonomies = (setWordPressConf, setIsLoading) => {
  setIsLoading(true)
  bitsFetch(null, 'get_wordpress_taxonomies')
    .then(result => {
      if (result?.success) {
        setWordPressConf(prevConf =>
          create(prevConf, draftConf => {
            draftConf.allTaxonomies = result.data
          })
        )
        toast.success(__('Taxonomies refreshed', 'bit-integrations'))
      } else {
        toast.error(__('Failed to fetch taxonomies', 'bit-integrations'))
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}
