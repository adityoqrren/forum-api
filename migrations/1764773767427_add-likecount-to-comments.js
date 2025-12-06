exports.up = (pgm) => {
  pgm.addColumn('comments', {
    like_count: {
      type: 'integer',
      notNull: true,
      default: 0,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('comments', 'like_count');
};
