# [Resolver SDK](https://github.com/adadomains/adadomains-sdk/blob/master/packages/resolver-sdk/README.MD)

[Adadomains resolver SDK](https://github.com/adadomains/adadomains-sdk/blob/master/packages/resolver-sdk/README.MD) is a TypeScript library which allows you to query on-chain domain attributes from [adadomains](https://adadomains.io) project

## Install

[![npm](https://img.shields.io/npm/v/@adadomains/resolver-sdk)](https://www.npmjs.com/package/@adadomains/resolver-sdk)

```shell
npm i @adadomains/resolver-sdk
```

## Usage


```typescript

import { BlockfrostProvider, AdaDomainsResolver } from '@adadomains/resolver-sdk'
import type { Provider, DomainResolver, PredefinedAttribute, CustomAttribute } from '@adadomains/resolver-sdk'


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

const filteredPredefinedAttributes: Array<PredefinedAttribute>= await domainResolver.resolvePredefinedAttributes({
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


console.log(allAttributes)
```

