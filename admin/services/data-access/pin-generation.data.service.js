'use strict'

const { TYPES } = require('tedious')
const sqlService = require('./sql.service')
const monitor = require('../../helpers/monitor')
const config = require('../../config')

const serviceToExport = {
  sqlFindEligiblePupilsBySchool: async (schoolId) => {
    const sql = `SELECT * FROM ${sqlService.adminSchema}.vewPupilsEligibleForPinGeneration
     WHERE school_id=@schoolId AND checkCount < @maxRestartsAllowed`
    const params = [
      {
        name: 'schoolId',
        value: schoolId,
        type: TYPES.Int
      },
      {
        name: 'maxRestartsAllowed',
        value: config.RESTART_MAX_ATTEMPTS,
        type: TYPES.Int
      }
    ]
    return sqlService.query(sql, params)
  }
}

module.exports = monitor('pin-generation.data.service', serviceToExport)
