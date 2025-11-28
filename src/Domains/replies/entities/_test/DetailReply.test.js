const DetailReply = require('../DetailReply');

describe('a DetailReply entity', () => {
  it('should create DetailReply object correctly when payload is valid', () => {
    // Arrange
    const payload = {
      id: 'reply-1',
      comment_id: 'comment-1',
      owner: 'user-123',
      content: 'this is reply',
      created_at: new Date(),
    };

    // Act
    const detailReply = new DetailReply(payload);

    // Assert
    expect(detailReply.id).toEqual(payload.id);
    expect(detailReply.commentId).toEqual(payload.comment_id);
    expect(detailReply.owner).toEqual(payload.owner);
    expect(detailReply.content).toEqual(payload.content);
    expect(detailReply.date).toEqual(payload.created_at);
  });

  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-1',
      comment_id: 'comment-1',
      owner: 'user-123',
      content: 'this is reply',
      // date missing
    };

    // Act & Assert
    expect(() => new DetailReply(payload))
      .toThrow(Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when payload property data types are not valid', () => {
    // Arrange
    const payload = {
      id: 123, // should be string
      comment_id: 'comment-1',
      owner: 'user-123',
      content: 'this is reply',
      created_at: ['2024-01-01'], // should be datetime
    };

    // Act & Assert
    expect(() => new DetailReply(payload))
      .toThrow(Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });
});
