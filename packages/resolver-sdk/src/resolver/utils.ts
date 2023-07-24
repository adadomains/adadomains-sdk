import { C, Constr, Credential, Data } from "lucid-cardano";
import { blockchainResources } from "../resources";
import {
  Address,
  Asset,
  AssetType,
  Domain,
  SupportedNetwork,
  AddressDetails,
  AddressType,
  Pointer,
  StakeCredential,
} from "../types";
import { ResolverError } from "./types";

export function fromByteString(str: string): string {
  return new TextDecoder("utf-8").decode(Buffer.from(str, "hex"));
}

function toByteString(str: string): string {
  return Buffer.from(str).toString("hex");
}

function toByteArray(str: string): Uint8Array {
  return Uint8Array.from(Buffer.from(str, "hex"));
}

function isBigintArray(array: any): boolean {
  if (Array.isArray(array)) {
    return array.every((elem) => typeof elem === "bigint");
  }

  return false;
}

export function isStringMap(map: any): boolean {
  if (map instanceof Map) {
    return Array.from(map.entries()).every(([key, value]) => typeof key === "string" && typeof value === "string");
  }

  return false;
}

export function getAssetType(domain: Domain): AssetType {
  return domain.includes(".") ? "Subdomain" : "Domain";
}

export function toAsset(domain: Domain, network: SupportedNetwork): Asset {
  const assetType = getAssetType(domain);
  const resources = blockchainResources[network];
  return (assetType === "Domain" ? resources.domainPolicy : resources.subdomainPolicy) + toByteString(domain);
}

function toCredential(data: Data): Credential {
  if (data instanceof Constr) {
    const { index, fields } = data;
    if (fields.length !== 1 || typeof fields[0] !== "string") {
      throw new ResolverError("Conversion to credential failed");
    }

    if (index === 0) {
      return { type: "Key", hash: fields[0] };
    } else if (index === 1) {
      return { type: "Script", hash: fields[0] };
    }
  }

  throw new ResolverError("Conversion to credential failed");
}

export function toAddressDetails(data: Data): AddressDetails {
  if (data instanceof Constr) {
    const { index, fields } = data;
    if (index === 0 && fields.length === 2) {
      const [paymentCredentialData, maybeStakeCredentialData] = fields;
      const paymentCredential: Credential = toCredential(paymentCredentialData);

      let addressType: AddressType;
      let stakeCredential: StakeCredential | undefined;

      if (maybeStakeCredentialData instanceof Constr) {
        const { index: maybeIndex, fields: maybeFields } = maybeStakeCredentialData;
        if (maybeIndex === 0 && maybeFields.length === 1 && maybeFields[0] instanceof Constr) {
          const { index: stakeIndex, fields: stakeFields } = maybeFields[0];
          if (stakeIndex === 0 && stakeFields.length === 1) {
            addressType = "Base";
            stakeCredential = {
              type: "Hash",
              value: toCredential(stakeFields[0]),
            };
          } else if (stakeIndex === 1 && stakeFields.length === 3 && isBigintArray(stakeFields)) {
            addressType = "Pointer";
            stakeCredential = {
              type: "Pointer",
              value: stakeFields as bigint[],
            };
          } else {
            throw new ResolverError("Conversion to address details failed");
          }
        } else if (maybeIndex === 1 && maybeFields.length === 0) {
          addressType = "Enterprise";
          stakeCredential = undefined;
        } else {
          throw new ResolverError("Conversion to address details failed");
        }
      } else {
        throw new ResolverError("Conversion to address details failed");
      }

      return {
        addressType,
        paymentCredential,
        stakeCredential,
      };
    }
  }

  throw new ResolverError("Conversion to address details failed");
}

export function getNetworkId(network: SupportedNetwork): number {
  // @ts-ignore // TODO uncoment after mainnet support
  return network === "Mainnet" ? 1 : 0;
}

export function toAddress(addressDetails: AddressDetails, network: SupportedNetwork): Address {
  const networkId = getNetworkId(network);
  const { addressType, paymentCredential, stakeCredential } = addressDetails;
  const { type: pcType, hash: pcHash } = paymentCredential;
  if (addressType === "Base") {
    let paymentCred;
    if (pcType === "Key") {
      paymentCred = C.StakeCredential.from_keyhash(C.Ed25519KeyHash.from_bytes(toByteArray(pcHash)));
    } else {
      paymentCred = C.StakeCredential.from_scripthash(C.ScriptHash.from_bytes(toByteArray(pcHash)));
    }

    const { type: scType, hash: scHash } = stakeCredential!.value as Credential;
    let stakeCred;
    if (scType === "Key") {
      stakeCred = C.StakeCredential.from_keyhash(C.Ed25519KeyHash.from_bytes(toByteArray(scHash)));
    } else {
      stakeCred = C.StakeCredential.from_scripthash(C.ScriptHash.from_bytes(toByteArray(scHash)));
    }

    return C.BaseAddress.new(networkId, paymentCred, stakeCred).to_address().to_bech32(undefined);
  }

  if (addressType === "Pointer") {
    let paymentCred;
    if (pcType === "Key") {
      paymentCred = C.StakeCredential.from_keyhash(C.Ed25519KeyHash.from_bytes(toByteArray(pcHash)));
    } else {
      paymentCred = C.StakeCredential.from_scripthash(C.ScriptHash.from_bytes(toByteArray(pcHash)));
    }

    const [slot, txIndex, certIndex] = stakeCredential!.value as Pointer;
    const pointer = C.Pointer.new(
      C.BigNum.from_str(slot.toString()),
      C.BigNum.from_str(txIndex.toString()),
      C.BigNum.from_str(certIndex.toString())
    );

    return C.PointerAddress.new(networkId, paymentCred, pointer).to_address().to_bech32(undefined);
  }

  if (addressType === "Enterprise") {
    let paymentCred;
    if (pcType === "Key") {
      paymentCred = C.StakeCredential.from_keyhash(C.Ed25519KeyHash.from_bytes(toByteArray(pcHash)));
    } else {
      paymentCred = C.StakeCredential.from_scripthash(C.ScriptHash.from_bytes(toByteArray(pcHash)));
    }

    return C.EnterpriseAddress.new(networkId, paymentCred).to_address().to_bech32(undefined);
  }

  throw new ResolverError("Conversion to address failed");
}
