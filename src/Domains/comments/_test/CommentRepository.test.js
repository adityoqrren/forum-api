const CommentRepository = require('../CommentRepository');

describe('CommentRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action and Assert
    await expect(commentRepository.addComment({})).rejects.toThrow(Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(commentRepository.verifyCommentById('')).rejects.toThrow(Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(commentRepository.getCommentById('')).rejects.toThrow(Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(commentRepository.getCommentsByThreadId('')).rejects.toThrow(Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(commentRepository.deleteCommentById('')).rejects.toThrow(Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(commentRepository.increaseLikeCountById('')).rejects.toThrow(Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(commentRepository.decreaseLikeCountById('')).rejects.toThrow(Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
  });
});
