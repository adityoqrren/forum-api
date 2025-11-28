const ItemReply = require('../ItemReply');

describe('an ItemReply entity', () => {
  it('should throw error when not given all needed properties', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'user123',
      date: '2024-06-01T12:00:00Z',
      // content is missing
    };

    // Act & Assert
    expect(() => new ItemReply(payload)).toThrow(Error('ITEM_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when given properties with wrong data types', () => {
    // Arrange
    const payload = {
      id: 123, // should be string
      commentId: 'comment-1',
      username: 'user123',
      date: '2024-06-01T12:00:00Z',
      content: 'This is a reply',
    };

    // Act & Assert
    expect(() => new ItemReply(payload)).toThrow(Error('ITEM_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should create ItemReply object correctly when given valid payload (if deletedAt is null)', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      commentId: 'comment-1',
      username: 'user123',
      date: '2024-06-01T12:00:00Z',
      content: 'This is a reply',
      deletedAt: null,
    };

    // Act
    const itemReply = new ItemReply(payload);

    // Assert
    expect(itemReply.id).toEqual(payload.id);
    expect(itemReply.commentId).toEqual(payload.commentId);
    expect(itemReply.username).toEqual(payload.username);
    expect(itemReply.date).toEqual(payload.date);
    expect(itemReply.content).toEqual(payload.content);
    expect(itemReply.deletedAt).toEqual(null);
  });

  it('should create ItemReply object correctly when given valid payload (if deletedAt not null)', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      commentId: 'comment-1',
      username: 'user123',
      date: '2024-06-01T12:00:00Z',
      content: 'This is a reply',
      deletedAt: '2024-08-01T12:00:00Z',
    };

    // Act
    const itemReply = new ItemReply(payload);

    // Assert
    expect(itemReply.id).toEqual(payload.id);
    expect(itemReply.commentId).toEqual(payload.commentId);
    expect(itemReply.username).toEqual(payload.username);
    expect(itemReply.date).toEqual(payload.date);
    expect(itemReply.content).toEqual(payload.content);
    expect(itemReply.deletedAt).toEqual(payload.deletedAt);
  });
});
