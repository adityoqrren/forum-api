const ItemComment = require('../../Domains/comments/entities/ItemComment');
const ItemReply = require('../../Domains/replies/entities/ItemReply');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const detailThread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const repliesByThread = await this._replyRepository.getRepliesByThreadId(threadId);
    const detailThreadFormatted = new DetailThread({
      ...detailThread,
      date: detailThread.date.toISOString(),
    });
    const formattedComments = comments.map((comment) => (new ItemComment({
      ...comment,
      date: comment.date.toISOString(),
      content: comment.deleted_at ? '**komentar telah dihapus**' : comment.content,
      likeCount: comment.like_count,
      replies: repliesByThread
        .filter((reply) => reply.comment_id === comment.id)
        .map((reply) => new ItemReply({
          ...reply,
          commentId: reply.comment_id,
          date: reply.created_at.toISOString(),
          content: (comment.deleted_at || reply.deleted_at) ? '**balasan telah dihapus**' : reply.content,
          deletedAt: reply.deleted_at ? reply.deleted_at.toISOString() : null,
        })),
      deletedAt: comment.deleted_at ? comment.deleted_at.toISOString() : null,
    })));
    detailThreadFormatted.comments = formattedComments;
    return detailThreadFormatted;
  }
}

module.exports = GetDetailThreadUseCase;
