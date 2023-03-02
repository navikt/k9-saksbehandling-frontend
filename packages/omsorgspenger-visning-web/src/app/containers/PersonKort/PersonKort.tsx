import {apiRoutes} from "../../../utils/http/apiConfig";
import {LoadingIndicator} from "../../components/LoadingIndicator";
import {PersonCard} from "@navikt/nap-person-card";
import React from 'react';
import styled from "styled-components";
import useGet from "../../../utils/http/useGet";
import {useTranslation} from "react-i18next";

interface Props {
  saksnummer: string;
}

const PersonKort: React.FunctionComponent<Props> = ({saksnummer}) => {
  const {data, error, loading} = useGet(
    `${apiRoutes().Overføringer}?status=Aktiv&saksnummer=${saksnummer}`,
  );
  const errorStatus = error?.response?.status;
  const {t} = useTranslation();

  return (
    <>
      {loading && <LoadingIndicator/>}
      {data !== null &&
        <PersonCardStyle>
          <PersonCard name={t('personkort.saksnummer', {saksnummer})}
                      fodselsnummer={t('personkort.fodselsnummer', {fodselsnummer: data.identitetsnummer})}
                      gender={'unknown'}/>
        </PersonCardStyle>}
      {error && <p>
        {errorStatus === 404
          ? t('sak.feil.ikkeIdentitetsnummerEllerSaksnummer', {saksnummer})
          : t('sak.feil.ukjent')}
      </p>}
    </>
  );
};

const PersonCardStyle = styled.div`
  margin-bottom: 0;
  width: 100%;
  
  .clipboard__animationContainer{
    display: none;
  }
  
  .person-card__name-gender-container{
    padding-left: 0;
  }
`;

export default PersonKort;