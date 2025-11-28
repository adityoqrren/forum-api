const DetailThread = require('../DetailThread');

describe('a DetailThread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'this is title',
      body: 'this is body',
      date: '2025-08-08T07:19:09.775Z',
      // username is missing
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrow(Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'this is title',
      body: 'this is body',
      username: 'thisUser',
      date: '2025-08-08T07:19:09.775Z',
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrow(Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should create detailThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'this is title',
      body: 'this is body',
      username: 'thisUser',
      date: '2025-08-08T07:19:09.775Z',
    };

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.title).toEqual(payload.title);
    expect(detailThread.body).toEqual(payload.body);
    expect(detailThread.username).toEqual(payload.username);
    expect(detailThread.date).toEqual(payload.date);
    expect(detailThread.comments).toHaveLength(0);
  });
});
