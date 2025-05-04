import React from 'react'
import style from "../../util/style"
import { useDispatch } from 'react-redux'
import { Category } from '..'
const Main = () => {
  return (
    <div className={`${style.container} py-3`}>
        <Category />
    </div>
  )
}

export default Main