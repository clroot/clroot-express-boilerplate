import { InvalidArgumentsException } from '/exception';

/**
 * @swagger
 *  components:
 *    schemas:
 *      PageRequestDTO:
 *        properties:
 *          page:
 *            type: int
 *            default: 1
 *            description: request page number
 *          size:
 *            type: int
 *            default: 30
 *            description: item count per page
 */
class PageRequestDTO {
  /**
   * @private
   * @param {number} page
   * @param {number} size
   */
  constructor(page, size) {
    /** @type {number} */
    this.page = page;
    /** @type {number} */
    this.size = size;
  }

  /**
   * @param {Object} payload
   * @param {number=1} payload.page
   * @param {number=30} payload.size
   * @return {PageRequestDTO}
   */
  static of({ page = 1, size = 30 }) {
    try {
      page = parseInt(page);
      size = parseInt(size);
    } catch (err) {
      throw new InvalidArgumentsException('잘못된 페이징 요청입니다.');
    }
    return new PageRequestDTO(page, size);
  }

  /**
   * generate sequelize pagination options
   * @return {{offset: number, limit: number}}
   */
  toQuery() {
    const offset = this.size * (this.page - 1);

    return {
      offset,
      limit: this.size,
    };
  }
}

export default PageRequestDTO;