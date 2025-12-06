class PostCommentLike {
  constructor(payload) {
    PostCommentLike._verifyPayload(payload);

    const { commentId, userId } = payload;

    this.commentId = commentId;
    this.userId = userId;
  }

  static _verifyPayload({ commentId, userId }) {
    if (!commentId || !userId) {
      throw new Error('POST_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentId !== 'string' || typeof userId !== 'string') {
      throw new Error('POST_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (commentId.trim().length === 0 || userId.trim().length === 0) {
      throw new Error('POST_COMMENT_LIKE.EMPTY_VALUE');
    }
  }
}

module.exports = PostCommentLike;
