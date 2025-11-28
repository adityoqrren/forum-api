const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { replyId, owner } = useCasePayload;

    const reply = await this._replyRepository.getReplyById(replyId);

    if (reply.owner !== owner) {
      throw new AuthorizationError('You are not authorized to delete this reply');
    }

    await this._replyRepository.deleteReplyById(replyId);
  }
}

module.exports = DeleteReplyUseCase;
