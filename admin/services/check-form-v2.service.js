const csv = require('fast-csv')

const checkFormV2DataService = require('./data-access/check-form-v2.data.service')
const checkFormsValidator = require('../lib/validator/check-form/check-forms-validator')
const checkFormV2Service = {}

/**
 * Validates and submits check form file(s)
 * @param uploadData
 * @param requestData
 */
checkFormV2Service.processData = async (uploadData, requestData) => {
  // If single file is being attempted only convert it to an array for consistency
  const uploadedFiles = Array.isArray(uploadData) ? uploadData : [uploadData]
  const existingCheckForms = await checkFormV2DataService.sqlFindAllCheckForms()
  const validationError = await checkFormsValidator.validate(uploadedFiles, requestData, existingCheckForms)
  if (validationError.hasError()) {
    throw validationError
  }
  const checkFormData = await checkFormV2Service.prepareData(uploadedFiles, requestData)
  return checkFormV2DataService.sqlInsertCheckForms(checkFormData)
}

/**
 * Prepares data for submission to the db
 * @param uploadedFiles
 * @param requestData
 * @returns checkFormData
 */
checkFormV2Service.prepareData = async (uploadedFiles, requestData) => {
  const { checkFormType } = requestData
  return Promise.all(uploadedFiles.map(async uploadedFile => {
    const singleFormData = []
    const checkForm = {}
    return new Promise((resolve, reject) => {
      csv.fromPath(uploadedFile.file, { headers: false, trim: true })
        .on('data', function (row) {
          const question = {}
          question.f1 = parseInt(row[0], 10)
          question.f2 = parseInt(row[1], 10)
          singleFormData.push(question)
        })
        .on('end', function () {
          checkForm.name = uploadedFile.filename.replace(/\.[^/.]+$/, '')
          checkForm.formData = JSON.stringify(singleFormData)
          checkForm.isLiveCheckForm = checkFormType === 'L' ? 1 : 0
          resolve(checkForm)
        })
        .on('error', error => reject(error))
    })
  }))
}

module.exports = checkFormV2Service
