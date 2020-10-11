import {
  Request,
  Body,
  Controller,
  Delete,
  Post,
  Response,
  Route,
  Security,
  Tags,
  Get
} from 'tsoa';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import * as express from 'express';
import { createUser, deleteUser, getUsers } from '../data';
import {
  SignedInfo,
  TOKEN_HEADER_PREFIX,
  UserCreation,
  UserOnDemandInfo,
  usersOnDemandInfo
} from '../core';
import { User } from '../models';

export interface CreateUserResponse {
  token: string;
}

export const jwtSecret = process.env.JWT_SECRET;
export const apiKey = process.env.API_KEY;
export const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1 year';

// TODO: move this check to some other place?
if (!jwtSecret) {
  console.error('You must set the jwt secret!');
  process.exit();
}
if (!apiKey) {
  console.error('You must set the api-key!');
  process.exit();
}

@Tags('Users')
@Route('/users')
export class usersController extends Controller {
  ///// ADMINS SECTION
  @Security('ADMIN')
  @Response(501, 'Server error')
  @Response(401, 'Authentication fail')
  @Get()
  public async getAllUsers(@Request() request: express.Request): Promise<User[]> {
    return await getUsers();
  }

  @Security('ADMIN')
  @Response(501, 'Server error')
  @Response(401, 'Authentication fail')
  @Delete('{userGuid}')
  public async deleteUserById(userGuid: string): Promise<void> {
    await deleteUser(userGuid);
    await usersOnDemandInfo.set(userGuid, null);
  }

  ///// USERS SECTION

  /**
   * Login to system. returns JWT token.
   * @returns JWT token
   */
  @Response(501, 'Server error')
  @Post()
  public async createUser(@Body() userInfo: UserCreation): Promise<CreateUserResponse> {
    // joi validation\

    const { userConstInfo, userSignInfo } = userInfo;

    const userGuid = uuidv4();
    userConstInfo.guid = userGuid;

    await createUser(userConstInfo);

    await usersOnDemandInfo.set(userGuid, { userSignInfo } as UserOnDemandInfo);

    const signedInfo: SignedInfo = {
      userSignInfo,
      userGuid
    };

    const token = jwt.sign(signedInfo, jwtSecret, { expiresIn: jwtExpiresIn });

    return { token: `${TOKEN_HEADER_PREFIX}${token}` };
  }

  @Security('USER')
  @Response(501, 'Server error')
  @Response(401, 'Authentication fail')
  @Delete()
  public async deleteUser(@Request() request: express.Request): Promise<void> {
    const { userGuid } = request.signedInfo;

    await deleteUser(userGuid);
    await usersOnDemandInfo.set(userGuid, null);
  }
}
