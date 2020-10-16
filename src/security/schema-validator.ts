import * as Joi from 'joi';
import { UserStatus } from '../core';

export const userSchema = Joi.object({
  guid: Joi.string().allow(''),
  selfEmail: Joi.string()
    .email()
    .max(150)
    .required(),
  nickname: Joi.string()
    .max(100)
    .required(),
  nextAck: Joi.number()
    .min(1)
    .integer(),
  status: Joi.string().valid(UserStatus.OK, UserStatus.NOT_RESPONDING, UserStatus.EMERGENCY)
});

export const userContactSchema = Joi.object({
  name: Joi.string()
    .max(150)
    .required(),
  mail: Joi.string()
    .email()
    .max(150)
    .required()
});

export const userSignInfoSchema = Joi.object({
  firstName: Joi.string()
    .max(150)
    .required(),
  lastName: Joi.string()
    .max(150)
    .required(),
  address: Joi.string()
    .max(150)
    .required(),
  freeText: Joi.string()
    .max(600)
    .allow(''),
  contacts: Joi.array()
    .items(userContactSchema)
    .required()
});

export const userCreationSchema = Joi.object({
  userConstInfo: userSchema.required(),
  userSignInfo: userSignInfoSchema.required()
});
