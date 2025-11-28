const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const DetailThreadRow = require('../../Domains/threads/entities/DetailThreadRow');
const ThreadRepository = require('../../Domains/threads/ThreadRepostiory');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(postThread) {
    const { title, body, owner } = postThread;
    const id = `thread-${this._idGenerator()}`;
    const createdAt = new Date();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO threads (id, title, body, owner, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, title, owner',
      values: [id, title, body, owner, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async verifyThreadAvailability(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE threads.id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread not found');
    }
  }

  async getThreadById(id) {
    const query = {
      text: 'SELECT threads.id AS id, title, body, threads.created_at AS date, username FROM threads INNER JOIN users ON threads.owner = users.id WHERE threads.id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread not found');
    }

    const row = result.rows[0];

    return new DetailThreadRow({ ...row });
  }
}

module.exports = ThreadRepositoryPostgres;
