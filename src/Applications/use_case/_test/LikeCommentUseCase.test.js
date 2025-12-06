const CommentRepository = require('../../../Domains/comments/CommentRepository');
const PostCommentLike = require('../../../Domains/comment_likes/entities/PostCommentLike');
const ThreadRepository = require('../../../Domains/threads/ThreadRepostiory');
const LikeCommentUseCase = require('../LikeCommentUseCase');
const CommentLikeRepository = require('../../../Domains/comment_likes/CommentLikeRepository');

describe('LikeCommentUseCase', () => {
  it('should orchestrating the like comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-1',
      commentId: 'comment-1',
      userId: 'user-1',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.getCommentLikeByCommentAndUserId = jest.fn()
      .mockImplementation(() => Promise.resolve(null));
    mockCommentLikeRepository.addCommentLike = jest.fn().mockResolvedValue();
    mockCommentRepository.increaseLikeCountById = jest.fn().mockResolvedValue();
    mockCommentLikeRepository.deleteCommentLikeById = jest.fn().mockResolvedValue();
    mockCommentRepository.decreaseLikeCountById = jest.fn().mockResolvedValue();

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentById)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentLikeRepository.getCommentLikeByCommentAndUserId)
      .toHaveBeenCalledWith({
        commentId: useCasePayload.commentId,
        userId: useCasePayload.userId,
      });
    expect(mockCommentLikeRepository.addCommentLike)
      .toHaveBeenCalledWith(new PostCommentLike({
        commentId: useCasePayload.commentId,
        userId: useCasePayload.userId,
      }));
    expect(mockCommentLikeRepository.addCommentLike)
      .toHaveBeenCalledTimes(1);
    expect(mockCommentRepository.increaseLikeCountById)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.increaseLikeCountById)
      .toHaveBeenCalledTimes(1);
  });

  it('should orchestrating the unlike comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-1',
      commentId: 'comment-1',
      userId: 'user-1',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.getCommentLikeByCommentAndUserId = jest.fn()
      .mockImplementation(() => Promise.resolve('commentlike-1'));
    mockCommentLikeRepository.addCommentLike = jest.fn().mockResolvedValue();
    mockCommentRepository.increaseLikeCountById = jest.fn().mockResolvedValue();
    mockCommentLikeRepository.deleteCommentLikeById = jest.fn().mockResolvedValue();
    mockCommentRepository.decreaseLikeCountById = jest.fn().mockResolvedValue();

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentById)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentLikeRepository.getCommentLikeByCommentAndUserId)
      .toHaveBeenCalledWith({
        commentId: useCasePayload.commentId,
        userId: useCasePayload.userId,
      });
    expect(mockCommentLikeRepository.deleteCommentLikeById)
      .toHaveBeenCalledWith('commentlike-1');
    expect(mockCommentLikeRepository.deleteCommentLikeById)
      .toHaveBeenCalledTimes(1);
    expect(mockCommentRepository.decreaseLikeCountById)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.decreaseLikeCountById)
      .toHaveBeenCalledTimes(1);
  });
});
