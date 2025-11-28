const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const DetailReply = require('../../Domains/replies/entities/DetailReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(postReply) {
    const { commentId, content, owner } = postReply;
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date();

    const query = {
      text: 'INSERT INTO replies (id, comment_id, owner, content, created_at) VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, commentId, owner, content, createdAt],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async getReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE replies.id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply not found');
    }

    const row = result.rows[0];

    return new DetailReply({ ...row });
  }

  async getRepliesByThreadId(threadId) {
    const query = {
      text: `SELECT replies.id AS id, replies.comment_id AS comment_id, users.username AS username, replies.created_at AS created_at, replies.content AS content, replies.deleted_at AS deleted_at FROM replies 
            INNER JOIN comments ON replies.comment_id = comments.id
            INNER JOIN users ON replies.owner = users.id 
            WHERE comments.thread_id = $1
            ORDER BY replies.created_at ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    const replies = result.rows;

    return replies;
  }

  async deleteReplyById(id) {
    const deletedAt = new Date();
    const query = {
      text: 'UPDATE replies SET deleted_at = $1 WHERE replies.id = $2',
      values: [deletedAt, id],
    };

    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
