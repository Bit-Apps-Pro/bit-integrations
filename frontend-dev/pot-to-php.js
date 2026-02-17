#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */

// This file is from wp-i18n tools

/**
 * External dependencies
 */
const gettextParser = require('gettext-parser')
const { isEmpty } = require('lodash')
const fs = require('fs')

const TAB = '    '
const NEWLINE = '\n'
const args = process.argv.slice(2)
const fileHeader =
  [
    '<?php',
    "if(!defined('ABSPATH')) exit;",
    '/* THIS IS A GENERATED FILE. DO NOT EDIT DIRECTLY. */',
    '$btcbi_i18n_strings = array('
  ].join(NEWLINE) + NEWLINE

const fileFooter =
  NEWLINE + [');', '/* THIS IS THE END OF THE GENERATED FILE */'].join(NEWLINE) + NEWLINE

const PLACEHOLDER_REGEX = /%(\d+\$)?[sdfeEgGoxXbcu]/g

/**
 * Builds a "translators:" PHP comment for strings containing placeholders.
 * Uses the extracted comment from the POT file if available, otherwise auto-generates one.
 *
 * @param {object} translation The translation object from gettext-parser.
 * @return {string} A PHP comment line with leading TAB indent, or empty string if no placeholders.
 */
function buildTranslatorsComment(translation) {
  const extracted = (translation.comments && translation.comments.extracted) || ''
  if (extracted.toLowerCase().includes('translators:')) {
    return `${TAB}/* ${extracted.trim()} */${NEWLINE}`
  }

  const numbered = numberPlaceholders(translation.msgid)
  const placeholders = numbered.match(PLACEHOLDER_REGEX)
  if (!placeholders) return ''

  if (placeholders.length === 1) {
    return `${TAB}/* translators: ${placeholders[0]}: placeholder */${NEWLINE}`
  }

  const description = placeholders.map((p, i) => `${i + 1}: ${p} placeholder`).join(' ')
  return `${TAB}/* translators: ${description} */${NEWLINE}`
}

/**
 * Numbers unordered printf placeholders when a string contains more than one.
 * Converts e.g. "%s ... %s" to "%1$s ... %2$s". Already-numbered placeholders
 * (like %1$s) are left untouched.
 *
 * @param {string} input The string to process.
 * @return {string} The string with numbered placeholders, or unchanged if 0-1 placeholders.
 */
function numberPlaceholders(input) {
  const matches = input.match(PLACEHOLDER_REGEX)
  if (!matches || matches.length <= 1) return input

  const hasUnordered = matches.some(m => !/^\%\d+\$/.test(m))
  if (!hasUnordered) return input

  let counter = 0
  return input.replace(PLACEHOLDER_REGEX, match => {
    if (/^\%\d+\$/.test(match)) return match
    counter++
    const specifier = match.slice(1)
    return `%${counter}$${specifier}`
  })
}

/**
 * Escapes single quotes.
 *
 * @param {string} input The string to be escaped.
 * @return {string} The escaped string.
 */
function escapeSingleQuotes(input) {
  return input.replace(/'/g, "\\'")
}

/**
 * Converts a translation parsed from the POT file to lines of WP PHP.
 *
 * @param {Object} translation The translation to convert.
 * @param {string} textdomain The text domain to use in the WordPress translation function call.
 * @param {string} context The context for the translation.
 * @return {string} Lines of PHP that match the translation.
 */
function convertTranslationToPHP(translation, textdomain, context = '') {
  let php = ''

  // The format of gettext-js matches the terminology in gettext itself.
  let original = translation.msgid

  if (original !== '') {
    const translatorsComment = buildTranslatorsComment(translation)
    original = escapeSingleQuotes(original)
    const ordered = escapeSingleQuotes(numberPlaceholders(translation.msgid))

    if (isEmpty(translation.msgid_plural)) {
      php += translatorsComment
      if (isEmpty(context)) {
        php += `${TAB}'${original}' => __('${ordered}', '${textdomain}')`
      } else {
        php += `${TAB}'${original}' => _x('${ordered}', '${translation.msgctxt}', '${textdomain}')`
      }
    } else {
      const plural = escapeSingleQuotes(translation.msgid_plural)
      const orderedPlural = escapeSingleQuotes(numberPlaceholders(translation.msgid_plural))

      php += translatorsComment
      if (isEmpty(context)) {
        php += `${TAB}'${original}' => _n_noop('${ordered}', '${orderedPlural}', '${textdomain}')`
      } else {
        php += `${TAB}'${original}' => _nx_noop('${ordered}',  '${orderedPlural}', '${translation.msgctxt}', '${textdomain}')`
      }
    }
  }

  return php
}

function convertPOTToPHP(potFile, phpFile, options) {
  const poContents = fs.readFileSync(potFile)
  const parsedPO = gettextParser.po.parse(poContents)

  let output = []

  for (const context of Object.keys(parsedPO.translations)) {
    const translations = parsedPO.translations[context]

    const newOutput = Object.values(translations)
      .map(translation => convertTranslationToPHP(translation, options.textdomain, context))
      .filter(php => php !== '')

    output = [...output, ...newOutput]
  }

  const fileOutput = fileHeader + output.join(`,${NEWLINE}${NEWLINE}`) + fileFooter

  fs.writeFileSync(phpFile, fileOutput)
}

convertPOTToPHP(args[0], args[1], {
  textdomain: args[2]
})
