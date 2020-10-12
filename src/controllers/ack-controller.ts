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
import * as express from 'express';
import { UserOnDemandInfo, UserPingInfo, usersOnDemandInfo, UserStatus } from '../core';
import { updateUser } from '../data';

@Tags('Ack')
@Route('/ack')
export class ackController extends Controller {
  @Security('USER')
  @Response(501, 'Server error')
  @Response(401, 'Authentication fail')
  @Post()
  public async ack(
    @Request() request: express.Request,
    @Body() userPingInfo: UserPingInfo
  ): Promise<void> {
    const { userGuid, userSignInfo } = request.signedInfo;

    const { nextAck, status } = userPingInfo;

    await updateUser(userGuid, { nextAck, status });

    const currUserInfo: UserOnDemandInfo = {};
    currUserInfo.userPingInfo = userPingInfo;
    // If the status is not OK keep the user contacts info in the on-demand cache
    // but if it's OK, override the info if exists
    if (userPingInfo.status === UserStatus.OK) {
      currUserInfo.userSignInfo = userSignInfo;
    }
    await usersOnDemandInfo.set(userGuid, currUserInfo);

    if (userPingInfo.status === UserStatus.NOT_RESPONDING) {
      // run the not responding action
    }

    if (userPingInfo.status === UserStatus.EMERGENCY) {
      // run the emergency action ASAP in the background
    }
  }
}
