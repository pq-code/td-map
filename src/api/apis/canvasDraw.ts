import { http } from '../index'

export const getSketchpadList = (params) => {
  return http.post('api/canvas/getSketchpadList', params)
}

export const getFileInfo = (params) => {
  return http.post('api/canvas/getFileInfo', params)
}

export const editCanvas = (params) => {
  return http.post('api/canvas/editCanvas', params)
}

export const editCanvasUpload = (params) => {
  const formData = new window.FormData()
  if (params.files) {
    const file = params.files
    const options = { type: 'image/png' }
    const fileOfBlob = new File([file], new Date().getTime() + '.png', options)
    formData.append('file', fileOfBlob)
    return new Promise((resolve, reject) => {
      http.post('api/canvas/upload', formData).then((res) => {
        let { file_content_thumbnail } = params
        const { user_id, file_id, file_content } = params
        file_content_thumbnail = res.result.img_name
        resolve(
          http.post('api/canvas/editCanvas', {
            user_id,
            file_id,
            file_content_thumbnail,
            file_content
          })
        )
        reject(res)
      })
    })
  }
}

export const newFile = (params) => {
  return http.post('api/canvas/newFile', params)
}

export const getCanvasDetails = (params) => {
  return http.post('api/canvas/getCanvasDetails', params)
}

export const deleteCanvas = (params) => {
  return http.post('api/canvas/deleteCanvas', params)
}
