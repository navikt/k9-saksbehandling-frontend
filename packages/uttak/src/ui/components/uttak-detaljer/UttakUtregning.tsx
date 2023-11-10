import { BodyShort } from '@navikt/ds-react';
import { GreenCheckIcon } from '@navikt/ft-plattform-komponenter';
import classNames from 'classnames/bind';
import * as React from 'react';
import styles from './uttakUtregning.css';

const cx = classNames.bind(styles);

interface UttakUtregningProps {
    heading: string;
    children: React.ReactNode;
    highlight?: boolean;
    headingPostContent?: React.ReactNode;
}

const UttakUtregning = ({ heading, children, highlight, headingPostContent }: UttakUtregningProps): JSX.Element => {
    const uttakUtregningCls = cx('uttakUtregning', {
        'uttakUtregning--highlighted': highlight,
    });
    return (
        <div className={uttakUtregningCls}>
            <div className={styles.uttakUtregning__headingContainer}>
                <div className={styles.uttakUtregning__headingIcon}>{highlight && <GreenCheckIcon size={19} />}</div>
                <BodyShort size="small" weight="semibold">
                    {heading}
                </BodyShort>
                {headingPostContent}
            </div>
            <hr />
            {children}
        </div>
    );
};

export default UttakUtregning;
