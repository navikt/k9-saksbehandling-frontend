import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import navColors from '../../../../styles/designSystemColors';
import PanelMedDagerOgBeskrivelse from '../PanelMedDagerOgBeskrivelse';

describe('<PanelMedDagerOgBeskrivelse>', () => {
  test('PanelMedDagerOgBeskrivelse viser dager og beskrivelse', () => {
    const antallDager = 5;
    const beskrivelse = 'Tekst om hva dagene innebærer';

    render(
      <PanelMedDagerOgBeskrivelse
        farge={navColors.navGronn}
        beskrivelseAvDager={beskrivelse}
        antallDager={antallDager}
      />
    );

    const hentetAntallDager = screen.getByText(antallDager.toString());
    expect(hentetAntallDager).toBeInTheDocument();

    const hentetBeskrivelse = screen.getByText(beskrivelse);
    expect(hentetBeskrivelse).toBeInTheDocument();
  });

  test('Den har ingen a11y violations', async () => {
    const antallDager = 5;
    const beskrivelse = 'Tekst om hva dagene innebærer';
    const {container} = render(
      <PanelMedDagerOgBeskrivelse
        farge={navColors.navGronn}
        beskrivelseAvDager={beskrivelse}
        antallDager={antallDager}
      />
    );

    const a11yResults = await axe(container);

    // @ts-ignore
    expect(a11yResults).toHaveNoViolations();
  });
});
