/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentLikesTableTestHelper = {
  async addCommentLike({
    id = 'commentlike-123', commentId, userId, createdAt = new Date(),
  }) {
    const query = {
      text: 'INSERT INTO comment_likes (id, comment_id, user_id, created_at) VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, commentId, userId, createdAt],
    };

    await pool.query(query);
  },

  async findCommentLikeById(id) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  // async addLikeThread(){

  // }

  async cleanTable() {
    await pool.query('DELETE FROM comment_likes WHERE 1=1');
  },
};

module.exports = CommentLikesTableTestHelper;
