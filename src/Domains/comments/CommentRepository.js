class CommentRepository {
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  async addComment(postComment) {
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
}

module.exports = CommentRepository;
