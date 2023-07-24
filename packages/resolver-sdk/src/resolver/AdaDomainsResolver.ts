import { Constr, Data } from "lucid-cardano";
import {
  attributeMapping,
  AttributeName,
  attributeNames,
  CustomAttribute,
  CustomAttributeName,
  customPrefix,
  Domain,
  DomainDatum,
  OnChainAttributeName,
  onChainAttributeNames,
  PredefinedAttribute,
  SupportedNetwork
} from "../types";
import { fromByteString, getAssetType, isStringMap, toAddress, toAddressDetails, toAsset } from "./utils";
import { recordKeys } from "../utils";
import { DomainResolver } from "./DomainResolver";
import { Provider } from "../provider";
import { DomainResolvedMultipleOption, DomainResolvedSingleOption, DomainResolverOption, ResolverError } from "./types";

export class AdaDomainsResolver implements DomainResolver {
  private provider: Provider;

  constructor(provider: Provider) {
    this.provider = provider;
  }

  async toDomainDatum(domain: Domain, network: SupportedNetwork): Promise<DomainDatum> {
    if (domain.endsWith(".ada")) {
      domain = domain.substring(0, domain.length - 4);
    }

    const datum = await this.provider.getDatum(toAsset(domain, network), getAssetType(domain), network);
    const plutusData = Data.from(datum);

    const domainDatum: DomainDatum = {};
    if (plutusData instanceof Constr) {
      const { index, fields } = plutusData;
      if (index === 0 && fields.length >= 2) {
        const addressData = fields[0];
        const attributesData = fields[1];
        if (isStringMap(attributesData)) {
          Array.from((attributesData as Map<string, string>).entries()).forEach(([name, value]) => {
            domainDatum[fromByteString(name)] = fromByteString(value);
          });

          domainDatum["addr.ada"] = toAddress(toAddressDetails(addressData), network);
          return domainDatum;
        }
      }
    }
    throw new ResolverError("Conversion to domain datum failed");
  }

  private _resolvePredefinedAttributes(domainDatum: DomainDatum): PredefinedAttribute[] {
    return onChainAttributeNames
      .filter((onChainAtt) => Object.hasOwn(domainDatum, onChainAtt))
      .map((presentKey: OnChainAttributeName) => {
        const attributeName: AttributeName = attributeNames.find(
          (v: AttributeName) => attributeMapping[v] === presentKey
        ) as AttributeName;
        return {
          onChainValue: domainDatum[presentKey],
          type: "Predefined",
          onChainKey: presentKey,
          attributeName
        };
      });
  }

  private _resolveCustomAttributes(domainDatum: DomainDatum): Array<CustomAttribute> {
    return recordKeys(domainDatum)
      .filter((domainKey) => Object.hasOwn(domainDatum, domainKey) && domainKey.startsWith(customPrefix))
      .map((domKey) => {
        return {
          onChainValue: domainDatum[domKey] as string,
          type: "Custom",
          onChainKey: domKey as CustomAttributeName
        };
      });
  }

  async resolvePredefinedAttribute(options: DomainResolvedSingleOption): Promise<PredefinedAttribute | undefined> {
    const predefinedAttributes = await this.resolvePredefinedAttributes({
      domain: options.domain,
      attributes: [options.attribute],
      network: options.network
    });
    return predefinedAttributes[0];
  }

  async resolveCustomAttributes(options: DomainResolvedMultipleOption): Promise<Array<CustomAttribute>> {
    const domainDatum = await this.toDomainDatum(options.domain, options.network);
    const resolvedAttributes = this._resolveCustomAttributes(domainDatum);
    if (options.attributes) {
      return resolvedAttributes.filter((resolvedAttribute: CustomAttribute) =>
        options.attributes?.includes(resolvedAttribute?.onChainKey)
      );
    }
    return resolvedAttributes;
  }

  async resolvePredefinedAttributes(options: DomainResolvedMultipleOption): Promise<Array<PredefinedAttribute>> {
    const domainDatum = await this.toDomainDatum(options.domain, options.network);
    const resolvedAttributes = this._resolvePredefinedAttributes(domainDatum);
    if (options.attributes) {
      return resolvedAttributes.filter((resolvedAttribute: PredefinedAttribute) =>
        options.attributes?.includes(resolvedAttribute.attributeName)
      );
    }
    return resolvedAttributes;
  }

  async resolveCustomAttribute(options: DomainResolvedSingleOption): Promise<CustomAttribute | undefined> {
    const customAttributes = await this.resolveCustomAttributes(options);
    return customAttributes[0];
  }

  async resolveAllAttributes(
    options: DomainResolvedMultipleOption
  ): Promise<Array<CustomAttribute | PredefinedAttribute>> {
    const domainDatum = await this.toDomainDatum(options.domain, options.network);
    const predefinedAttributes = this._resolvePredefinedAttributes(domainDatum);
    const customAttributes = this._resolvePredefinedAttributes(domainDatum);
    return [...predefinedAttributes, ...customAttributes];
  }

  async resolveToCardanoAddress(options: DomainResolverOption): Promise<string> {
    const result = await this.resolvePredefinedAttribute({ attribute: "address.ada", ...options });
    return result?.onChainValue as string;
  }

  async resolveToUri(options: DomainResolverOption): Promise<string | undefined> {
    const result = await this.resolvePredefinedAttributes({ attributes: ["web.ipfs", "web.url"], ...options });
    const resolvedIpfs = result.find(r => r.attributeName === "web.ipfs");
    const resolvedUri = result.find(r => r.attributeName === "web.url");
    if (resolvedIpfs) {
      return resolvedIpfs.onChainValue;
    }
    return resolvedUri?.onChainValue;
  }
}
