const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-1',
      owner: 'user-123',
    };
    const mockCommentById = new DetailComment({
      id: 'comment-1',
      thread_id: 'thread-1',
      owner: 'user-123',
      content: 'this is comment',
      created_at: new Date(),
    });

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getCommentById = jest.fn().mockImplementation(
      () => Promise.resolve(mockCommentById),
    );
    mockCommentRepository.deleteCommentById = jest.fn().mockResolvedValue();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Act
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.deleteCommentById).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.deleteCommentById).toHaveBeenCalledTimes(1);
  });

  it('should throw error when repository throws error', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-1',
      owner: 'user-123',
    };
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getCommentById = jest.fn().mockRejectedValue(new NotFoundError('comment not found'));

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Act & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload)).rejects.toThrow(new NotFoundError('comment not found'));
  });

  it('should throw error when user is not owner of comment', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-1',
      owner: 'user-123',
    };
    const mockCommentById = new DetailComment({
      id: 'comment-1',
      thread_id: 'thread-1',
      owner: 'user-234', // owner not match
      content: 'this is comment',
      created_at: new Date(),
    });

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getCommentById = jest.fn().mockImplementation(
      () => Promise.resolve(mockCommentById),
    );

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Act
    await expect(deleteCommentUseCase.execute(useCasePayload)).rejects.toThrow(new AuthorizationError('You are not authorized to delete this comment'));
    // Assert
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith(useCasePayload.commentId);
  });
});
