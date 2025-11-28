const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  // Add thread
  describe('when POST /threads', () => {
    afterEach(async () => {
      await ThreadTableTestHelper.cleanTable();
    });

    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'this is title',
        body: 'this is body',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);
      // register user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'user123',
          password: 'secret',
          fullname: 'User 123',
        },
      });
      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'user123',
          password: 'secret',
        },
      });

      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 401 when no authentication', async () => {
      // Arrange
      const requestPayload = {
        title: 'this is title',
        body: 'this is body',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 if bad payload', async () => {
      // Arrange
      const requestPayload = {
        title: 'this is title',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);
      // register user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'user123',
          password: 'secret',
          fullname: 'User 123',
        },
      });
      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'user123',
          password: 'secret',
        },
      });

      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('cannot create new thread because needed properties are incomplete');
    });
  });

  // Add comment
  describe('when POST /threads/{threadId}/comments', () => {
    let threadId;
    let accessTokenUser1;
    let accessTokenUser2;

    beforeAll(async () => {
      const server = await createServer(container);
      // register user1
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'user1',
          password: 'secret',
          fullname: 'User 1',
        },
      });
      // login user1
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'user1',
          password: 'secret',
        },
      });

      const { data: { accessToken: accessToken1 } } = JSON.parse(loginResponse.payload);
      accessTokenUser1 = accessToken1;

      // register user2
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'user2',
          password: 'secret',
          fullname: 'User 2',
        },
      });
      // login user2
      const loginResponse2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'user2',
          password: 'secret',
        },
      });

      const { data: { accessToken: accessToken2 } } = JSON.parse(loginResponse2.payload);
      accessTokenUser2 = accessToken2;

      // console.info(`accessTokenUser1: ${accessTokenUser1}`);
      // console.info(`accessTokenUser2: ${accessTokenUser2}`);

      // make thread to comment on
      const requestPayload = {
        title: 'this is title',
        body: 'this is body',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUser1}`,
        },
      });
      threadId = JSON.parse(response.payload).data.addedThread.id;
    });

    afterAll(async () => {
      await ThreadTableTestHelper.cleanTable();
    });

    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'this is comment content',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUser2}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 401 when no authentication', async () => {
      // Arrange
      const requestPayload = {
        content: 'this is comment content',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 if bad payload', async () => {
      // Arrange
      const requestPayload = {
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUser2}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('cannot create new comment because needed properties are incomplete');
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'this is comment content',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUser2}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread not found');
    });
  });

  // Add reply
  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    let threadId;
    let commentId;
    let accessTokenUser1;
    let accessTokenUser2;

    beforeAll(async () => {
      const server = await createServer(container);
      // register user1
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'user1',
          password: 'secret',
          fullname: 'User 1',
        },
      });
      // login user1
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'user1',
          password: 'secret',
        },
      });

      const { data: { accessToken: accessToken1 } } = JSON.parse(loginResponse.payload);
      accessTokenUser1 = accessToken1;

      // register user2
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'user2',
          password: 'secret',
          fullname: 'User 2',
        },
      });
      // login user2
      const loginResponse2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'user2',
          password: 'secret',
        },
      });

      const { data: { accessToken: accessToken2 } } = JSON.parse(loginResponse2.payload);
      accessTokenUser2 = accessToken2;

      // make thread to comment on
      const requestPayload = {
        title: 'this is title',
        body: 'this is body',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUser1}`,
        },
      });
      threadId = JSON.parse(response.payload).data.addedThread.id;

      // make comment on thread
      const requestPayloadComment = {
        content: 'this is comment content',
      };

      // Action
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayloadComment,
        headers: {
          Authorization: `Bearer ${accessTokenUser2}`,
        },
      });

      commentId = JSON.parse(responseComment.payload).data.addedComment.id;
    });

    afterAll(async () => {
      await ThreadTableTestHelper.cleanTable();
    });

    it('should response 201 and persisted reply', async () => {
      // Arrange
      const requestPayload = {
        content: 'this is reply content',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUser1}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });

    it('should response 401 when no authentication', async () => {
      // Arrange
      const requestPayload = {
        content: 'this is reply content',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 if bad payload', async () => {
      // Arrange
      const requestPayload = {
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUser1}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('cannot create new reply because needed properties are incomplete');
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'this is reply content',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/xxx/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUser1}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread not found');
    });

    it('should response 404 when comment not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'this is reply content',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/xxx/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUser1}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment not found');
    });
  });

  // Get threads
  describe('when GET /threads/{threadId} (thread with its comments and replies)', () => {
    let threadId;
    let accessTokenUser1;
    let accessTokenUser2;
    let commentId1;
    let commentId2;

    beforeAll(async () => {
      const server = await createServer(container);
      // register user1
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'user1',
          password: 'secret',
          fullname: 'User 1',
        },
      });
      // login user1
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'user1',
          password: 'secret',
        },
      });

      const { data: { accessToken: accessToken1 } } = JSON.parse(loginResponse.payload);
      accessTokenUser1 = accessToken1;

      // register user2
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'user2',
          password: 'secret',
          fullname: 'User 2',
        },
      });
      // login user2
      const loginResponse2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'user2',
          password: 'secret',
        },
      });

      const { data: { accessToken: accessToken2 } } = JSON.parse(loginResponse2.payload);
      accessTokenUser2 = accessToken2;

      // make thread to comment on
      const requestPayload = {
        title: 'this is title',
        body: 'this is body',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUser1}`,
        },
      });
      threadId = JSON.parse(response.payload).data.addedThread.id;

      // add comments
      const requestPayloadComment1 = {
        content: 'this is comment 1 content',
      };
      const comment1 = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayloadComment1,
        headers: {
          Authorization: `Bearer ${accessTokenUser1}`,
        },
      });
      commentId1 = JSON.parse(comment1.payload).data.addedComment.id;

      const requestPayloadComment2 = {
        content: 'this is comment 2 content',
      };
      const comment2 = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayloadComment2,
        headers: {
          Authorization: `Bearer ${accessTokenUser2}`,
        },
      });
      commentId2 = JSON.parse(comment2.payload).data.addedComment.id;

      const requestPayloadComment3 = {
        content: 'this is comment 3 content',
      };
      await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayloadComment3,
        headers: {
          Authorization: `Bearer ${accessTokenUser1}`,
        },
      });

      // add replies
      // from user2 to comment 1
      const requestPayloadReply1 = {
        content: 'this is reply to comment 1 content',
      };
      await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId1}/replies`,
        payload: requestPayloadReply1,
        headers: {
          Authorization: `Bearer ${accessTokenUser2}`,
        },
      });

      // from user1 to comment 2
      const requestPayloadReply2 = {
        content: 'this is reply to comment 2 content',
      };
      await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId2}/replies`,
        payload: requestPayloadReply2,
        headers: {
          Authorization: `Bearer ${accessTokenUser1}`,
        },
      });
    });

    afterAll(async () => {
      await ThreadTableTestHelper.cleanTable();
    });

    it('should response 200 when thread found', async () => {
      // Arrange
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(3);
      expect(responseJson.data.thread.comments[0].replies).toHaveLength(1);
      expect(responseJson.data.thread.comments[1].replies).toHaveLength(1);
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/xxx',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread not found');
    });
  });

  // Delete comment
  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    let threadId;
    let accessTokenUser1;
    let accessTokenUser2;
    let commentId;

    beforeAll(async () => {
      const server = await createServer(container);
      // register user1
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'user1',
          password: 'secret',
          fullname: 'User 1',
        },
      });
      // login user1
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'user1',
          password: 'secret',
        },
      });

      const { data: { accessToken: accessToken1 } } = JSON.parse(loginResponse.payload);
      accessTokenUser1 = accessToken1;

      // register user2
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'user2',
          password: 'secret',
          fullname: 'User 2',
        },
      });
      // login user2
      const loginResponse2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'user2',
          password: 'secret',
        },
      });

      const { data: { accessToken: accessToken2 } } = JSON.parse(loginResponse2.payload);
      accessTokenUser2 = accessToken2;

      // make thread to comment on
      const requestPayload = {
        title: 'this is title',
        body: 'this is body',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUser1}`,
        },
      });
      threadId = JSON.parse(response.payload).data.addedThread.id;

      // add comment from user 2
      const requestPayloadComment = {
        content: 'this is comment content',
      };
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayloadComment,
        headers: {
          Authorization: `Bearer ${accessTokenUser2}`,
        },
      });

      const { data: { addedComment } } = JSON.parse(commentResponse.payload);
      commentId = addedComment.id;
    });

    afterAll(async () => {
      await ThreadTableTestHelper.cleanTable();
    });

    it('should response 401 when no authentication', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when comment not found', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/xxxx`,
        headers: {
          Authorization: `Bearer ${accessTokenUser2}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment not found');
    });

    it('should response 403 when comment exists and user is not owner of its comment', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessTokenUser1}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('You are not authorized to delete this comment');
    });

    it('should response 200 when comment exists and user is owner of its comment', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessTokenUser2}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');

      // Action
      const response2 = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // console.info(`response2 ${JSON.stringify(response2.result)}`);
      // Assert
      const responseJson2 = JSON.parse(response2.payload);
      expect(response2.statusCode).toEqual(200);
      expect(responseJson2.status).toEqual('success');
      expect(responseJson2.data.thread).toBeDefined();
      expect(responseJson2.data.thread.comments).toBeDefined();
      expect(responseJson2.data.thread.comments).toHaveLength(1);
      const comment = responseJson2.data.thread.comments[0];
      expect(comment.content).toEqual('**komentar telah dihapus**');
    });
  });

  // Delete reply
  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    let threadId;
    let accessTokenUser1;
    let accessTokenUser2;
    let commentId;
    let replyId;

    beforeAll(async () => {
      const server = await createServer(container);
      // register user1
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'user1',
          password: 'secret',
          fullname: 'User 1',
        },
      });
      // login user1
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'user1',
          password: 'secret',
        },
      });

      const { data: { accessToken: accessToken1 } } = JSON.parse(loginResponse.payload);
      accessTokenUser1 = accessToken1;

      // register user2
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'user2',
          password: 'secret',
          fullname: 'User 2',
        },
      });
      // login user2
      const loginResponse2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'user2',
          password: 'secret',
        },
      });

      const { data: { accessToken: accessToken2 } } = JSON.parse(loginResponse2.payload);
      accessTokenUser2 = accessToken2;

      // make thread to comment on
      const requestPayload = {
        title: 'this is title',
        body: 'this is body',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUser1}`,
        },
      });
      threadId = JSON.parse(response.payload).data.addedThread.id;

      // add comment from user 2
      const requestPayloadComment = {
        content: 'this is comment content',
      };
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayloadComment,
        headers: {
          Authorization: `Bearer ${accessTokenUser2}`,
        },
      });

      const { data: { addedComment } } = JSON.parse(commentResponse.payload);
      commentId = addedComment.id;

      // add reply from user 1
      const requestPayloadReply = {
        content: 'this is reply content',
      };
      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayloadReply,
        headers: {
          Authorization: `Bearer ${accessTokenUser1}`,
        },
      });
      const { data: { addedReply } } = JSON.parse(replyResponse.payload);
      replyId = addedReply.id;
    });

    afterAll(async () => {
      await ThreadTableTestHelper.cleanTable();
    });

    it('should response 401 when no authentication', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when reply not found', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/xxx`,
        headers: {
          Authorization: `Bearer ${accessTokenUser1}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('reply not found');
    });

    it('should response 403 when reply exists and user is not owner of its reply', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessTokenUser2}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('You are not authorized to delete this reply');
    });

    it('should response 200 when reply exists and user is owner of its reply', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessTokenUser1}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');

      // Action
      const response2 = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson2 = JSON.parse(response2.payload);
      expect(response2.statusCode).toEqual(200);
      expect(responseJson2.status).toEqual('success');
      expect(responseJson2.data.thread).toBeDefined();
      expect(responseJson2.data.thread.comments).toBeDefined();
      expect(responseJson2.data.thread.comments).toHaveLength(1);
      const comment = responseJson2.data.thread.comments[0];
      // console.info(comment);
      const reply = comment.replies[0];
      expect(reply.deletedAt).not.toBeNull();
      expect(reply.content).toEqual('**balasan telah dihapus**');
    });
  });
});
