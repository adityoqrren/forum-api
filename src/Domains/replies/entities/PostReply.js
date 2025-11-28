class PostReply {
  constructor(payload) {
    PostReply._verifyPayload(payload);

    const { commentId, owner, content } = payload;

    this.commentId = commentId;
    this.owner = owner;
    this.content = content;
  }

  static _verifyPayload({ commentId, owner, content }) {
    if (!commentId || !owner || !content) {
      throw new Error('POST_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentId !== 'string' || typeof owner !== 'string' || typeof content !== 'string') {
      throw new Error('POST_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (commentId.trim().length === 0 || owner.trim().length === 0 || content.trim().length === 0) {
      throw new Error('POST_REPLY.EMPTY_VALUE');
    }
  }
}

module.exports = PostReply;
