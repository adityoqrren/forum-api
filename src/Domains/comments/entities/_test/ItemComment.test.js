const ItemComment = require('../ItemComment');

describe('an ItemComment entity', () => {
  it('should throw error when not given all needed properties', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user123',
      date: '2024-06-01T12:00:00Z',
      // content is missing
    };

    // Act & Assert
    expect(() => new ItemComment(payload)).toThrow(Error('ITEM_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when given properties with wrong data types', () => {
    // Arrange
    const payload = {
      id: 123, // should be string
      username: 'user123',
      date: '2024-06-01T12:00:00Z',
      content: 'This is a comment',
    };

    // Act & Assert
    expect(() => new ItemComment(payload)).toThrow(Error('ITEM_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should create ItemComment object correctly when given valid payload (if deletedAt is null)', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user123',
      date: '2024-06-01T12:00:00Z',
      content: 'This is a comment',
      likeCount: 2,
      deletedAt: null,
    };

    // Act
    const itemComment = new ItemComment(payload);

    // Assert
    expect(itemComment.id).toEqual(payload.id);
    expect(itemComment.username).toEqual(payload.username);
    expect(itemComment.date).toEqual(payload.date);
    expect(itemComment.content).toEqual(payload.content);
    expect(itemComment.likeCount).toEqual(payload.likeCount);
    expect(itemComment.deletedAt).toEqual(null);
    expect(itemComment.replies).toHaveLength(0);
  });

  it('should create ItemComment object correctly when given valid payload (if deletedAt not null)', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user123',
      date: '2024-06-01T12:00:00Z',
      content: 'This is a comment',
      likeCount: 2,
      deletedAt: '2024-08-01T12:00:00Z',
    };

    // Act
    const itemComment = new ItemComment(payload);

    // Assert
    expect(itemComment.id).toEqual(payload.id);
    expect(itemComment.username).toEqual(payload.username);
    expect(itemComment.date).toEqual(payload.date);
    expect(itemComment.content).toEqual(payload.content);
    expect(itemComment.likeCount).toEqual(payload.likeCount);
    expect(itemComment.deletedAt).toEqual(payload.deletedAt);
    expect(itemComment.replies).toHaveLength(0);
  });
});
