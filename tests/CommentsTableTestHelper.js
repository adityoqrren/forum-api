/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123', threadId = 'thread-1', owner = 'user-1', content = 'this is comment content', createdAt = new Date(),
  }) {
    const query = {
      text: 'INSERT INTO comments (id, thread_id, owner, content, created_at) VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, threadId, owner, content, createdAt],
    };

    await pool.query(query);
  },
  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE comments.id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },
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

  async increaseCommentLikeCount(id) {
    const query = {
      text: 'UPDATE comments SET like_count = like_count + 1 WHERE comments.id = $1 RETURNING like_count',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0].like_count;
  },

  async refreshCommentLikeCount(id) {
    const query = {
      text: 'UPDATE comments SET like_count = 0 WHERE comments.id = $1',
      values: [id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
