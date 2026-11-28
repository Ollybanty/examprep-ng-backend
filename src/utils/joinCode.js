import { randomInt } from 'node:crypto';
import { RULES } from './constants.js';

// No 0, O, 1 or I, so codes are easy to read out loud. 32 characters, about a billion codes.
export const JOIN_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

// Uniqueness is left to the index on Class.join_code
export function generateJoinCode(length = RULES.JOIN_CODE_LENGTH) {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += JOIN_CODE_ALPHABET[randomInt(JOIN_CODE_ALPHABET.length)];
  }
  return code;
}
