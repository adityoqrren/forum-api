const PostComment = require('../../Domains/comments/entities/PostComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    // check if thread is exists
    const { threadId } = useCasePayload;
    await this._threadRepository.verifyThreadAvailability(threadId);
    // post comment
    const postComment = new PostComment(useCasePayload);
    return this._commentRepository.addComment(postComment);
  }
}

module.exports = AddCommentUseCase;
