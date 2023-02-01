/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
import { UNSAFE_DatePicker, UNSAFE_useDatepicker } from '@navikt/ds-react';
import '@navikt/ft-plattform-komponenter/dist/style.css';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React from 'react';
import styles from './datepicker.css';
import { DatepickerLimitations } from './DatepickerLimitations';

dayjs.extend(customParseFormat);

const ISO_DATE_FORMAT = 'YYYY-MM-DD';

export interface DatepickerDateRange {
    from: string;
    to: string;
}

interface PureDatepickerProps {
    label: string;
    errorMessage?: string;
    ariaLabel?: string;
    inputId?: string;
    disabled?: boolean;
    disabledDays?: {
        from: Date;
        to?: Date;
    }[];
    fromDate?: Date;
    toDate?: Date;
    initialMonth?: Date;
    /**
     * @deprecated Bruk disabledDays, fromDate og toDate istedet.
     */
    limitations?: DatepickerLimitations;
    onChange?: (value: any) => void;
    value: string | Date;
}

const PureDatepicker = ({
    label,
    value,
    onChange,
    errorMessage,
    limitations,
    inputId,
    disabled,
    initialMonth,
    fromDate,
    toDate,
    disabledDays,
}: PureDatepickerProps): JSX.Element => {
    const stringToDate = (date: string | Date): Date => new Date(date);

    const { datepickerProps, inputProps } = UNSAFE_useDatepicker({
        fromDate: limitations && limitations.minDate ? new Date(limitations.minDate) : fromDate,
        toDate: limitations && limitations.maxDate ? new Date(limitations.maxDate) : toDate,
        defaultMonth: initialMonth ? new Date(initialMonth) : undefined,
        defaultSelected: value ? stringToDate(stringToDate(value)) : undefined,
        disabled:
            limitations && limitations.invalidDateRanges
                ? limitations.invalidDateRanges.map((range) => ({
                      from: stringToDate(range.from),
                      to: stringToDate(range.to),
                  }))
                : disabledDays,
        onDateChange: (date) => {
            if (date !== undefined) {
                const verdi = dayjs(date).format(ISO_DATE_FORMAT);
                onChange(verdi);
            }
        },
    });

    return (
        <div className={styles.datepicker}>
            <UNSAFE_DatePicker {...datepickerProps}>
                <UNSAFE_DatePicker.Input
                    {...inputProps}
                    label={label}
                    id={inputId}
                    disabled={disabled}
                    size="small"
                    error={errorMessage}
                />
            </UNSAFE_DatePicker>
        </div>
    );
};

export default PureDatepicker;
