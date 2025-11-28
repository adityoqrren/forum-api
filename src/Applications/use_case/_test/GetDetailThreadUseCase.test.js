const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ItemComment = require('../../../Domains/comments/entities/ItemComment');
const ItemReply = require('../../../Domains/replies/entities/ItemReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailThreadRow = require('../../../Domains/threads/entities/DetailThreadRow');
const ThreadRepository = require('../../../Domains/threads/ThreadRepostiory');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating get detail thread use case correctly', async () => {
    // Arrange
    const dateNow = new Date();
    const dateNowInString = dateNow.toISOString();
    const mockDetailThread = new DetailThreadRow({
      id: 'thread-123',
      title: 'this is title',
      body: 'this is body',
      date: dateNow,
      username: 'user123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread));

    const mockListComments = [
      {
        id: 'comment-1',
        username: 'user1',
        date: dateNow,
        content: 'this is comment 1 content',
      },
      {
        id: 'comment-2',
        username: 'user2',
        date: dateNow,
        content: 'this is comment 2 content',
      },
    ];

    const mockListReplies = [
      {
        id: 'reply-1',
        comment_id: 'comment-1',
        username: 'user2',
        created_at: dateNow,
        content: 'this is reply to comment 1 content',
      },
      {
        id: 'reply-2',
        comment_id: 'comment-2',
        username: 'user1',
        created_at: dateNow,
        content: 'this is reply to comment 2 content',
      },
    ];

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockListComments));
    mockReplyRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockListReplies));

    /** creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const threadId = 'thread-123';

    const detailThreadWithComment = await getDetailThreadUseCase.execute(threadId);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toHaveBeenCalledWith(threadId);
    expect(detailThreadWithComment).toStrictEqual(new DetailThread({
      id: 'thread-123',
      title: 'this is title',
      body: 'this is body',
      date: dateNowInString,
      username: 'user123',
      comments: [
        new ItemComment({
          id: 'comment-1',
          username: 'user1',
          date: dateNowInString,
          content: 'this is comment 1 content',
          replies: [
            new ItemReply({
              id: 'reply-1',
              commentId: 'comment-1',
              username: 'user2',
              date: dateNowInString,
              content: 'this is reply to comment 1 content',
            }),
          ],
        }),
        new ItemComment({
          id: 'comment-2',
          username: 'user2',
          date: dateNowInString,
          content: 'this is comment 2 content',
          replies: [
            new ItemReply({
              id: 'reply-2',
              commentId: 'comment-2',
              username: 'user1',
              date: dateNowInString,
              content: 'this is reply to comment 2 content',
            }),
          ],
        }),
      ],
    }));
  });

  it('should orchestrating get detail thread use case with deleted reply correctly', async () => {
    // Arrange
    const dateCreated = new Date('2024-08-01T12:00:00Z');
    const dateCreatedInString = dateCreated.toISOString();
    const dateReplyCreated = new Date('2024-08-02T12:00:00Z');
    const dateReplyCreatedInString = dateReplyCreated.toISOString();
    const dateReplyDeleted = new Date('2024-09-01T12:00:00Z');
    const dateReplyDeletedInString = dateReplyDeleted.toISOString();
    const mockDetailThread = new DetailThreadRow({
      id: 'thread-123',
      title: 'this is title',
      body: 'this is body',
      date: dateCreated,
      username: 'user123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread));

    const mockListComments = [
      {
        id: 'comment-1',
        username: 'user1',
        date: dateCreated,
        content: 'this is comment 1 content',
      },
      {
        id: 'comment-2',
        username: 'user2',
        date: dateCreated,
        content: 'this is comment 2 content',
      },
    ];

    const mockListReplies = [
      {
        id: 'reply-1',
        comment_id: 'comment-1',
        username: 'user2',
        created_at: dateReplyCreated,
        content: 'this is reply to comment 1 content',
        deleted_at: dateReplyDeleted,
      },
      {
        id: 'reply-2',
        comment_id: 'comment-2',
        username: 'user1',
        created_at: dateReplyCreated,
        content: 'this is reply to comment 2 content',
      },
    ];

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockListComments));
    mockReplyRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockListReplies));

    /** creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const threadId = 'thread-123';

    const detailThreadWithComment = await getDetailThreadUseCase.execute(threadId);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toHaveBeenCalledWith(threadId);
    expect(detailThreadWithComment).toStrictEqual(new DetailThread({
      id: 'thread-123',
      title: 'this is title',
      body: 'this is body',
      date: dateCreatedInString,
      username: 'user123',
      comments: [
        new ItemComment({
          id: 'comment-1',
          username: 'user1',
          date: dateCreatedInString,
          content: 'this is comment 1 content',
          deletedAt: null,
          replies: [
            new ItemReply({
              id: 'reply-1',
              commentId: 'comment-1',
              username: 'user2',
              date: dateReplyCreatedInString,
              content: '**balasan telah dihapus**',
              deletedAt: dateReplyDeletedInString,
            }),
          ],
        }),
        new ItemComment({
          id: 'comment-2',
          username: 'user2',
          date: dateCreatedInString,
          content: 'this is comment 2 content',
          deletedAt: null,
          replies: [
            new ItemReply({
              id: 'reply-2',
              commentId: 'comment-2',
              username: 'user1',
              date: dateReplyCreatedInString,
              content: 'this is reply to comment 2 content',
              deletedAt: null,
            }),
          ],
        }),
      ],
    }));
  });

  it('should orchestrating get detail thread use case with deleted comments correctly', async () => {
    // Arrange
    const dateCreated = new Date('2024-08-01T12:00:00Z');
    const dateCreatedInString = dateCreated.toISOString();
    const dateReplyCreated = new Date('2024-08-02T12:00:00Z');
    const dateReplyCreatedInString = dateReplyCreated.toISOString();
    const dateDeleted = new Date('2024-09-01T12:00:00Z');
    const dateDeletedInString = dateDeleted.toISOString();
    const mockDetailThread = new DetailThreadRow({
      id: 'thread-123',
      title: 'this is title',
      body: 'this is body',
      date: dateCreated,
      username: 'user123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread));

    const mockListComments = [
      {
        id: 'comment-1',
        username: 'user1',
        date: dateCreated,
        content: 'this is comment 1 content',
        deleted_at: dateDeleted,
      },
      {
        id: 'comment-2',
        username: 'user2',
        date: dateCreated,
        content: 'this is comment 2 content',
      },
    ];

    const mockListReplies = [
      {
        id: 'reply-1',
        comment_id: 'comment-1',
        username: 'user2',
        created_at: dateReplyCreated,
        content: 'this is reply to comment 1 content',
      },
      {
        id: 'reply-2',
        comment_id: 'comment-2',
        username: 'user1',
        created_at: dateReplyCreated,
        content: 'this is reply to comment 2 content',
      },
    ];

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockListComments));
    mockReplyRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockListReplies));

    /** creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const threadId = 'thread-123';

    const detailThreadWithComment = await getDetailThreadUseCase.execute(threadId);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toHaveBeenCalledWith(threadId);
    expect(detailThreadWithComment).toStrictEqual(new DetailThread({
      id: 'thread-123',
      title: 'this is title',
      body: 'this is body',
      date: dateCreatedInString,
      username: 'user123',
      comments: [
        new ItemComment({
          id: 'comment-1',
          username: 'user1',
          date: dateCreatedInString,
          content: '**komentar telah dihapus**',
          deletedAt: dateDeletedInString,
          replies: [
            new ItemReply({
              id: 'reply-1',
              commentId: 'comment-1',
              username: 'user2',
              date: dateReplyCreatedInString,
              content: '**balasan telah dihapus**',
            }),
          ],
        }),
        new ItemComment({
          id: 'comment-2',
          username: 'user2',
          date: dateCreatedInString,
          content: 'this is comment 2 content',
          deletedAt: null,
          replies: [
            new ItemReply({
              id: 'reply-2',
              commentId: 'comment-2',
              username: 'user1',
              date: dateReplyCreatedInString,
              content: 'this is reply to comment 2 content',
            }),
          ],
        }),
      ],
    }));
  });

  it('should throw NotFoundError when threadId is invalid', async () => {
    // Arrange
    const threadId = 'thread-xxx';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Mock getThreadById to throw NotFoundError
    mockThreadRepository.getThreadById = jest.fn()
      .mockRejectedValue(new NotFoundError('thread not found'));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Act & Assert
    await expect(getDetailThreadUseCase.execute(threadId))
      .rejects.toThrow(new NotFoundError('thread not found'));

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
  });
});
