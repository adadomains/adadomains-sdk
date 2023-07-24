import { BlockfrostProvider, Provider } from "../provider";
import { AdaDomainsResolver, DomainResolver } from "../resolver";
import { CustomAttribute, PredefinedAttribute } from "../types";

const provider: Provider = new BlockfrostProvider({
  Preprod: {
    projectId: "<blockfrostProjectId>",
    baseUrl: "<blockfrostBaseUrl>",
  },
});

const domainResolver: DomainResolver = new AdaDomainsResolver(provider);

const predefinedAttributes: Array<PredefinedAttribute> = await domainResolver.resolvePredefinedAttributes({
  domain: "test-domain-1.ada",
  network: "Preprod",
});

const filteredPredefinedAttributes = await domainResolver.resolvePredefinedAttributes({
  domain: "test-domain-1.ada",
  network: "Preprod",
  attributes: ["socials.discord.invitelink", "socials.youtube"],
});

const predefinedAttribute: PredefinedAttribute | undefined = await domainResolver.resolvePredefinedAttribute({
  domain: "test-domain-1.ada",
  network: "Preprod",
  attribute: "socials.discord.invitelink",
});

const customAttributes: Array<CustomAttribute> = await domainResolver.resolveCustomAttributes({
  domain: "test-domain-1.ada",
  network: "Preprod",
});

const customAttribute: CustomAttribute | undefined = await domainResolver.resolveCustomAttribute({
  domain: "test-domain-1.ada",
  network: "Preprod",
  attribute: "cus.mycustomkey",
});

const allAttributes: Array<PredefinedAttribute | CustomAttribute> = await domainResolver.resolveAllAttributes({
  domain: "test-domain-1.ada",
  network: "Preprod",
});

const cardanoAddress: string = await domainResolver.resolveToCardanoAddress({
  domain: "test-domain-1.ada",
  network: "Preprod"
});
const uri: string | undefined = await domainResolver.resolveToUri({
  domain: "test-domain-1.ada",
  network: "Preprod"
});