const PostReply = require('../PostReply');

describe('a PostReply entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    // missing commentId
    expect(() => new PostReply({ owner: 'user-123', content: 'abc' }))
      .toThrow(Error('POST_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'));
    // missing owner
    expect(() => new PostReply({ commentId: 'comment-123', content: 'abc' }))
      .toThrow(Error('POST_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'));
    // missing content
    expect(() => new PostReply({ commentId: 'comment-123', owner: 'user-123' }))
      .toThrow(Error('POST_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when payload properties do not meet data type specification', () => {
    // commentId not string
    expect(() => new PostReply({ commentId: 123, owner: 'user-123', content: 'abc' }))
      .toThrow(Error('POST_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'));
    // owner not string
    expect(() => new PostReply({ commentId: 'comment-123', owner: {}, content: 'abc' }))
      .toThrow(Error('POST_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'));
    // content not string
    expect(() => new PostReply({ commentId: 'comment-123', owner: 'user-123', content: [] }))
      .toThrow(Error('POST_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should throw error when any value is an empty string or only whitespace', () => {
    expect(() => new PostReply({ commentId: ' ', owner: 'user-123', content: 'abc' }))
      .toThrow(Error('POST_REPLY.EMPTY_VALUE'));
    expect(() => new PostReply({ commentId: 'comment-123', owner: '   ', content: 'abc' }))
      .toThrow(Error('POST_REPLY.EMPTY_VALUE'));
    expect(() => new PostReply({ commentId: 'comment-123', owner: 'user-123', content: ' ' }))
      .toThrow(Error('POST_REPLY.EMPTY_VALUE'));
  });

  it('should create PostReply object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      owner: 'user-123',
      content: 'This is a reply',
    };

    // Action
    const postReply = new PostReply(payload);

    // Assert
    expect(postReply.commentId).toEqual(payload.commentId);
    expect(postReply.owner).toEqual(payload.owner);
    expect(postReply.content).toEqual(payload.content);
  });
});
