<?php

$finder = PhpCsFixer\Finder::create()
    ->exclude([
        __DIR__ . '/vendor',
    ])
    ->in([
        __DIR__ . '/includes',
        __DIR__ . '/views',
    ])
    ->ignoreVCSIgnored(true);

$config = new PhpCsFixer\Config();

return $config
    ->setRiskyAllowed(true)
    ->setIndent(str_pad('', 4))
    ->setRules([
        '@PSR2'                   => true,
        'align_multiline_comment' => ['comment_type' => 'phpdocs_like'],
        'array_indentation'       => true,
        'array_push'              => true,
        'array_syntax'            => true,
        'binary_operator_spaces'  => [
            'operators' => [
                '=>' => 'align_single_space_minimal',
                // '='  => 'align_single_space_minimal',
            ],
        ],
        'method_argument_space' => [
            'on_multiline'                     => 'ensure_fully_multiline',
            'keep_multiple_spaces_after_comma' => false,
        ],
        'blank_line_after_namespace'                    => true,
        'blank_line_after_opening_tag'                  => true,
        'blank_line_before_statement'                   => true,
        'blank_line_between_import_groups'              => true,
        'braces'                                        => ['allow_single_line_anonymous_class_with_empty_body' => true],
        'cast_spaces'                                   => true,
        'class_attributes_separation'                   => true,
        'class_definition'                              => true,
        'class_reference_name_casing'                   => true,
        'clean_namespace'                               => true,
        'combine_consecutive_issets'                    => true,
        'combine_consecutive_unsets'                    => true,
        'comment_to_phpdoc'                             => true,
        'concat_space'                                  => ['spacing' => 'one'],
        'constant_case'                                 => true,
        'control_structure_braces'                      => true,
        'control_structure_continuation_position'       => true,
        'curly_braces_position'                         => true,
        'dir_constant'                                  => true,
        'elseif'                                        => true,
        'empty_loop_body'                               => true,
        'empty_loop_condition'                          => true,
        'encoding'                                      => true,
        'ereg_to_preg'                                  => true,
        'explicit_indirect_variable'                    => true,
        'explicit_string_variable'                      => true,
        'function_declaration'                          => true,
        'function_to_constant'                          => true,
        'global_namespace_import'                       => ['import_constants' => false, 'import_functions' => false, 'import_classes' => true],
        'group_import'                                  => false,
        'include'                                       => true,
        'indentation_type'                              => true,
        'integer_literal_case'                          => true,
        'line_ending'                                   => true,
        'linebreak_after_opening_tag'                   => true,
        'lowercase_cast'                                => true,
        'lowercase_keywords'                            => true,
        'lowercase_static_reference'                    => true,
        'magic_constant_casing'                         => true,
        'magic_method_casing'                           => true,
        'method_chaining_indentation'                   => true,
        'visibility_required'                           => true,
        'whitespace_after_comma_in_array'               => true,
        'space_after_semicolon'                         => true,
        'trim_array_spaces'                             => true,
        'multiline_comment_opening_closing'             => true,
        'multiline_whitespace_before_semicolons'        => false,
        'no_whitespace_before_comma_in_array'           => true,
        'native_function_casing'                        => true,
        'native_function_invocation'                    => ['include' => ['@compiler_optimized'], 'scope' => 'namespaced', 'strict' => false],
        'new_with_braces'                               => true,
        'no_alias_language_construct_call'              => true,
        'no_alternative_syntax'                         => true,
        'no_binary_string'                              => true,
        'no_blank_lines_after_class_opening'            => true,
        'no_blank_lines_after_phpdoc'                   => true,
        'no_break_comment'                              => true,
        'no_closing_tag'                                => true,
        'no_empty_phpdoc'                               => true,
        'no_empty_statement'                            => true,
        'no_extra_blank_lines'                          => true,
        'no_leading_import_slash'                       => true,
        'no_leading_namespace_whitespace'               => true,
        'no_multiple_statements_per_line'               => true,
        'no_null_property_initialization'               => true,
        'no_short_bool_cast'                            => true,
        'no_singleline_whitespace_before_semicolons'    => true,
        'no_space_around_double_colon'                  => true,
        'no_spaces_after_function_name'                 => true,
        'no_spaces_around_offset'                       => true,
        'no_trailing_comma_in_singleline'               => true,
        'no_trailing_whitespace'                        => true,
        'no_trailing_whitespace_in_comment'             => true,
        'no_unneeded_control_parentheses'               => true,
        'no_unneeded_curly_braces'                      => true,
        'no_unneeded_import_alias'                      => true,
        'no_unused_imports'                             => true,
        'no_useless_else'                               => true,
        'no_useless_return'                             => true,
        'no_whitespace_in_blank_line'                   => true,
        'no_spaces_inside_parenthesis'                  => true,
        'object_operator_without_whitespace'            => true,
        'operator_linebreak'                            => true,
        'ordered_class_elements'                        => true,
        'ordered_imports'                               => true,
        'php_unit_internal_class'                       => true,
        'php_unit_method_casing'                        => true,
        'php_unit_test_class_requires_covers'           => true,
        'phpdoc_add_missing_param_annotation'           => true,
        'phpdoc_align'                                  => true,
        'phpdoc_indent'                                 => true,
        'phpdoc_line_span'                              => true,
        'phpdoc_no_package'                             => true,
        'phpdoc_no_useless_inheritdoc'                  => true,
        'phpdoc_order'                                  => true,
        'phpdoc_return_self_reference'                  => true,
        'phpdoc_scalar'                                 => true,
        'phpdoc_separation'                             => true,
        'phpdoc_tag_casing'                             => true,
        'phpdoc_tag_type'                               => true,
        'phpdoc_trim'                                   => true,
        'phpdoc_trim_consecutive_blank_line_separation' => true,
        'phpdoc_types'                                  => true,
        'random_api_migration'                          => true,
        'return_assignment'                             => true,
        'simplified_if_return'                          => true,
        'simplified_null_return'                        => true,
        'single_blank_line_at_eof'                      => true,
        'single_blank_line_before_namespace'            => true,
        'single_class_element_per_statement'            => true,
        'single_line_after_imports'                     => true,
        'single_line_comment_spacing'                   => true,
        'single_line_comment_style'                     => true,
        'single_line_throw'                             => true,
        'single_quote'                                  => true,
        'single_space_after_construct'                  => true,
        'standardize_increment'                         => true,
        'standardize_not_equals'                        => true,
        'statement_indentation'                         => true,
        'switch_continue_to_break'                      => true,
        'ternary_operator_spaces'                       => true,
    ])
    ->setFinder($finder);
