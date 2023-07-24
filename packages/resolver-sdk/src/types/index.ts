import { Credential } from "lucid-cardano";
import { recordEntries, recordKeys } from "../utils";

export type Asset = string;
export type AssetType = "Domain" | "Subdomain";
export type Domain = string;
export type Datum = string;

export const attributeMapping = {
  "address.ada": "addr.ada",
  "address.btc": "addr.btc",
  "address.eth": "addr.eth",
  "contact.email": "con.mail",
  "contact.mobile": "con.mobi",
  "socials.discord.invitelink": "soc.dsc.inv",
  "socials.discord.username": "soc.dsc.usr",
  "socials.instagram": "soc.ig",
  "socials.telegram.sharelink": "soc.tel.shr",
  "socials.telegram.username": "soc.tel.usr",
  "socials.tiktok": "soc.tktk",
  "socials.twitter": "soc.twtr",
  "socials.youtube": "soc.yt",
  "web.url": "web.url",
  "web.ipfs": "web.ipfs",
} as const;

export const attributeNames = recordKeys(attributeMapping);

export const onChainAttributeNames = recordEntries(attributeMapping);
export type AttributeName = (typeof attributeNames)[number];
export type OnChainAttributeName = (typeof onChainAttributeNames)[number];
export const customPrefix = "cus.";
export type CustomAttributeName = `${typeof customPrefix}${string}`;

export type AttributeType = "Predefined" | "Custom";

export interface Attribute {
  type: AttributeType;
  onChainValue: string;
}

export interface PredefinedAttribute extends Attribute {
  type: "Predefined";
  attributeName: AttributeName;
  onChainKey: OnChainAttributeName;
  onChainValue: string;
}

export interface CustomAttribute extends Attribute {
  type: "Custom";
  onChainKey: CustomAttributeName;
  onChainValue: string;
}

export type SupportedNetwork = "Preprod" | "Mainnet"
export type Address = string;
export type Policy = string;

export type BlockchainResources = {
  domainAddress: Address;
  domainPolicy: Policy;
  subdomainAddress: Address;
  subdomainPolicy: Policy;
};

export type DomainDatum = Record<string, string>;

export type AddressType = "Base" | "Enterprise" | "Pointer";

export type Pointer = bigint[];

export type StakeCredential = {
  type: "Hash" | "Pointer";
  value: Credential | Pointer;
};

export type AddressDetails = {
  addressType: AddressType;
  paymentCredential: Credential;
  stakeCredential?: StakeCredential;
};
