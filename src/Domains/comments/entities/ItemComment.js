class ItemComment {
  constructor({
    id, username, date, content, likeCount = 0, deletedAt = null, replies = [],
  }) {
    ItemComment._verifyPayload({
      id, username, date, content, deletedAt, replies, likeCount,
    });

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = content;
    this.likeCount = likeCount;
    this.deletedAt = deletedAt;
    this.replies = replies;
  }

  static _verifyPayload({
    id, username, date, content, deletedAt, replies, likeCount,
  }) {
    if (!id || !username || !date || !content || !replies) {
      throw new Error('ITEM_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string' || (deletedAt !== null && deletedAt !== undefined && typeof deletedAt !== 'string') || !Array.isArray(replies) || (likeCount !== null && likeCount !== undefined && !Number.isFinite(likeCount))) {
      throw new Error('ITEM_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ItemComment;
