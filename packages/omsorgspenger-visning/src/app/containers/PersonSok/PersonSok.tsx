import { Hovedknapp } from 'nav-frontend-knapper';
import { Input } from 'nav-frontend-skjema';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { apiRoutes } from '../../../utils/http/apiConfig';
import { post } from '../../../utils/http/request';
import ResponseError from '../../../utils/http/ResponseError';
import { FlexRow } from '../../components/Flex';
import { LoadingIndicator } from '../../components/LoadingIndicator';

enum ErrorType {
  NotFound = 'NotFound',
  NotAuthorised = 'NotAuthorised',
  Unknown = 'Unknown',
}

const PersonSøk: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [personIdent, setPersonIdent] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [responseError, setResponseError] = useState<ErrorType>();
  const [awaitingResponse, setAwaitingResponse] = useState<boolean>(false);

  const har11Siffer = personIdent.length === 11;

  const submitSøk = e => {
    e.preventDefault();
    setHasSearched(true);
    setResponseError(undefined);

    if (har11Siffer) {
      setAwaitingResponse(true);
      post(apiRoutes().HentSaksnummer, {
        identitetsnummer: personIdent,
      })
        .then(({ data }) => {
          const { saksnummer } = data;
          if (saksnummer) {
            navigate(`sak/${saksnummer}`);
          } else {
            setResponseError(ErrorType.Unknown);
          }
        })
        .catch(err => {
          switch ((err as ResponseError).response.status) {
            case 403:
              setResponseError(ErrorType.NotAuthorised);
              break;
            case 404:
              setResponseError(ErrorType.NotFound);
              break;
            default:
              setResponseError(ErrorType.Unknown);
              break;
          }
        })
        .finally(() => setAwaitingResponse(false));
    }
  };

  return (
    <form onSubmit={submitSøk}>
      <FlexRow alignItems="flex-start">
        <Input
          value={personIdent}
          onChange={event => {
            setPersonIdent(event.target.value);
          }}
          type="number"
          label={t('personsøk.input.label')}
          bredde="M"
          feil={hasSearched && !har11Siffer && t('personsøk.input.feil')}
          disabled={awaitingResponse}
        />
        <AlignMedInputWrapper>
          <Hovedknapp onClick={submitSøk} htmlType="submit" disabled={awaitingResponse}>
            {t('personsøk.søkeknapp.søk')}
          </Hovedknapp>
        </AlignMedInputWrapper>
      </FlexRow>
      {awaitingResponse && (
        <FlexRow>
          <div><LoadingIndicator/></div>
          <p>{t('personsøk.indikasjon')}</p>
        </FlexRow>
      )}
      {responseError && <p>{t(`personsøk.response.feil.${responseError}`)}</p>}
    </form>
  );
};

const AlignMedInputWrapper = styled.span`
  padding-top: 30px;
`;

export default PersonSøk;
