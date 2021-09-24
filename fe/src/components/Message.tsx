import React from 'react'

interface IMessage {
  info?: string
  error?: string
}

const Message = ({ info, error }: IMessage) => {
  return info ? (
    <h2 className='message-info u-my-s u-txt-center'>{info}</h2>
  ) : (
    <h2 className='message-error u-my-s u-txt-center'>{error}</h2>
  )
}

export default Message
