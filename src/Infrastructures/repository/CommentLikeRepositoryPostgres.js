const CommentLikeRepository = require('../../Domains/comment_likes/CommentLikeRepository');

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
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
}

module.exports = CommentLikeRepositoryPostgres;
