const CommentLikeRepository = require('../CommentLikeRepository');

describe('CommentLikeRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const commentLikeRepository = new CommentLikeRepository();

    // Action and Assert
    await expect(commentLikeRepository.addCommentLike({})).rejects.toThrow(Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(commentLikeRepository.getCommentLikeByCommentAndUserId('', '')).rejects.toThrow(Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(commentLikeRepository.deleteCommentLikeById('')).rejects.toThrow(Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
  });
});
