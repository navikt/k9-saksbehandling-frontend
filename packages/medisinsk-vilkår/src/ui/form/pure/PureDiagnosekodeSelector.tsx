import { BodyShort, Label } from '@navikt/ds-react';
import { Autocomplete, FieldError } from '@navikt/ft-plattform-komponenter';
import * as React from 'react';
import Diagnosekode from '../../../types/Diagnosekode';
import DeleteButton from '../../components/delete-button/DeleteButton';
import styles from './diagnosekodeSelector.css';
import initDiagnosekodeSearcher, {toLegacyDiagnosekode} from "../../../util/diagnosekodeSearcher";

interface Suggestion {
    key: string;
    value: string;
}

interface DiagnosekodeSelectorProps {
    label: string;
    onChange: (value) => void;
    name: string;
    errorMessage?: string;
    initialDiagnosekodeValue: string;
    hideLabel?: boolean;
    selectedDiagnosekoder: string[];
}

// Start loading the searcher immediately
// TODO De-duplicate this init with the one in Diagnosekodeoversikt.tsx, we can use the same instance for both of these searches (there is no paging)
const diagnosekodeSearcherPromise = initDiagnosekodeSearcher(8)

const fetchDiagnosekoderByQuery = async (queryString: string): Promise<Diagnosekode[]> => {
    const searcher = await diagnosekodeSearcherPromise;
    const searchResult = searcher.search(queryString, 1);
    return searchResult.diagnosekoder.map(toLegacyDiagnosekode)
}

const PureDiagnosekodeSelector = ({
    label,
    onChange,
    name,
    errorMessage,
    initialDiagnosekodeValue,
    hideLabel,
    selectedDiagnosekoder,
}: DiagnosekodeSelectorProps): JSX.Element => {
    const [suggestions, setSuggestions] = React.useState([]);
    const [inputValue, setInputValue] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [selectedDiagnosekoderFullName, setSelectedDiagnosekoderFullName] = React.useState<Suggestion[]>([]);

    const getUpdatedSuggestions = async (queryString: string) => {
        if (queryString.length >= 3) {
            setIsLoading(true);
            const diagnosekoder: Diagnosekode[] = await fetchDiagnosekoderByQuery(queryString);
            setIsLoading(false);
            return diagnosekoder.map(({ kode, beskrivelse }) => ({
                key: kode,
                value: `${kode} - ${beskrivelse}`,
            }));
        }
        return [];
    };

    React.useEffect(() => {
        const getInitialDiagnosekode = async () => {
            const diagnosekode = await getUpdatedSuggestions(initialDiagnosekodeValue);
            if (diagnosekode.length > 0 && diagnosekode[0].value) {
                setInputValue(diagnosekode[0].value);
            }
        };
        getInitialDiagnosekode();
    }, [initialDiagnosekodeValue]);

    const onInputValueChange = async (v) => {
        const newSuggestionList = await getUpdatedSuggestions(v);
        setSuggestions(newSuggestionList);
    };

    const removeDiagnosekode = (diagnosekodeToRemove: string) => {
        onChange(selectedDiagnosekoder.filter((selectedDiagnosekode) => selectedDiagnosekode !== diagnosekodeToRemove));
    };
    return (
        <div className={styles.diagnosekodeContainer}>
            <div className={hideLabel ? styles.diagnosekodeContainer__hideLabel : ''}>
                <Label as="label" htmlFor={name}>
                    {label}
                </Label>
            </div>
            <div className={styles.diagnosekodeContainer__autocompleteContainer}>
                <Autocomplete
                    id={name}
                    suggestions={suggestions}
                    value={inputValue}
                    onChange={(e) => {
                        onInputValueChange(e);
                        setInputValue(e);
                    }}
                    onSelect={(e) => {
                        setInputValue('');
                        if (!selectedDiagnosekoder.includes(e.key)) {
                            onChange([...selectedDiagnosekoder, e.key]);
                            setSelectedDiagnosekoderFullName([...selectedDiagnosekoderFullName, e]);
                        }
                    }}
                    ariaLabel="Søk etter diagnose"
                    placeholder="Søk etter diagnose"
                    shouldFocusOnMount
                    isLoading={isLoading}
                />
            </div>
            {errorMessage && <FieldError message={errorMessage} />}
            {selectedDiagnosekoder.length > 0 && (
                <ul className={styles.diagnosekodeContainer__diagnosekodeList}>
                    {selectedDiagnosekoder.map((selectedDiagnosekode) => {
                        const fullName = selectedDiagnosekoderFullName.find(
                            (selectedDiagnosekodeFullName) => selectedDiagnosekodeFullName.key === selectedDiagnosekode
                        );
                        const diagnosekodeLabel = fullName ? fullName.value : selectedDiagnosekode;
                        return (
                            <li key={selectedDiagnosekode}>
                                <BodyShort size="small">{diagnosekodeLabel}</BodyShort>
                                <DeleteButton onClick={() => removeDiagnosekode(selectedDiagnosekode)} />
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default PureDiagnosekodeSelector;
