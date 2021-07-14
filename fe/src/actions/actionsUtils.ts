// TODO improve typing
export const getFormErrors = (error: any): any => {
  let customError: any = ''
  if (
    error.response &&
    error.response.data.error &&
    error.response.data.error === 'Invalid form'
  ) {
    for (const key in error.response.data.errors) {
      for (const err of error.response.data.errors[key]) {
        customError += `[${key}]: ${err}; `
      }
    }
  } else if (error.response && error.response.data.errors === null)
    customError = error.response.data.error
  return customError
}
