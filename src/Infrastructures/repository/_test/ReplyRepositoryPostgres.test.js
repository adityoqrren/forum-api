const pool = require('../../database/postgres/pool');

const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const { minTimeByMinutes } = require('../../../../tests/utils/TimeChanger');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-1', username: 'user1' });
    await UsersTableTestHelper.addUser({ id: 'user-2', username: 'user2' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-1', owner: 'user-1' });
    await CommentsTableTestHelper.addComment({ id: 'comment-1', threadId: 'thread-1', owner: 'user-2' });
    await CommentsTableTestHelper.addComment({ id: 'comment-2', threadId: 'thread-1', owner: 'user-2' });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist and return added reply correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      const newReply = {
        commentId: 'comment-1',
        content: 'abc',
        owner: 'user-1',
      };

      // Action
      const addedReply = await replyRepository.addReply(newReply);

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'abc',
        owner: 'user-1',
      }));

      const reply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(reply).toHaveLength(1);
    });
  });

  describe('getReplyById function', () => {
    it('should throw NotFoundError if reply not found', async () => {
      // Arrange
      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(replyRepository.getReplyById('reply-111'))
        .rejects
        .toThrow(new NotFoundError('reply not found'));
    });

    it('should return detail reply if found', async () => {
      // Arrange
      const dateNow = new Date();
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-1',
        content: 'this is content',
        owner: 'user-1',
        createdAt: dateNow,
      });
      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      // Act
      const detailReply = await replyRepository.getReplyById('reply-123');

      // Assert
      const expectedDetailReply = new DetailReply({
        id: 'reply-123',
        comment_id: 'comment-1',
        owner: 'user-1',
        content: 'this is content',
        created_at: dateNow,
      });

      expect(detailReply).toStrictEqual(expectedDetailReply);
    });
  });

  describe('getRepliesByThreadId', () => {
    it('should return empty array if no replies found', async () => {
      // Arrange
      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      // Act
      const replies = await replyRepository.getRepliesByThreadId('thread-1');

      // Assert
      expect(replies).toHaveLength(0);
    });

    it('should return array of replies', async () => {
      // Arrange
      const replyPayload1 = {
        id: 'reply-1',
        commentId: 'comment-1',
        content: 'this is reply 1 content',
        owner: 'user-1',
        createdAt: minTimeByMinutes(2),
      };
      const replyPayload2 = {
        id: 'reply-2',
        commentId: 'comment-2',
        content: 'this is reply 2 content',
        owner: 'user-1',
        createdAt: new Date(),
      };
      await RepliesTableTestHelper.addReply(replyPayload1);
      await RepliesTableTestHelper.addReply(replyPayload2);
      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      // Act
      const replies = await replyRepository.getRepliesByThreadId('thread-1');

      // Assert
      const reply1Expt = {
        id: replyPayload1.id,
        comment_id: 'comment-1',
        username: 'user1',
        created_at: replyPayload1.createdAt,
        content: replyPayload1.content,
        deleted_at: null,
      };
      const reply2Expt = {
        id: replyPayload2.id,
        comment_id: 'comment-2',
        username: 'user1',
        created_at: replyPayload2.createdAt,
        content: replyPayload2.content,
        deleted_at: null,
      };

      expect(replies).toHaveLength(2);
      expect(replies[0]).toStrictEqual(reply1Expt);
      expect(replies[1]).toStrictEqual(reply2Expt);
    });
  });

  describe('deleteReplyById', () => {
    it('should delete reply if found', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-1',
        commentId: 'comment-1',
        content: 'this is reply 1 content',
        owner: 'user-1',
      });
      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      // Act
      await replyRepository.deleteReplyById('reply-1');

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-1');
      expect(reply[0].deleted_at).not.toBeNull();
    });
  });
});
