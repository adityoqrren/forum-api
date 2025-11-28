const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { commentId, owner } = useCasePayload;

    const comment = await this._commentRepository.getCommentById(commentId);

    if (comment.owner !== owner) {
      throw new AuthorizationError('You are not authorized to delete this comment');
    }

    await this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
