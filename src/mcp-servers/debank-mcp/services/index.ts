/**
 * DeBank Services
 * Exports singleton instances of all domain-specific services
 */

import { ChainService } from "./chain.service";
import { ProtocolService } from "./protocol.service";
import { TokenService } from "./token.service";
import { TransactionService } from "./transaction.service";
import { UserService } from "./user.service";

export { BaseService } from "./base.service";
export { ChainService } from "./chain.service";
export { ProtocolService } from "./protocol.service";
export { TokenService } from "./token.service";
export { TransactionService } from "./transaction.service";
export { UserService } from "./user.service";

// Create singleton instances
export const chainService = new ChainService();
export const protocolService = new ProtocolService();
export const tokenService = new TokenService();
export const transactionService = new TransactionService();
export const userService = new UserService();
