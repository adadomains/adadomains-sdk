import { Datum, SupportedNetwork } from "../types";
import { PartialRecord, RequireAtLeastOne } from "../utils";

export type BlockfrostConfig = {
  baseUrl: string;
  projectId: string;
};

export type BlockFrostProviderConfig = RequireAtLeastOne<PartialRecord<SupportedNetwork, BlockfrostConfig>>;

export type BlockfrostResponse = {
  inline_datum: Datum;
};
export class ProviderError extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}
