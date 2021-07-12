// TODO improve typing
export const getFormErrors = (error: any): any => {
  let customError: any = ''
  if (
    error.response &&
    error.response.data.error &&
    error.response.data.error === 'Invalid form'
  ) {
    for (const key in error.response.data.errors) {
      customError += `[${key}]: ${error.response.data.errors[key]}; `
    }
  } else if (error.response && error.response.data.errors === null)
    customError = error.response.data.error
  return customError
}
