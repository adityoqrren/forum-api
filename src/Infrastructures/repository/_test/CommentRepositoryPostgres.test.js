const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const { minTimeByMinutes } = require('../../../../tests/utils/TimeChanger');

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-1', username: 'user1' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-1', owner: 'user-1' });
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  describe('addComment function', () => {
    it('should persist and return added comment correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const newComment = {
        threadId: 'thread-1',
        content: 'abc',
        owner: 'user-1',
      };

      // Action
      const addedComment = await commentRepository.addComment(newComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'abc',
        owner: 'user-1',
      }));

      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
    });
  });

  describe('verifyCommentById function', () => {
    it('should throw NotFoundError if comment not found', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(commentRepository.verifyCommentById('comment-111'))
        .rejects
        .toThrow(new NotFoundError('comment not found'));
    });

    it('should verify comment when comment found and not return anything', async () => {
      // Arrange
      const dateNow = new Date();
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-1',
        content: 'this is content',
        owner: 'user-1',
        createdAt: dateNow,
      });
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Act and Assert
      await expect(commentRepository.verifyCommentById('comment-123')).resolves.not.toThrow(new NotFoundError('comment not found'));
    });
  });

  describe('getCommentById function', () => {
    it('should throw NotFoundError if comment not found', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(commentRepository.getCommentById('comment-111'))
        .rejects
        .toThrow(new NotFoundError('comment not found'));
    });

    it('should return detail comment if found', async () => {
      // Arrange
      const dateNow = new Date();
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-1',
        content: 'this is content',
        owner: 'user-1',
        createdAt: dateNow,
      });
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Act
      const detailComment = await commentRepository.getCommentById('comment-123');

      // Assert
      const expectedDetailComment = new DetailComment({
        id: 'comment-123',
        thread_id: 'thread-1',
        owner: 'user-1',
        content: 'this is content',
        created_at: dateNow,
      });

      expect(detailComment).toStrictEqual(expectedDetailComment);
    });
  });

  describe('getCommentsByThreadId', () => {
    it('should return empty array if no comments found', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Act
      const comments = await commentRepository.getCommentsByThreadId('thread-1');

      // Assert
      expect(comments).toHaveLength(0);
    });

    it('should return array of comments', async () => {
      // Arrange
      const commentPayload1 = {
        id: 'comment-1',
        threadId: 'thread-1',
        content: 'this is comment 1 content',
        owner: 'user-1',
        createdAt: minTimeByMinutes(2),
      };
      const commentPayload2 = {
        id: 'comment-2',
        threadId: 'thread-1',
        content: 'this is comment 2 content',
        owner: 'user-1',
        createdAt: new Date(),
      };
      await CommentsTableTestHelper.addComment(commentPayload1);
      await CommentsTableTestHelper.addComment(commentPayload2);
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Act
      const comments = await commentRepository.getCommentsByThreadId('thread-1');

      // Assert
      const comment1Expt = {
        id: commentPayload1.id,
        username: 'user1',
        date: commentPayload1.createdAt,
        content: commentPayload1.content,
        like_count: 0,
        deleted_at: null,
      };
      const comment2Expt = {
        id: commentPayload2.id,
        username: 'user1',
        date: commentPayload2.createdAt,
        content: commentPayload2.content,
        like_count: 0,
        deleted_at: null,
      };
      expect(comments).toHaveLength(2);
      expect(comments[0]).toStrictEqual(comment1Expt);
      expect(comments[1]).toStrictEqual(comment2Expt);
    });
  });

  describe('deleteCommentById', () => {
    it('should delete comment if found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        threadId: 'thread-1',
        content: 'this is comment 1 content',
        owner: 'user-1',
      });
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Act
      await commentRepository.deleteCommentById('comment-1');

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-1');
      expect(comment[0].deleted_at).not.toBeNull();
    });
  });
});
