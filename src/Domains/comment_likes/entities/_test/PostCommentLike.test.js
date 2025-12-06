const PostCommentLike = require('../PostCommentLike');

describe('a PostCommentLike entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    // missing commentId
    expect(() => new PostCommentLike({ userId: 'user-123' }))
      .toThrow(Error('POST_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY'));
    // missing userId
    expect(() => new PostCommentLike({ commentId: 'comment-123' }))
      .toThrow(Error('POST_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when payload properties do not meet data type specification', () => {
    // commentId not string
    expect(() => new PostCommentLike({ commentId: 123, userId: 'user-123' }))
      .toThrow(Error('POST_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION'));
    // userId not string
    expect(() => new PostCommentLike({ commentId: 'comment-123', userId: {} }))
      .toThrow(Error('POST_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should throw error when any value is an empty string or only whitespace', () => {
    expect(() => new PostCommentLike({ commentId: ' ', userId: 'user-123' }))
      .toThrow(Error('POST_COMMENT_LIKE.EMPTY_VALUE'));
    expect(() => new PostCommentLike({ commentId: 'comment-123', userId: '   ' }))
      .toThrow(Error('POST_COMMENT_LIKE.EMPTY_VALUE'));
  });

  it('should create PostCommentLike object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      userId: 'user-123',
    };

    // Action
    const postComment = new PostCommentLike(payload);

    // Assert
    expect(postComment.commentId).toEqual(payload.commentId);
    expect(postComment.userId).toEqual(payload.userId);
  });
});
