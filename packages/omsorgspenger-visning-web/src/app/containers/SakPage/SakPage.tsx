import DokumenterContainer from 'app/containers/Dokumenter/DokumenterContainer';
import KoronaverføringerContainer from 'app/containers/Koronaverforinger/KoronaoverforingerContainer';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import AppContainer from '../../components/AppContainer/AppContainer';
import ContentContainer from '../../components/ContentContainer/ContentContainer';
import BarnContainer from '../Barn/BarnContainer';
import { FordelingerContainer } from '../Fordelinger/FordelingerContainer';
import KvoteContainer from '../Kvote/KvoteContainer';
import OverføringerContainer from '../Overforinger/OverforingerContainer';
import UidentifiserteRammemeldingerContainer
  from '../UidentifiserteRammemeldinger/UidentifiserteRammemeldingerContainer';
import PersonKort from "../PersonKort/PersonKort";

const SakPage: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const { saksnummer } = useParams<string>();
  
  const skalKomponentVises = (property: string) => {
    if(typeof process.env[property] !== undefined && process.env[property] === 'true'){
      return true;
    }
    return false;
  };



  const kolonne1 = <>
    {skalKomponentVises("TOGGLE_KVOTE") && saksnummer && <KvoteContainer saksnummer={saksnummer}/>}
    {saksnummer && <OverføringerContainer saksnummer={saksnummer}/>}
    {saksnummer && <KoronaverføringerContainer saksnummer={saksnummer}/>}
    {skalKomponentVises("TOGGLE_FORDELINGER") && saksnummer && <FordelingerContainer saksnummer={saksnummer}/>}
    {skalKomponentVises("TOGGLE_BARN") && saksnummer && <BarnContainer saksnummer={saksnummer}/>}
  </>;

  const kolonne2 = <>
      {skalKomponentVises("TOGGLE_DOKUMENTER") && saksnummer && <DokumenterContainer saksnummer={saksnummer}/>}
      {skalKomponentVises("TOGGLE_UIDENTIFISERTE_RAMMEMELDINGER") && saksnummer && <UidentifiserteRammemeldingerContainer saksnummer={saksnummer} />}
  </>;

  const skalViseBeggeKolonner = skalKomponentVises("TOGGLE_DOKUMENTER") || skalKomponentVises("TOGGLE_UIDENTIFISERTE_RAMMEMELDINGER");

  return (
    <>
      <Helmet>
        <title>{t('homeTitle')}</title>
        <meta name="description" content={t('homepage.descr')} />
      </Helmet>
      <AppContainer>
        {saksnummer && <PersonKort saksnummer={saksnummer}/>}
        <ContentContainer {...{skalViseBeggeKolonner}}>
          {skalViseBeggeKolonner
            ? <><div>{kolonne1}</div><div>{kolonne2}</div></>
            : kolonne1}
        </ContentContainer>
      </AppContainer>
    </>
  );
};

export default SakPage;
