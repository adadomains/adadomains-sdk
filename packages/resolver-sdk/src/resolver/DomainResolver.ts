import { CustomAttribute, PredefinedAttribute } from "../types";
import { DomainResolvedMultipleOption, DomainResolvedSingleOption, DomainResolverOption } from "./types";

export interface DomainResolver {
  resolvePredefinedAttribute: (options: DomainResolvedSingleOption) => Promise<PredefinedAttribute | undefined>;
  resolvePredefinedAttributes: (options: DomainResolvedMultipleOption) => Promise<Array<PredefinedAttribute>>;
  resolveCustomAttribute: (options: DomainResolvedSingleOption) => Promise<CustomAttribute | undefined>;
  resolveCustomAttributes: (options: DomainResolvedMultipleOption) => Promise<Array<CustomAttribute>>;
  resolveToUri: (options: DomainResolverOption) => Promise<string | undefined>;
  resolveToCardanoAddress: (options: DomainResolverOption) => Promise<string>;
  resolveAllAttributes: (
    options: DomainResolvedMultipleOption
  ) => Promise<Array<CustomAttribute | PredefinedAttribute>>;
}
