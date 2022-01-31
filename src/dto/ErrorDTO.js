/**
 * @swagger
 *  components:
 *    schemas:
 *      ErrorDTO:
 *        properties:
 *          error:
 *            type: string
 *          message:
 *            type: string
 *          method:
 *            type: string
 *          url:
 *            type: string
 */
class ErrorDTO {
  /**
   * @param {Object} payload
   * @param {Error} payload.error
   * @param {import('express').Request} payload.req
   */
  constructor({ error, req }) {
    this.error = error.name;
    this.message = error.message;
    this.method = req.method;
    this.url = req.url;
  }
}

export default ErrorDTO;