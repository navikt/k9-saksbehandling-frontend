import { TextField } from '@navikt/ds-react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface OwnProps {
    label?: string;
    name: `${string}`;
    valideringsFunksjoner?: any;
    isMini: boolean;
    arialabel?: string;
    placeholder?: string;
    feil?: string;
}

const InputField: React.FunctionComponent<OwnProps> = ({
    label,
    name,
    valideringsFunksjoner,
    isMini,
    arialabel,
    placeholder,
    feil,
}) => {
    const { register } = useFormContext();
    const valideringsValg = valideringsFunksjoner !== undefined ? { validate: valideringsFunksjoner } : {};
    const input = register(name, valideringsValg);

    if (isMini) {
        return (
            <TextField
                size="small"
                name={input.name}
                label={label}
                onChange={input.onChange}
                onBlur={input.onBlur}
                ref={input.ref}
                htmlSize={140}
                placeholder={placeholder}
                aria-label={arialabel}
                error={typeof feil !== 'undefined' ? feil : ''}
            />
        );
    }
    return (
        <TextField
            name={input.name}
            label={label}
            onChange={input.onChange}
            onBlur={input.onBlur}
            ref={input.ref}
            htmlSize={70}
            placeholder={placeholder}
            aria-label={arialabel}
            error={typeof feil !== 'undefined' ? feil : ''}
        />
    );
};
export default InputField;
