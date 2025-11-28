/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123', commentId = 'comment-1', owner = 'user-1', content = 'this is reply content', createdAt = new Date(),
  }) {
    const query = {
      text: 'INSERT INTO replies (id, comment_id, owner, content, created_at) VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, commentId, owner, content, createdAt],
    };

    await pool.query(query);
  },
  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE replies.id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
