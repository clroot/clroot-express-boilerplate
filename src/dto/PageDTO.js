/**
 * @swagger
 *  components:
 *    schemas:
 *      PageDTO:
 *        properties:
 *          content:
 *            type: array
 *            items:
 *              type: object
 *          pageable:
 *           type: object
 *           properties:
 *            pageNumber:
 *              type: int
 *              default: 1
 *            pageSize:
 *              type: int
 *              default: 30
 */
class PageDTO {
  /**
   * @constructor
   * @param {Object} payload
   * @param {PageRequestDTO} payload.pageRequestDTO
   * @param {Array} payload.content
   * @param {number} payload.totalElements
   */
  constructor({ pageRequestDTO, content, totalElements }) {
    this.content = content;
    this.pageable = {
      pageNumber: pageRequestDTO.page,
      pageSize: pageRequestDTO.size,
    };
    this.totalPages = Math.ceil(totalElements / pageRequestDTO.size);
    this.totalElements = totalElements;
    this.first = pageRequestDTO.page === 1;
    this.last = pageRequestDTO.page === this.totalPages;
  }
}

export default PageDTO;