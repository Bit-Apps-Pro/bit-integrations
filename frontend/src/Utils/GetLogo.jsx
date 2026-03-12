import React, { useEffect, useState } from 'react'
import Loader from '../components/Loaders/Loader'
import PlaceholderIcon from '../Icons/PlaceholderIcon'

function GetLogo({ name, style, extension }) {
  /**TODO: Fix the fluentCRM name in trigger or action */
  const logo = name === 'FluentCrm' ? 'fluentCRM' : camelize(name) // Temporary solution
  const dynamicModule = import(`../resource/img/integ/${logo}.${extension}`)
  const [Component, setComponent] = useState(null)
  useEffect(() => {
    dynamicModule.then(module => {
      setComponent(() => module.default)
    })
  }, [name])

  const loaderStyle = {
    display: 'flex',
    height: '85%',
    justifyContent: 'center',
    alignItems: 'center'
  }

  return Component ? (
    <img loading="lazy" src={Component} alt={`${logo}-logo`} style={style} />
  ) : (
    <PlaceholderIcon size={100} text={name} />
  )
}

function camelize(name) {
  return name
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, '')
}

export default GetLogo
