import { User } from 'src/models';

import 'express';
declare module 'express' {
  export interface Request {
    signedInfo?: SignedInfo;
  }
}

export interface ObjectKeyMap<T = string> {
  [key: string]: T;
}

export enum Scope {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface UserContact {
  name: string;
  mail: string;
}

export interface UserCreation {
  userConstInfo: User;
  userSignInfo: UserSignInfo;
}

export interface UserOnDemandInfo {
  userPingInfo?: UserPingInfo;
  userSignInfo: UserSignInfo;
}

export interface UserSignInfo {
  firstName: string;
  lastName: string;
  address: string;
  freeText: string;
  contacts: UserContact[];
}

export interface UserPingInfo {
  coordinates: {
    N: string;
    E: string;
  };
  nextAck: number;
  status: 'OK' | 'NOT_RESPONDING' | 'EMERGENCY';
}

export interface SignedInfo {
  userGuid: string;
  userSignInfo: UserSignInfo;
}
