/*
 * Midlertidig. Flytt til fellesbibliotek når det er klart.
 */

import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { ErrorMessage } from '@hookform/error-message';
import { Select } from '@navikt/ds-react';

import '@navikt/ft-plattform-komponenter/dist/style.css';

interface SelectFieldProps {
    children: React.ReactNode;
    htmlSize?: number;
    label: React.ReactNode;
    hideLabel?: boolean;
    style?: React.CSSProperties;
    error?: React.ReactNode;
    errorId?: string;
    size?: 'small' | 'medium';
    disabled?: boolean;
    description?: React.ReactNode;
    id?: string;
    className?: string;
    ref?: React.Ref<HTMLSelectElement>;
    name: string;
    validators?: { [key: string]: (v: any) => string | boolean | undefined };
}

const SelectField = ({
    children,
    htmlSize,
    label,
    hideLabel,
    style,
    errorId,
    size,
    disabled,
    description,
    id,
    className,
    ref,
    name,
    validators,
}: SelectFieldProps): JSX.Element => {
    const { control, formState } = useFormContext();
    const { errors } = formState;
    return (
        <Controller
            control={control}
            name={name}
            defaultValue=""
            rules={{
                validate: {
                    ...validators,
                },
            }}
            render={({ field }) => {
                const { value, onChange } = field;
                const textAreaValue = value?.length === 0 ? '' : value;

                return (
                    <Select
                        children={children}
                        label={label}
                        hideLabel={hideLabel}
                        style={style}
                        errorId={errorId}
                        size={size}
                        disabled={disabled}
                        description={description}
                        id={id}
                        className={className}
                        ref={ref}
                        name={name}
                        onChange={onChange}
                        value={value}
                        error={errors[name]?.message && <ErrorMessage errors={errors} name={name} />}
                        htmlSize={htmlSize}
                    />
                );
            }}
        />
    );
};

export default SelectField;
