import { axe } from 'jest-axe';
import DeleDagerPanel from "../DeleDagerPanel";
import navColors from "../../../../styles/designSystemColors";
import {render, screen} from '@testing-library/react';
import React from "react";

const fordeling = {
  "antallDager": 1,
  "til": "02028920544",
  "gjelderFraOgMed": "2020-01-01",
  "gjelderTilOgMed": "2020-12-31"
};

describe('<DeleDagerPanel>', () => {
  const {antallDager, til} = fordeling;
  const knappText = 'Vis innhold';
  const overfortText = 'Dag overført';
  let visDagerGittInnhold = false;

  const DeleDagerPanelKomponent = (<DeleDagerPanel
    visInnhold={visDagerGittInnhold}
    setVisInnhold={() => visDagerGittInnhold = !visDagerGittInnhold}
    farge={navColors.navBla}
    overskrift={{
      antallDager,
      overskrifttekstId: til ? 'fordeling.dagerGir' : 'fordeling.dagerFår'
    }}
  />);

  test('Viser antall dager', async () => {
    render(DeleDagerPanelKomponent);
    const hentetAntallDager = screen.getByText(antallDager.toString());
    expect(hentetAntallDager).toBeInTheDocument();
  });

  test('Viser dag/dager overført', async () => {
    render(DeleDagerPanelKomponent);
    const hentetDagerOverførtText = screen.getByText(overfortText);
    expect(hentetDagerOverførtText).toBeInTheDocument();
  });

  test('Viser knapp for visInnehold', async () => {
    render(DeleDagerPanelKomponent);
    const hentetKnappText = screen.getByText(knappText);
    expect(hentetKnappText).toBeInTheDocument();
  });

  test('Den har ingen a11y violations', async () => {
    const {container} =  render(DeleDagerPanelKomponent);
    const a11yResults = await axe(container);

    // @ts-ignore
    expect(a11yResults).toHaveNoViolations();
  });
});
