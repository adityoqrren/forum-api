const PostThread = require('../PostThread');

describe('a PostThread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'this is title',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new PostThread(payload)).toThrow(Error('POST_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'this is title',
      body: 123,
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new PostThread(payload)).toThrow(Error('POST_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should throw error when title is empty or body is empty or owner is empty', () => {
    // Arrange
    const payload = {
      title: 'this is title',
      body: 'this is body',
      owner: '  ',
    };

    // Action and Assert
    expect(() => new PostThread(payload)).toThrow(Error('POST_THREAD.EMPTY_VALUE'));
  });

  it('should create postThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'this is title',
      body: 'this is body',
      owner: 'owner-123',
    };

    // Action
    const { title, body, owner } = new PostThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
