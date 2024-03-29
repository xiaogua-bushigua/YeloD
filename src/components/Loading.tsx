import React from 'react'
import LoadingIcon from './icons/LoadingIcon'

interface Props {
  size: number
}

const Loading = ({ size }: Props) => {
  return (
    <div className='w-full h-full flex items-center justify-center bg-violet-50'>
      <LoadingIcon size={size} />
    </div>
  )
}

export default Loading
