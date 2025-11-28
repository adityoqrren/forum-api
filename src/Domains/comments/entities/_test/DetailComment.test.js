const DetailComment = require('../DetailComment');

describe('a DetailComment entity', () => {
  it('should create DetailComment object correctly when payload is valid', () => {
    // Arrange
    const payload = {
      id: 'comment-1',
      thread_id: 'thread-1',
      owner: 'user-123',
      content: 'this is comment',
      created_at: new Date(),
    };

    // Act
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.threadId).toEqual(payload.thread_id);
    expect(detailComment.owner).toEqual(payload.owner);
    expect(detailComment.content).toEqual(payload.content);
    expect(detailComment.date).toEqual(payload.created_at);
  });

  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-1',
      thread_id: 'thread-1',
      owner: 'user-123',
      content: 'this is comment',
      // date missing
    };

    // Act & Assert
    expect(() => new DetailComment(payload))
      .toThrow(Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when payload property data types are not valid', () => {
    // Arrange
    const payload = {
      id: 123, // should be string
      thread_id: 'thread-1',
      owner: 'user-123',
      content: 'this is comment',
      created_at: ['2024-01-01'], // should be datetime
    };

    // Act & Assert
    expect(() => new DetailComment(payload))
      .toThrow(Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });
});
