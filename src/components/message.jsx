// import React from 'react'
// import { App } from 'antd'

// const Toastify = (text, type = 'info') => {
//   const { message } = App.useApp()

//   switch (type) {
//     case 'success':
//       message.success(text)
//       break
//     case 'error':
//       message.error(text)
//       break
//     case 'warning':
//       message.warning(text)
//       break
//     default:
//       message.info(text)
//   }

//   return (
//     <>
    
//     </>
//   )
// }

// export default Toastify
// ✅ Toastify.jsx
import { message } from 'antd'

const Toastify = (text, type = 'info') => {
  switch (type) {
    case 'success':
      message.success(text)
      break
    case 'error':
      message.error(text)
      break
    case 'warning':
      message.warning(text)
      break
    default:
      message.info(text)
  }
}

export default Toastify
