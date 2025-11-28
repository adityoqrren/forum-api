const PostComment = require('../PostComment');

describe('a PostComment entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    // missing threadId
    expect(() => new PostComment({ owner: 'user-123', content: 'abc' }))
      .toThrow(Error('POST_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'));
    // missing owner
    expect(() => new PostComment({ threadId: 'thread-123', content: 'abc' }))
      .toThrow(Error('POST_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'));
    // missing content
    expect(() => new PostComment({ threadId: 'thread-123', owner: 'user-123' }))
      .toThrow(Error('POST_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when payload properties do not meet data type specification', () => {
    // threadId not string
    expect(() => new PostComment({ threadId: 123, owner: 'user-123', content: 'abc' }))
      .toThrow(Error('POST_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'));
    // owner not string
    expect(() => new PostComment({ threadId: 'thread-123', owner: {}, content: 'abc' }))
      .toThrow(Error('POST_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'));
    // content not string
    expect(() => new PostComment({ threadId: 'thread-123', owner: 'user-123', content: [] }))
      .toThrow(Error('POST_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should throw error when any value is an empty string or only whitespace', () => {
    expect(() => new PostComment({ threadId: ' ', owner: 'user-123', content: 'abc' }))
      .toThrow(Error('POST_COMMENT.EMPTY_VALUE'));
    expect(() => new PostComment({ threadId: 'thread-123', owner: '   ', content: 'abc' }))
      .toThrow(Error('POST_COMMENT.EMPTY_VALUE'));
    expect(() => new PostComment({ threadId: 'thread-123', owner: 'user-123', content: ' ' }))
      .toThrow(Error('POST_COMMENT.EMPTY_VALUE'));
  });

  it('should create PostComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      owner: 'user-123',
      content: 'This is a comment',
    };

    // Action
    const postComment = new PostComment(payload);

    // Assert
    expect(postComment.threadId).toEqual(payload.threadId);
    expect(postComment.owner).toEqual(payload.owner);
    expect(postComment.content).toEqual(payload.content);
  });
});
