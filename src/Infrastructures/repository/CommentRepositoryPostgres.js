const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const DetailComment = require('../../Domains/comments/entities/DetailComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(postComment) {
    const { threadId, content, owner } = postComment;
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date();

    const query = {
      text: 'INSERT INTO comments (id, thread_id, owner, content, created_at) VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, threadId, owner, content, createdAt],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async verifyCommentById(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE comments.id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment not found');
    }
  }

  async getCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE comments.id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment not found');
    }

    const row = result.rows[0];

    return new DetailComment({ ...row });
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id AS id, users.username AS username, created_at AS date, content, deleted_at, like_count FROM comments 
      INNER JOIN users ON comments.owner = users.id
      WHERE thread_id = $1 ORDER BY created_at ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    const comments = result.rows;

    return comments;
  }

  async deleteCommentById(id) {
    const deletedAt = new Date();
    const query = {
      text: 'UPDATE comments SET deleted_at = $1 WHERE comments.id = $2',
      values: [deletedAt, id],
    };

    await this._pool.query(query);
  }

  async addCommentLike(postCommentLike) {
    const { commentId, userId } = postCommentLike;
    const id = `commentlike-${this._idGenerator()}`;
    const createdAt = new Date();

    const query = {
      text: 'INSERT INTO comment_likes (id, comment_id, user_id, created_at) VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, commentId, userId, createdAt],
    };

    const result = await this._pool.query(query);

    return result.rows[0].id;
  }

  async getCommentLikeByCommentAndUserId({ commentId, userId }) {
    const query = {
      text: 'SELECT id FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return null;
    }
    const row = result.rows[0];

    return row.id;
  }

  async deleteCommentLikeById(id) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async increaseLikeCountById(id) {
    const query = {
      text: 'UPDATE comments SET like_count = like_count + 1 WHERE comments.id = $1 RETURNING like_count',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows[0].like_count;
  }

  async decreaseLikeCountById(id) {
    const query = {
      text: 'UPDATE comments SET like_count = like_count - 1 WHERE comments.id = $1 RETURNING like_count',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows[0].like_count;
  }
}

module.exports = CommentRepositoryPostgres;
