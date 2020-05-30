import React from 'react'

export const LinkCard = ({link}) => {
  return (
    <>
      <h2>Link</h2>
  <p>You link: <a href={link.to} target="_blank" rel="noopener noreferrer">{link.to}</a></p>
  <p>From link: <a href={link.from} target="_blank" rel="noopener noreferrer">{link.from}</a></p>
  <p>Clicks: <strong>{link.clicks}</strong></p>
  <p>Date: <strong>{new Date(link.date).toLocaleDateString()}</strong></p>
    </>
  )
}