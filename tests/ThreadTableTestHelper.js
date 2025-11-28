/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadTableTestHelper = {
  async addThread({
    id = 'thread-123', title = 'this is thread title', body = 'this is body title', owner = 'user-123', createdAt = new Date(), updatedAt = createdAt,
  }) {
    const query = {
      text: 'INSERT INTO threads (id, title, body, owner, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, title, owner',
      values: [id, title, body, owner, createdAt, updatedAt],
    };

    await pool.query(query);
  },

  async findThreadById(id) {
    const query = {
      text: 'SELECT threads.id AS id, title, body, threads.created_at AS date, username FROM threads INNER JOIN users ON threads.owner = users.id WHERE threads.id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadTableTestHelper;
