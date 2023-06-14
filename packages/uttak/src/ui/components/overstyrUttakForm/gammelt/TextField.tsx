/*
 * Midlertidig. Flytt til fellesbibliotek når det er klart.
 */

import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { ErrorMessage } from '@hookform/error-message';
import { Textarea, TextField as DSTextField } from '@navikt/ds-react';

import '@navikt/ft-plattform-komponenter/dist/style.css';

interface TextFieldProps {
    htmlSize?: number;
    hideLabel?: boolean;
    label?: React.ReactNode;
    type?: 'number' | 'email' | 'password' | 'tel' | 'text' | 'url';
    errorId?: string;
    size?: 'small' | 'medium';
    disabled?: boolean;
    description?: string;
    id?: string;
    className?: string;
    ref?: React.Ref<HTMLInputElement>;
    name: string;
    validators?: { [key: string]: (v: any) => string | boolean | undefined };
}

const TextField = ({
    htmlSize,
    hideLabel,
    label,
    type,
    errorId,
    size,
    disabled,
    description,
    id,
    className,
    ref,
    name,
    validators,
}: TextFieldProps): JSX.Element => {
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
                    <DSTextField
                        htmlSize={htmlSize}
                        hideLabel={hideLabel}
                        label={label}
                        type={type}
                        error={errors[name]?.message && <ErrorMessage errors={errors} name={name} />}
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
                        maxLength={3}
                    />
                );
            }}
        />
    );
};

export default TextField;
