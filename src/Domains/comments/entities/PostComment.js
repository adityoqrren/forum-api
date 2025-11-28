class PostComment {
  constructor(payload) {
    PostComment._verifyPayload(payload);

    const { threadId, owner, content } = payload;

    this.threadId = threadId;
    this.owner = owner;
    this.content = content;
  }

  static _verifyPayload({ threadId, owner, content }) {
    if (!threadId || !owner || !content) {
      throw new Error('POST_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string' || typeof owner !== 'string' || typeof content !== 'string') {
      throw new Error('POST_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (threadId.trim().length === 0 || owner.trim().length === 0 || content.trim().length === 0) {
      throw new Error('POST_COMMENT.EMPTY_VALUE');
    }
  }
}

module.exports = PostComment;
