const AddedComment = require('../AddedComment');

describe('an AddedComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'A comment',
      // owner is missing
    };

    // Act & Assert
    expect(() => new AddedComment(payload)).toThrow(Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when payload properties did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123, // should be string
      content: 'A comment',
      owner: 'user-123',
    };

    // Act & Assert
    expect(() => new AddedComment(payload)).toThrow(Error('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should create AddedComment object correctly when given valid payload', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'A comment',
      owner: 'user-123',
    };

    // Act
    const addedComment = new AddedComment(payload);

    // Assert
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
