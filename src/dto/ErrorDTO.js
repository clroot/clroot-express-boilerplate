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
 *          url:
 *            type: string
 */
class ErrorDTO {
  /**
   * @param {Object} payload
   * @param {Error} payload.error
   * @param {string} payload.url
   */
  constructor({ error, url }) {
    this.error = error.name;
    this.message = error.message;
    this.url = url;
  }
}

export default ErrorDTO;