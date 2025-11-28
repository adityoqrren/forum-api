const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const generateLoremByChar = require('../../../../tests/utils/SentencesGenerator');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const PostThread = require('../../../Domains/threads/entities/PostThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const DetailThreadRow = require('../../../Domains/threads/entities/DetailThreadRow');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'user123',
    });
  });

  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist added thread correctly', async () => {
      // Arrange
      const postThread = new PostThread({
        title: 'this is title',
        body: generateLoremByChar(80),
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(postThread);

      // Assert
      const thread = await ThreadTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const generatedChar = generateLoremByChar(80);
      const postThread = new PostThread({
        title: 'this is title',
        body: generatedChar,
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(postThread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'this is title',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyThreadAvailability function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadAvailability('thread-345'))
        .rejects
        .toThrow(new NotFoundError('thread not found'));
    });

    it('should verify thread when thread found and not return anything', async () => {
      // Arrange
      const generatedChar = generateLoremByChar(80);
      const dateNow = new Date();
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'this is title',
        body: generatedChar,
        owner: 'user-123',
        createdAt: dateNow,
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Assert
      await expect(threadRepositoryPostgres.verifyThreadAvailability('thread-123')).resolves.not.toThrow(new NotFoundError('thread not found'));
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-345'))
        .rejects
        .toThrow(new NotFoundError('thread not found'));
    });

    it('should return detail thread data by id correctly', async () => {
      // Arrange
      const generatedChar = generateLoremByChar(80);
      const dateNow = new Date();
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'this is title',
        body: generatedChar,
        owner: 'user-123',
        createdAt: dateNow,
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const detailThread = await threadRepositoryPostgres.getThreadById('thread-123');

      const expectedDetailThread = new DetailThreadRow({
        id: 'thread-123',
        title: 'this is title',
        body: generatedChar,
        username: 'user123',
        date: dateNow,
        comments: [],
      });

      // Assert
      expect(detailThread).toStrictEqual(expectedDetailThread);
    });
  });
});
