const ThreadRepository = require('../ThreadRepostiory');

describe('ThreadRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action and Assert
    await expect(threadRepository.addThread({})).rejects.toThrow(Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(threadRepository.verifyThreadAvailability({})).rejects.toThrow(Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(threadRepository.getThreadById('')).rejects.toThrow(Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
  });
});
