import { css } from 'styled-components/macro';
import { media, sizes } from '../media';

describe('media', () => {
  it('should return media query in css', () => {
    const mediaQuery = media.small`color: red;`.join('').replace(/(\r\n|\n|\r|\s)/gm, '');
    const cssVersion = css`@media (min-width:600px){color: red;}`.join('').replace(/(\s)/gm, '');
    expect(mediaQuery.toLowerCase()).toEqual(cssVersion.toLowerCase());
  });
});
