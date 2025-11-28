const isValidDate = require('../../utils/DateChecker');

class DetailThreadRow {
  constructor({
    id, title, body, date, username,
  }) {
    DetailThreadRow._verifyPayload({
      id, title, body, date, username,
    });

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
  }

  static _verifyPayload({
    id, title, body, date, username,
  }) {
    if (!id || !title || !body || !date || !username) {
      throw new Error('DETAIL_THREAD_ROW.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string'
      || typeof title !== 'string'
      || typeof body !== 'string'
      || !isValidDate(date)
      || typeof username !== 'string'
    ) {
      throw new Error('DETAIL_THREAD_ROW.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailThreadRow;
