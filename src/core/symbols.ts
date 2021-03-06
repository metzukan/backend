import { User } from '../models';
import 'express';

declare module 'express' {
  export interface Request {
    signedInfo?: SignedInfo;
  }
}

export enum UserStatus {
  OK = 'OK',
  NOT_RESPONDING = 'NOT_RESPONDING',
  EMERGENCY = 'EMERGENCY'
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

export interface UserOnDemandStoredInfo {
  userPingInfo?: UserPingInfo;
  userSignInfo?: UserSignInfo;
}

export interface UserSignInfo {
  firstName: string;
  lastName: string;
  address: string;
  freeText?: string;
  contacts: UserContact[];
}

export interface UserPingInfo {
  coordinates?: {
    N: string;
    E: string;
  };
  nextAck: number;
  status: UserStatus;
}

export interface SignedInfo {
  userGuid: string;
  userSignInfo: UserSignInfo;
}
