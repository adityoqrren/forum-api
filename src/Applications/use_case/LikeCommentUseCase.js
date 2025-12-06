const PostCommentLike = require('../../Domains/comment_likes/entities/PostCommentLike');

class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository, commentLikeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(useCasePayload) {
    // check if thread is exists
    const { threadId, commentId, userId } = useCasePayload;
    // check if thread is exists
    await this._threadRepository.verifyThreadAvailability(threadId);
    // check if comment is exists
    await this._commentRepository.verifyCommentById(commentId);
    // check if comment is liked or not by user
    const likeId = await this._commentLikeRepository.getCommentLikeByCommentAndUserId({
      commentId, userId,
    });

    if (likeId === null) {
      // user has not liked comment. do like comment action
      const postCommentLike = new PostCommentLike({ commentId, userId });
      await this._commentLikeRepository.addCommentLike(postCommentLike);
      await this._commentRepository.increaseLikeCountById(commentId);
    } else {
      // user has liked comment. do unlike comment action
      await this._commentLikeRepository.deleteCommentLikeById(likeId);
      await this._commentRepository.decreaseLikeCountById(commentId);
    }
  }
}

module.exports = LikeCommentUseCase;
