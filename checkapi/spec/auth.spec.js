'use strict'

const sut = require('../controllers/auth')
const httpMock = require('node-mocks-http')

describe('auth controller', () => {
  describe('POST /auth', () => {
    it('should return 200 OK when valid request', () => {
      const req = httpMock.createRequest({
        method: 'POST',
        url: '/auth'
      })
      const res = httpMock.createResponse()
      sut.auth(req, res)
      expect(res.statusCode).toBe(200)
    })
  })
})