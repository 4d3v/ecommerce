import React from 'react'

interface IProps {
  type: string
  msg: string
}

const Alert = ({ type, msg }: IProps) => {
  return <div className={`alert alert__${type}`}>{msg}</div>
}

export default Alert
