class ItemReply {
  constructor(payload) {
    ItemReply._verifyPayload(payload);

    const {
      id, commentId, username, date, content, deletedAt = null,
    } = payload;

    this.id = id;
    this.commentId = commentId;
    this.username = username;
    this.date = date;
    this.content = content;
    this.deletedAt = deletedAt;
  }

  static _verifyPayload({
    id, commentId, username, date, content, deletedAt,
  }) {
    if (!id || !commentId || !username || !date || !content) {
      throw new Error('ITEM_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof commentId !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string' || (deletedAt !== null && deletedAt !== undefined && typeof deletedAt !== 'string')) {
      throw new Error('ITEM_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ItemReply;
