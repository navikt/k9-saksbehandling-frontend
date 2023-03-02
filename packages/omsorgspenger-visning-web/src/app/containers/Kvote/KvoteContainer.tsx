import React from 'react';
import { useTranslation } from 'react-i18next';
import navColors from '../../../styles/designSystemColors';
import { apiRoutes } from '../../../utils/http/apiConfig';
import useGet from '../../../utils/http/useGet';
import { CalendarIcon } from '../../components/icons';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import PanelMedDagerOgBeskrivelse from '../../components/PanelMedDagerOgBeskrivelse/PanelMedDagerOgBeskrivelse';
import RammemeldingOverskrift from '../../components/RammemeldingOverskrift/RammemeldingOverskrift';

interface Props {
  saksnummer: string;
}

export const KvoteContainer: React.FunctionComponent<Props> = ({saksnummer}) => {
  const {t} = useTranslation();
  const {data, error, loading} = useGet(`${apiRoutes().Kvote}?status=Aktiv&saksnummer=${saksnummer}`);
  const errorStatus = error?.response?.status;
  const år = new Date().getFullYear().toString();

  return (
    <>
      <RammemeldingOverskrift>
        <CalendarIcon />
        {t('kvote.overskrift', {år})}
      </RammemeldingOverskrift>

      {loading && <LoadingIndicator/>}

      {error && (<p>
        {
          errorStatus === 404 ? (
            t('sak.feil.404', {saksnummer})
          ) : (
            t('sak.feil.ukjent')
          )
        }
      </p>)}

      {data !== null && data.dager !== null &&
        <PanelMedDagerOgBeskrivelse
          farge={navColors.navGronn}
          beskrivelseAvDager={`${t('kvote.antallDagerBeskrivelse', {år})}`}
          antallDager={data.dager}
        />}
    </>
  );
};

export default KvoteContainer;
