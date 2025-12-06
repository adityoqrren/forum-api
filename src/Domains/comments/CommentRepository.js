class CommentRepository {
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  async addComment(postComment) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  async verifyCommentById(id) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  async getCommentById(id) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  async getCommentsByThreadId(threadId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  async deleteCommentById(id) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  async addCommentLike(postCommentLike) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  async getCommentLikeByCommentAndUserId(id) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  async deleteCommentLikeById(id) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  async increaseLikeCountById(id) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  async decreaseLikeCountById(id) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = CommentRepository;
