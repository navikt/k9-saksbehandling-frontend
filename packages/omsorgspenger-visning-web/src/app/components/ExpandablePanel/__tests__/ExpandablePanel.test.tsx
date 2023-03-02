import {axe} from 'jest-axe';
import ExpandablePanel from "../ExpandablePanel";
import React from 'react';
import {render, screen} from '@testing-library/react';

describe('<ExpandablePanel>', () => {
  const inneholdIKomponent = 'Dette er innhold';
  const innholdPadding = '1em';
  const heading = (skalViseInnhold) => <span>{skalViseInnhold ? 'Skjul' : 'Vis'}</span>;

  const ExpandablePanelKomponentVis = (<ExpandablePanel
    heading={heading}
    isOpenAsDefault={true}
    innholdPadding={innholdPadding}
  >
    {inneholdIKomponent}
  </ExpandablePanel>);

  const ExpandablePanelKomponentSkjul = (<ExpandablePanel
    heading={heading}
    isOpenAsDefault={false}
    innholdPadding={innholdPadding}
  >
    {inneholdIKomponent}
  </ExpandablePanel>);

  test('Viser innehold', async () => {
    render(ExpandablePanelKomponentVis);
    const hentetInnehold = screen.getByText(inneholdIKomponent);
    expect(hentetInnehold).toBeInTheDocument();
  });

  test('Viser heading om innehold ska inneholde "Skjul"', async () => {
    render(ExpandablePanelKomponentVis);
    const hentetHeadingText = screen.getByText('Skjul');
    expect(hentetHeadingText).toBeInTheDocument();
  });

  test('Viser heading som ska inneholde "Vis"', async () => {
    render(ExpandablePanelKomponentSkjul);
    const hentetHeadingText = screen.getByText('Vis');
    expect(hentetHeadingText).toBeInTheDocument();
  });

  test('Den har ingen a11y violations', async () => {
    const {container} = render(ExpandablePanelKomponentVis);
    const a11yResults = await axe(container);

    // @ts-ignore
    expect(a11yResults).toHaveNoViolations();
  });
});
