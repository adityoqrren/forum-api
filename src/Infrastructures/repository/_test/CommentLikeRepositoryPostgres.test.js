const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const { minTimeByMinutes } = require('../../../../tests/utils/TimeChanger');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-1', username: 'user1' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-1', owner: 'user-1' });
    // make comment
    const commentPayload1 = {
      id: 'comment-123',
      threadId: 'thread-1',
      content: 'this is comment 1 content',
      owner: 'user-1',
      createdAt: minTimeByMinutes(2),
    };
    await CommentsTableTestHelper.addComment(commentPayload1);
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.refreshCommentLikeCount('comment-123');
  });

  describe('addCommentLike', () => {
    it('should persist like comment', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const newCommentLike = {
        commentId: 'comment-123',
        userId: 'user-1',
      };

      // Action
      const likeId = await commentRepository.addCommentLike(newCommentLike);

      // Assert
      expect(likeId).toStrictEqual('commentlike-123');
    });
  });

  describe('getCommentLikeByCommentAndUserId', () => {
    it('should return null if not found', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Act
      const commentId = await commentRepository.getCommentLikeByCommentAndUserId({
        commentId: 'comment-123',
        userId: 'user-1',
      });

      // Assert
      expect(commentId).toStrictEqual(null);
    });

    it('should return comment like id if found', async () => {
      // Arrange
      const fakeCommentLikeId = 'commentlike-123';
      await CommentsTableTestHelper.addCommentLike({
        commentLike: fakeCommentLikeId,
        commentId: 'comment-123',
        userId: 'user-1',
      });
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Act
      const commentId = await commentRepository.getCommentLikeByCommentAndUserId({
        commentId: 'comment-123',
        userId: 'user-1',
      });

      // Assert
      expect(commentId).toStrictEqual(fakeCommentLikeId);
    });
  });

  describe('deleteCommentLikeById', () => {
    it('should delete like comment', async () => {
      // Arrange
      const fakeCommentLikeId = 'commentlike-123';
      await CommentsTableTestHelper.addCommentLike({
        commentLike: fakeCommentLikeId,
        commentId: 'comment-123',
        userId: 'user-1',
      });
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Act
      await commentRepository.deleteCommentLikeById(fakeCommentLikeId);

      // Assert
      const idCommentLike = await CommentsTableTestHelper.findCommentLikeById(fakeCommentLikeId);
      expect(idCommentLike).toHaveLength(0);
    });
  });

  describe('increaseLikeCountById', () => {
    it('should increase like count', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Act
      const likeCount = await commentRepository.increaseLikeCountById('comment-123');

      // Assert
      expect(likeCount).toStrictEqual(1);
    });
  });

  describe('decreaseLikeCountById', () => {
    it('should decrease like count', async () => {
      // Arrange
      await CommentsTableTestHelper.increaseCommentLikeCount('comment-123');
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Act
      const likeCount = await commentRepository.decreaseLikeCountById('comment-123');

      // Assert
      expect(likeCount).toStrictEqual(0);
    });
  });
});
