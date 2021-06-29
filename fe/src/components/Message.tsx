import React from 'react'

interface IMessage {
  error: string
}

const Message = ({ error }: IMessage) => {
  return <h2 className='message-error'>{error}</h2>
}

export default Message
