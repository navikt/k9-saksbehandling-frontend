![Bygg og deploy](https://github.com/navikt/omsorgspenger-visning-web/workflows/Bygg%20og%20deploy/badge.svg)

# omsorgspenger-visning-web

Frontend for visning av omsorgspenger-informasjon knyttet til en person, deriblant
- rammemeldinger
- rammevedtak (ikke implementert)
- barn (ikke implementert)
- årskvantum (ikke implementert)

## Komme i gang
For å kjøre opp applikasjonen lokalt:
````
yarn install
yarn start
````

## Enhetstester
````
yarn test
````

## Feature-toggles
Feature-toggles legges til som miljøvariabler i [.env.local](.env.local) og [.env.production](.env.production) samt i `getClientEvironment()` i [config/env.js](config/env.js).

## Lisens
Se [LICENSE.md](LICENSE.md).

## Ikoner
Dette prosjektet bruker Streamline Icons. Ved videre bruk av dette prosjektet, se https://streamlineicons.com/ux/extended-license.html.

## For NAV-ansatte
Interne henvendelser kan sendes via Slack i kanalen **k9sak-frontend-tech**.
