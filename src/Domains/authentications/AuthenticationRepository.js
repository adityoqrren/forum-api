class AuthenticationRepository {
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  async addToken(token) {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  async checkAvailabilityToken(token) {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  async deleteToken(token) {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = AuthenticationRepository;
