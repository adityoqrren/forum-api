class AuthenticationTokenManager {
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  async createRefreshToken(payload) {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  async createAccessToken(payload) {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  async verifyRefreshToken(token) {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  async decodePayload() {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = AuthenticationTokenManager;
