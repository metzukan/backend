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
import {
  sendEmergencyMail,
  sendMail,
  sendNotRespondingMail,
  UserOnDemandInfo,
  UserPingInfo,
  usersOnDemandInfo,
  UserStatus
} from '../core';
import { getUserById, updateUser } from '../data';
import { handleEmergency, handleNotResponding } from '../logic';

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

    const currUserInfo: UserOnDemandInfo = {};
    currUserInfo.userPingInfo = userPingInfo;
    // If the status is not OK keep the user contacts info in the on-demand cache
    // but if it's OK, override the info if exists
    if (userPingInfo.status === UserStatus.OK) {
      currUserInfo.userSignInfo = userSignInfo;
    }
    await usersOnDemandInfo.set(userGuid, currUserInfo);

    if (userPingInfo.status === UserStatus.NOT_RESPONDING) {
      // run the not responding action in the background
      handleNotResponding(userGuid);
    }

    if (userPingInfo.status === UserStatus.EMERGENCY) {
      // run the emergency action in the background
      handleEmergency(userGuid, userPingInfo, userSignInfo);
    }

    await updateUser(userGuid, { nextAck, status });
  }
}
