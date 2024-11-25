import assert from 'node:assert';
import { AppError, AppErrorCode } from './AppError.js';

/**
 * Asserts a condition and throws an AppError if the condition is falsy.
 */
const appAssert = (condition, httpStatusCode, message, appErrorCode) => {
  // Check if the condition is falsy and throw an AppError if so
  if (!condition) {
    throw new AppError(httpStatusCode, message, appErrorCode);
  }
};

export default appAssert;
