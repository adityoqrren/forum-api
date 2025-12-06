const PostCommentLike = require('../../Domains/comments/entities/PostCommentLike');

class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    // check if thread is exists
    const { threadId, commentId, userId } = useCasePayload;
    // check if thread is exists
    await this._threadRepository.verifyThreadAvailability(threadId);
    // check if comment is exists
    await this._commentRepository.verifyCommentById(commentId);
    // check if comment is liked or not by user
    const likeId = await this._commentRepository.getCommentLikeByCommentAndUserId({
      commentId, userId,
    });

    if (likeId === null) {
      // user has not liked comment. do like comment action
      const postCommentLike = new PostCommentLike({ commentId, userId });
      await this._commentRepository.addCommentLike(postCommentLike);
      await this._commentRepository.increaseLikeCountById(commentId);
    } else {
      // user has liked comment. do unlike comment action
      await this._commentRepository.deleteCommentLikeById(likeId);
      await this._commentRepository.decreaseLikeCountById(commentId);
    }
  }
}

module.exports = LikeCommentUseCase;
