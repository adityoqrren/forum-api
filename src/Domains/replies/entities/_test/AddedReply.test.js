const AddedReply = require('../AddedReply');

describe('an AddedReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'A reply',
      // owner is missing
    };

    // Act & Assert
    expect(() => new AddedReply(payload)).toThrow(Error('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when payload properties did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123, // should be string
      content: 'A reply',
      owner: 'user-123',
    };

    // Act & Assert
    expect(() => new AddedReply(payload)).toThrow(Error('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should create AddedReply object correctly when given valid payload', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'A reply',
      owner: 'user-123',
    };

    // Act
    const addedReply = new AddedReply(payload);

    // Assert
    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.owner).toEqual(payload.owner);
  });
});
