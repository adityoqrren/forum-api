const autoBind = require('auto-bind');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');
const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase');
const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postThreadHandler(request, h) {
    const { title, body } = request.payload;
    const { id: owner } = request.auth.credentials;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute({
      title, body, owner,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async postThreadCommentHandler(request, h) {
    const { threadId } = request.params;
    const { content } = request.payload;
    const { id: owner } = request.auth.credentials;
    // check if thread is available or not
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute({
      threadId, owner, content,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async postReplyCommentHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { content } = request.payload;
    const { id: owner } = request.auth.credentials;
    // check if thread is available or not
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute({
      threadId, commentId, owner, content,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadById(request, h) {
    const { threadId } = request.params;
    // check if thread is available or not
    const getThreadDetailUseCase = this._container.getInstance(GetDetailThreadUseCase.name);
    const thread = await getThreadDetailUseCase.execute(threadId);
    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    return response;
  }

  async likeOrUnlikeCommentHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: userId } = request.auth.credentials;
    const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);
    await likeCommentUseCase.execute({ threadId, commentId, userId });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }

  async deleteThreadCommentHandler(request, h) {
    const { commentId } = request.params;
    const { id: owner } = request.auth.credentials;
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute({ commentId, owner });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }

  async deleteReplyCommentHandler(request, h) {
    const { replyId } = request.params;
    const { id: owner } = request.auth.credentials;
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    await deleteReplyUseCase.execute({ replyId, owner });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
