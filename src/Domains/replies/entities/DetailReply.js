const isValidDate = require('../../utils/DateChecker');

class DetailReply {
  constructor(payload) {
    DetailReply._verifyPayload(payload);

    const {
      id, comment_id, owner, content, created_at,
    } = payload;
    this.id = id;
    this.commentId = comment_id;
    this.owner = owner;
    this.content = content;
    this.date = created_at;
  }

  static _verifyPayload({
    id, comment_id, owner, content, created_at,
  }) {
    if (!id || !comment_id || !owner || !content || !created_at) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string'
      || typeof comment_id !== 'string'
      || typeof owner !== 'string'
      || typeof content !== 'string'
      || !isValidDate(created_at)
    ) {
      throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailReply;
