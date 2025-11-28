const PostReply = require('../../Domains/replies/entities/PostReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId } = useCasePayload;
    // acheck if thread is exists
    await this._threadRepository.verifyThreadAvailability(threadId);
    // check if comment is exists
    await this._commentRepository.getCommentById(commentId);
    // post reply
    const postReply = new PostReply(useCasePayload);
    return this._replyRepository.addReply(postReply);
  }
}

module.exports = AddReplyUseCase;
