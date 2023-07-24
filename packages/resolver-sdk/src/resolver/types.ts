import { AttributeName, CustomAttributeName, Domain, SupportedNetwork } from "../types";

export class ResolverError extends Error {}

type AttributeNameType = AttributeName | CustomAttributeName;
export type DomainResolverOption = { network: SupportedNetwork; domain: Domain };
export type DomainResolvedSingleOption = {
  attribute: AttributeNameType;
} & DomainResolverOption;
export type DomainResolvedMultipleOption = {
  attributes?: Array<AttributeNameType>;
} & DomainResolverOption;
