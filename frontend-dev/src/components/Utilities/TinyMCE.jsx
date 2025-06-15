/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import { __ } from '../../Utils/i18nwrap'
import { useEffect, useState } from 'react'
import '../../resource/css/tinymce.css'

export default function TinyMCE({
  id,
  value,
  formFields,
  SmartTagField,
  onChangeHandler,
  toolbarMnu,
  menubar,
  height,
  width,
  disabled,
  plugins,
  show = true
}) {
  const editorId = `${id}-settings`

  useEffect(() => {
    if (!show && window?.tinymce?.get(editorId)) {
      window.tinymce.get(editorId).remove();
    } else if (typeof tinymce !== 'undefined') {
      timyMceInit()
    } else {
      console.warn('TinyMCE is not loaded yet')
    }
  }, [show])

  const insertFieldKey = (fld) => {
    if (fld.type === 'signature') {
      return `<img width="250" src="\${${fld.name}}" alt="${fld.name}" />`
    }
    return `\${${fld.name}}`
  }

  const timyMceInit = () => {
    if (window && window.tinymce) {
      window.tinymce.init({
        selector: `textarea#${editorId}`,
        charset: 'UTF-8',
        entity_encoding: 'raw',
        menubar,
        height: height || 150,
        width: width || '100%',
        branding: false,
        resize: 'verticle',
        convert_urls: false,
        theme: 'modern',
        plugins:
          plugins ||
          `directionality fullscreen image link media charmap hr lists textcolor colorpicker wordpress`,
        toolbar:
          toolbarMnu ||
          'formatselect | fontsizeselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat toogleCode wp_code | addFormField | addSmartField',
        image_advtab: true,
        default_link_target: '_blank',
        setup(editor) {
          editor.on('Paste Change input Undo Redo', () => {
            onChangeHandler(editor.getContent())
          })
          formFields &&
            editor.addButton('addFormField', {
              text: 'Form Fields ',
              tooltip: 'Add Form Field Value in Message',
              type: 'menubutton',
              icon: false,
              menu: formFields?.map(
                (i) =>
                  !i.type.match(/^(file-up|recaptcha|section|divider|image|advanced-file-up|)$/) && {
                    text: i.name,
                    onClick() {
                      editor.insertContent(insertFieldKey(i))
                    }
                  }
              )
            })
          SmartTagField &&
            editor.addButton('addSmartField', {
              text: 'Smart Tag Fields',
              tooltip: 'Add Smart Tag Field Value in Message',
              type: 'menubutton',
              icon: false,
              menu: SmartTagField?.map((i) => ({
                text: i.label,
                onClick() {
                  editor.insertContent(`\${${i.name}}`)
                }
              }))
            })
          editor.addButton('toogleCode', {
            text: '</>',
            tooltip: 'Toggle preview',
            icon: false,
            onclick(e) {
              const { $ } = e.control
              const myTextarea = $(`#${editorId}`)
              const myIframe = $(editor.iframeElement)
              myTextarea.value = editor.getContent({ source_view: true })
              myIframe.toggleClass('btcd-mce-tinymce-hidden')
              myTextarea.toggleClass('btcd-mce-tinymce-visible')
              console.log('clicked', myTextarea, myIframe)
              if ($('iframe.btcd-mce-tinymce-hidden').length > 0) {
                myTextarea.prependTo('.mce-edit-area')
              } else {
                const el = document.getElementById(editorId)
                if (el instanceof HTMLTextAreaElement) {
                  editor.setContent(el.value)
                }
              }
            }
          })
        }
      })
    }
  }

  return show && <textarea
    id={editorId}
    className="btcd-paper-inp mt-1 w-10"
    rows={5}
    value={value}
    onChange={(ev) => onChangeHandler(ev.target.value)}
    style={{ width: '95.5%', height: 'auto' }}
    disabled={disabled}
  />
}
