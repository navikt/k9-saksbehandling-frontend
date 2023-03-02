import { LoadingIndicator } from 'app/components/LoadingIndicator';
import RammemeldingOverskrift from 'app/components/RammemeldingOverskrift/RammemeldingOverskrift';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { apiRoutes } from 'utils/http/apiConfig';
import useGet from 'utils/http/useGet';
import ChatbubbleQuestionIcon from '../../components/icons/ChatbubbleQuestionIcon';
import UidentifiserteRammemeldinger from './UidentifisertRammemelding';

interface Props {
  saksnummer: string;
}

const UidentifiserteRammemeldingerContainer: React.FunctionComponent<Props> = ({
  saksnummer,
}) => {
  const {t} = useTranslation();

  const {data, error, loading} =
    useGet(`${apiRoutes().UidentifiserteRammemeldinger}?saksnummer=${saksnummer}`);

  const errorStatus = error?.response?.status;

  return (
    <>
      <RammemeldingOverskrift>
        <ChatbubbleQuestionIcon/>
        {t('uidentifiserteRammemeldinger.overskrift')}
      </RammemeldingOverskrift>
      {loading && <LoadingIndicator/>}
      {error && <p>
        {errorStatus === 404
          ? t('sak.feil.404', {saksnummer})
          : t('sak.feil.ukjent')}
      </p>}
      {data !== null && <UidentifiserteRammemeldinger rammemelding={data}/>}
    </>
  );
};

export default UidentifiserteRammemeldingerContainer;
