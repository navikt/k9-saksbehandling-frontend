import { TransferArrowsIcon } from 'app/components/icons';
import { LoadingIndicator } from 'app/components/LoadingIndicator';
import RammemeldingOverskrift from 'app/components/RammemeldingOverskrift/RammemeldingOverskrift';
import Fordelinger from 'app/containers/Fordelinger/Fordelinger';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { apiRoutes } from 'utils/http/apiConfig';
import useGet from 'utils/http/useGet';

interface Props {
  saksnummer: string;
}

export const FordelingerContainer: React.FunctionComponent<Props> = ({saksnummer}) => {
  const {t} = useTranslation();
  const {data, error, loading} = useGet(`${apiRoutes().Fordelinger}?saksnummer=${saksnummer}`);
  const errorStatus = error?.response?.status;
  return <>
    <RammemeldingOverskrift><TransferArrowsIcon/>{t('fordelinger.overskrift')}</RammemeldingOverskrift>
    {loading && <LoadingIndicator/>}
    {error && <p>
      {errorStatus === 404
        ? t('sak.feil.404', {saksnummer})
        : t('sak.feil.ukjent')}
    </p>}
    {data !== null && <Fordelinger fordelinger={data?.fordelinger}/>}
  </>;
};