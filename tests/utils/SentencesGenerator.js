const { LoremIpsum } = require('lorem-ipsum');

const lorem = new LoremIpsum();

const generateLoremByChar = (maxLength) => {
  // Estimate: 1 word is roughly 5-7 characters long.
  // Use 2x the maxLength to ensure enough text is generated.
  const estimatedWords = maxLength * 2;

  // 1. Generate text guaranteed to be longer than the maximum length
  const fullText = lorem.generateWords(estimatedWords);

  // 2. Slice the text to the exact character limit
  const finalText = fullText.slice(0, maxLength);

  return finalText;
};

// console.log(generateLoremByChar(80));

module.exports = generateLoremByChar;
