const isValidDate = require('../../utils/DateChecker');

class DetailComment {
  constructor(payload) {
    DetailComment._verifyPayload(payload);

    const {
      id, thread_id, owner, content, created_at,
    } = payload;
    this.id = id;
    this.threadId = thread_id;
    this.owner = owner;
    this.content = content;
    this.date = created_at;
  }

  static _verifyPayload({
    id, thread_id, owner, content, created_at,
  }) {
    if (!id || !thread_id || !owner || !content || !created_at) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string'
      || typeof thread_id !== 'string'
      || typeof owner !== 'string'
      || typeof content !== 'string'
      || !isValidDate(created_at)
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
