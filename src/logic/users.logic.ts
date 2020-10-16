import {
  logger,
  sendEmergencyMail,
  sendNotRespondingMail,
  UserPingInfo,
  UserSignInfo
} from '../core';
import { getUserById } from '../data';

export async function handleNotResponding(userGuid: string) {
  try {
    const user = await getUserById(userGuid);
    await sendNotRespondingMail(user);
  } catch (error) {
    logger.error(
      `[handleNotResponding] failed read user info and send not responding email ${
        error.message
      }`
    );
  }
}

export async function handleEmergency(
  userGuid: string,
  userPingInfo: UserPingInfo,
  userSignInfo: UserSignInfo
) {
  try {
    const user = await getUserById(userGuid);
    await sendEmergencyMail(user, userPingInfo, userSignInfo);
  } catch (error) {
    logger.error(
      `[handleEmergency] failed read user info and send emergency email ${error.message}`
    );
  }
}
