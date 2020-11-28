import * as express from 'express';
import * as jwt from 'jsonwebtoken';

import { logger, SignedInfo, Scope } from '../core';
import { apiKey, jwtSecret } from '../controllers/users-controller';
import { API_KEY_HEADER, TOKEN_HEADER, TOKEN_HEADER_PREFIX } from '../core/config';

/**
 * Cert Authentication middleware API.
 * the key should be the 'reporterKey' property in the body.
 */
export const expressAuthentication = async (request: express.Request, scopes: Scope[]) => {
  return expressAuthenticationSync(request, scopes);
};

export const expressAuthenticationSync = (request: express.Request, scopes: Scope[]) => {
  /** If the routing security sent wrong security scope. */
  if (!scopes || scopes.length < 1) {
    logger.error('invalid or empty security scope');
    throw new Error('scope check fail');
  }

  // If it's a user scope, check the JWT
  if (scopes.includes(Scope.USER)) {
    const jwtToken = request.header(TOKEN_HEADER).replace(TOKEN_HEADER_PREFIX, '');

    // TODO: check against a blacklist of valid token that should block.
    const signedInfo = jwt.verify(jwtToken, jwtSecret) as SignedInfo;

    return signedInfo;
  }

  // If it's a admin scope check the admin api-key
  if (scopes.includes(Scope.ADMIN) && apiKey === request.header(API_KEY_HEADER)) {
    return;
  }

  throw new Error("You don't have authorization to access resources");
};
