# Mikrofrontender for pleiepenger, omsorgspenger, opplæringspenger og pleiepenger i livets sluttfase

Disse mikrofrontendene brukes i k9-sak-web i overnevnte ytelser.

## Komme i gang

### Installering av avhengigheter
For å kunne installere @navikt-pakker og publisere pakkeoppdateringer må man opprette en GitHub PAT med kun `write:packages`-tilgang, enable SSO, og putte det i en egen .yarnrc.yml-fil. Legg den i ~/ eller en annen mappe som er høyere opp i mappestrukturen enn dette prosjektet. 
```
npmRegistries:
  https://npm.pkg.github.com:
    npmAlwaysAuth: true
    npmAuthToken: HER_SKAL_DIN_GITHUB_PAT_LIGGE
```


### Kjøre apper lokalt
For å kjøre frontend-appen i utvikling, kjør `yarn` etterfulgt av `yarn build-frontend-modules` på rot. Deretter kan du kjøre `yarn dev` i pakken (f.eks. i packages/om-barnet) du ønsker å kjøre opp.

Utviklingsmiljøet er konfigurert opp med en egen webpack-konfig som hoster `index.html` som ligger på rot i pakkene.
Denne index-filen er kun ment for utvikling.

For enkelthet i utvikling ligger det et eget mockup-api under `/mock` i pakkene som server mockede data, og som
`index.html` på rot i pakken by default konfigurerer frontenden til å gjøre sine api-kall mot. Mockup-apiet kjøres
opp ved å kjøre `yarn api-mock` på rot av pakken.

### Kjøring av alle tester

`yarn test:all` på rot av prosjektet

### Bygging av alle apper

`yarn build` på rot av prosjektet, evt samme kommando i en av pakkene.

Denne kommandoen vil se på `version` spesifisert i `package.json`, opprette en ny katalog under `build`
som samsvarer med det versjonsnummeret, og legge de bygde filene der.

### Kjøring av bygg

`yarn start` kjører opp en server som statisk hoster innholdet under `build`

---

## Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

### For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #sif_pleiepenger.
