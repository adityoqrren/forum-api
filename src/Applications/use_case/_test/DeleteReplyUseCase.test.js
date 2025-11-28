const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 'reply-1',
      owner: 'user-123',
    };
    const mockReplyById = new DetailReply({
      id: 'reply-1',
      comment_id: 'comment-1',
      owner: 'user-123',
      content: 'this is reply',
      created_at: new Date(),
    });

    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.getReplyById = jest.fn().mockImplementation(
      () => Promise.resolve(mockReplyById),
    );
    mockReplyRepository.deleteReplyById = jest.fn().mockResolvedValue();

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Act
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockReplyRepository.getReplyById).toHaveBeenCalledWith(useCasePayload.replyId);
    expect(mockReplyRepository.deleteReplyById).toHaveBeenCalledWith(useCasePayload.replyId);
    expect(mockReplyRepository.deleteReplyById).toHaveBeenCalledTimes(1);
  });

  it('should throw error when repository throws error', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 'reply-1',
      owner: 'user-123',
    };
    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.getReplyById = jest.fn().mockRejectedValue(new NotFoundError('reply not found'));

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Act & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload)).rejects.toThrow(new NotFoundError('reply not found'));
  });

  it('should throw error when user is not owner of reply', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 'reply-1',
      owner: 'user-123',
    };
    const mockReplyById = new DetailReply({
      id: 'reply-1',
      comment_id: 'comment-1',
      owner: 'user-234', // owner not match
      content: 'this is reply',
      created_at: new Date(),
    });

    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.getReplyById = jest.fn().mockImplementation(
      () => Promise.resolve(mockReplyById),
    );

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Act
    await expect(deleteReplyUseCase.execute(useCasePayload)).rejects.toThrow(new AuthorizationError('You are not authorized to delete this reply'));

    // Assert
    expect(mockReplyRepository.getReplyById).toHaveBeenCalledWith(useCasePayload.replyId);
  });
});
