import { TransferArrowsIcon } from 'app/components/icons';
import { LoadingIndicator } from 'app/components/LoadingIndicator';
import Overføringer from 'app/components/Overforinger/Overforinger';
import RammemeldingOverskrift from 'app/components/RammemeldingOverskrift/RammemeldingOverskrift';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { apiRoutes } from 'utils/http/apiConfig';
import useGet from 'utils/http/useGet';

interface Props {
  saksnummer: string;
}

const KoronaverføringerContainer: React.FunctionComponent<Props> = ({
  saksnummer,
}) => {
  const { t } = useTranslation();

  const { data, error, loading } =
    useGet(`${apiRoutes().Koronaoverføringer}?status=Aktiv&saksnummer=${saksnummer}`);

  const errorStatus = error?.response?.status;

  return (
    <>
      <RammemeldingOverskrift>
        <TransferArrowsIcon/>
        {t('koronaoverføringer.overskrift')}
      </RammemeldingOverskrift>
      {loading && <LoadingIndicator/>}
      {error && <p>
        {errorStatus === 404
          ? t('sak.feil.404', {saksnummer})
          : t('sak.feil.ukjent')}
      </p>}
      {data !== null && <Overføringer overføringer={data} />}
    </>
  );
};

export default KoronaverføringerContainer;
