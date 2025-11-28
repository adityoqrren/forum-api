const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const replyRepository = new ReplyRepository();

    // Action and Assert
    await expect(replyRepository.addReply({})).rejects.toThrow(Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(replyRepository.getRepliesByThreadId('')).rejects.toThrow(Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(replyRepository.getReplyById('')).rejects.toThrow(Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(replyRepository.deleteReplyById('')).rejects.toThrow(Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
  });
});
