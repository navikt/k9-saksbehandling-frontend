import { GoBackInTimeIcon } from 'app/components/icons';
import { Overføring as OverføringType, overføringKey } from 'app/types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components/macro';
import navColors from 'styles/designSystemColors';
import { erDatoSenere, erDatoTidligere, erPeriodeGjeldende } from 'utils/timeUtils';
import Overføring from './Overforing';
import OverføringerExpandable from './OverforingerExpandable';

interface Props {
  overføringer: {
    gitt: OverføringType[];
    fått: OverføringType[];
  };
}

const Overføringer: React.FunctionComponent<Props> = ({
  overføringer = {gitt: [], fått: []},
}) => {
  const { t } = useTranslation();

  const alleOverføringer = overføringer
    .gitt
    .concat(overføringer.fått)
    .sort((a, b) => {
      if (a.gjelderFraOgMed < b.gjelderFraOgMed) {
        return -1;
      } else if (a.gjelderFraOgMed > b.gjelderFraOgMed) {
        return 1;
      } else {
        return 0;
      }
    });

  const gjeldendeOverføringerNå = React.useMemo(
    () => alleOverføringer.filter(
      ({gjelderFraOgMed, gjelderTilOgMed}) =>
        erPeriodeGjeldende(gjelderFraOgMed, gjelderTilOgMed),
    ),
    [alleOverføringer]
  );

  const tidligereOverføringer = React.useMemo(
    () => alleOverføringer.filter(({gjelderTilOgMed}) => erDatoTidligere(gjelderTilOgMed)),
    [alleOverføringer]
  );

  const senereOverføringer = React.useMemo(
    () => alleOverføringer.filter(({gjelderFraOgMed}) => erDatoSenere(gjelderFraOgMed)),
    [alleOverføringer]
  );

  const flipXAxis = css`
    transform: scaleX(-1);
  `;

  return (
    <>
      {gjeldendeOverføringerNå.length === 0 && <p>{t('overføringer.ingenGjeldende')}</p>}
      {gjeldendeOverføringerNå.map(overføring => (
        <Overføring
          overføring={overføring}
          key={overføringKey(overføring)}
          defaultOpen={true}
          farge={overføring.til ? navColors.navLysBla : navColors.navDypBla}
        />
      ))}
      {tidligereOverføringer.length > 0 && (
        <OverføringerExpandable
          overføringer={tidligereOverføringer}
          vis={false}
          innholdPadding="1em 1em 0 1em"
          heading={(skalViseInnhold) => <>
            <GoBackInTimeIcon />
            <span>
              {skalViseInnhold
                ? t('overføringer.skjulTidligere')
                : t('overføringer.visTidligere')}
            </span>
          </>}
        />
      )}
      {senereOverføringer.length > 0 && (
        <OverføringerExpandable
          overføringer={senereOverføringer}
          vis={false}
          heading={(skalViseInnhold) => <>
            <GoBackInTimeIcon cssStyle={flipXAxis} />
            <span>
              {skalViseInnhold
                ? t('overføringer.skjulSenere')
                : t('overføringer.visSenere')}
            </span>
          </>}
        />
      )}
    </>
  );
};

export default Overføringer;
