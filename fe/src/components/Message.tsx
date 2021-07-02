import React from 'react'

interface IMessage {
  info?: string
  error?: string
}

const Message = ({ info, error }: IMessage) => {
  return info ? (
    <h2 className='message-info'>{info}</h2>
  ) : error ? (
    <h2 className='message-error'>{error}</h2>
  ) : (
    <h2>...</h2>
  )
}

export default Message
