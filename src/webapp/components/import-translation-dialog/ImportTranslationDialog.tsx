import { ConfirmationDialog, Dropdown, DropdownItem, useSnackbar } from "@eyeseetea/d2-ui-components";
import _ from "lodash";
import React, { useCallback, useImperativeHandle, useRef, useState } from "react";
import styled from "styled-components";
import { TrainingModule } from "../../../domain/entities/TrainingModule";
import { TranslateMethod } from "../../../domain/entities/TranslatableText";
import i18n from "../../../locales";
import { useAppContext } from "../../contexts/app-context";

export const ImportTranslationDialog = React.forwardRef(
    (props: ImportTranslationDialogProps, ref: React.ForwardedRef<ImportTranslationRef>) => {
        const { modules, translate } = useAppContext();
        const snackbar = useSnackbar();

        const [open, setOpen] = useState<boolean>(false);
        const [selectedLang, setSelectedLang] = useState<string>();
        const [selectedModule, setSelectedModule] = useState<string>();
        const [terms, setTerms] = useState<Record<string, string>>();

        const inputRef = useRef<any>(null);

        const save = useCallback(async () => {
            if (!selectedModule || !selectedLang || !terms) {
                snackbar.error(i18n.t("You need to select a module and a language"));
                return;
            }
            await props.onSave(selectedModule, selectedLang, terms);

            setOpen(false);
        }, [snackbar, props, selectedModule, selectedLang, terms]);

        const onFileUpload = useCallback(
            async (event: any) => {
                try {
                    const file = event.target.files[0];
                    if (!file) throw new Error("No file received on upload");

                    const text = await file.text();
                    const json = JSON.parse(text);
                    const terms = _.pickBy(json, value => _.isString(value));

                    setTerms(terms);
                    setOpen(true);

                    // Reset input component
                    event.target.value = "";
                } catch (e) {
                    console.error(e);
                    snackbar.error(i18n.t("File is not a valid translation JSON dictionary"));
                }
            },
            [snackbar]
        );

        useImperativeHandle(ref, () => ({
            startImport() {
                inputRef.current.click();
            },
        }));

        return (
            <React.Fragment>
                <input
                    type="file"
                    name="file"
                    accept={"application/json"}
                    ref={inputRef}
                    onChange={onFileUpload}
                    style={{ display: "none" }}
                />

                <ConfirmationDialog
                    title={i18n.t("Import translation")}
                    open={open}
                    onSave={save}
                    onCancel={() => setOpen(false)}
                    maxWidth={"md"}
                    fullWidth={true}
                >
                    <Container>
                        <Select
                            label={i18n.t("Module to add translation")}
                            items={buildModuleList(modules, translate)}
                            onChange={setSelectedModule}
                            value={selectedModule}
                        />

                        <Select
                            label={i18n.t("Language to add translation")}
                            items={languages}
                            onChange={setSelectedLang}
                            value={selectedLang}
                        />
                    </Container>
                </ConfirmationDialog>
            </React.Fragment>
        );
    }
);

const Container = styled.div`
    display: flex;
    flex-flow: column;
`;

const Select = styled(Dropdown)`
    margin: 10px;
`;

export interface ImportTranslationRef {
    startImport: () => void;
}

export interface ImportTranslationDialogProps {
    onSave: (key: string, lang: string, terms: Record<string, string>) => void | Promise<void>;
}

function buildModuleList(modules: TrainingModule[], translate: TranslateMethod): DropdownItem[] {
    return modules.map(({ id, name }) => ({ value: id, text: translate(name) }));
}

const languages = [
    { value: "ab", text: "Abkhazian" },
    { value: "aa", text: "Afar" },
    { value: "af", text: "Afrikaans" },
    { value: "ak", text: "Akan" },
    { value: "sq", text: "Albanian" },
    { value: "am", text: "Amharic" },
    { value: "ar", text: "Arabic" },
    { value: "an", text: "Aragonese" },
    { value: "hy", text: "Armenian" },
    { value: "as", text: "Assamese" },
    { value: "ast", text: "Asturian" },
    { value: "av", text: "Avaric" },
    { value: "ae", text: "Avestan" },
    { value: "ay", text: "Aymara" },
    { value: "az", text: "Azerbaijani" },
    { value: "bm", text: "Bambara" },
    { value: "ba", text: "Bashkir" },
    { value: "eu", text: "Basque" },
    { value: "be", text: "Belarusian" },
    { value: "bn", text: "Bengali" },
    { value: "bh", text: "Bihari languages" },
    { value: "bi", text: "Bislama" },
    { value: "bs", text: "Bosnian" },
    { value: "br", text: "Breton" },
    { value: "bg", text: "Bulgarian" },
    { value: "my", text: "Burmese" },
    { value: "ca", text: "Catalan" },
    { value: "ceb", text: "Cebuano" },
    { value: "ch", text: "Chamorro" },
    { value: "ce", text: "Chechen" },
    { value: "ny", text: "Chichewa" },
    { value: "cu", text: "Church Slavic" },
    { value: "cv", text: "Chuvash" },
    { value: "kw", text: "Cornish" },
    { value: "co", text: "Corsican" },
    { value: "cr", text: "Cree" },
    { value: "hr", text: "Croatian" },
    { value: "cs", text: "Czech" },
    { value: "da", text: "Danish" },
    { value: "prs", text: "Dari" },
    { value: "dv", text: "Divehi" },
    { value: "nl", text: "Dutch" },
    { value: "dz", text: "Dzongkha" },
    { value: "en", text: "English" },
    { value: "eo", text: "Esperanto" },
    { value: "et", text: "Estonian" },
    { value: "ee", text: "Ewe" },
    { value: "fo", text: "Faroese" },
    { value: "fj", text: "Fijian" },
    { value: "fil", text: "Filipino" },
    { value: "fi", text: "Finnish" },
    { value: "fr", text: "French" },
    { value: "ff", text: "Fulah" },
    { value: "gl", text: "Galician" },
    { value: "lg", text: "Ganda" },
    { value: "ka", text: "Georgian" },
    { value: "de", text: "German" },
    { value: "el", text: "Greek" },
    { value: "gn", text: "Guarani" },
    { value: "gu", text: "Gujarati" },
    { value: "ht", text: "Haitian Creole" },
    { value: "ha", text: "Hausa" },
    { value: "haw", text: "Hawaiian" },
    { value: "he", text: "Hebrew" },
    { value: "hz", text: "Herero" },
    { value: "hi", text: "Hindi" },
    { value: "ho", text: "Hiri Motu" },
    { value: "hu", text: "Hungarian" },
    { value: "is", text: "Icelandic" },
    { value: "io", text: "Ido" },
    { value: "ig", text: "Igbo" },
    { value: "id", text: "Indonesian" },
    { value: "ia", text: "Interlingua" },
    { value: "ie", text: "Interlingue" },
    { value: "iu", text: "Inuktitut" },
    { value: "ik", text: "Inupiaq" },
    { value: "ga", text: "Irish" },
    { value: "it", text: "Italian" },
    { value: "jam", text: "Jamaican Patois" },
    { value: "ja", text: "Japanese" },
    { value: "jv", text: "Javanese" },
    { value: "kab", text: "Kabyle" },
    { value: "kl", text: "Kalaallisut" },
    { value: "kn", text: "Kannada" },
    { value: "kr", text: "Kanuri" },
    { value: "ks", text: "Kashmiri" },
    { value: "kk", text: "Kazakh" },
    { value: "km", text: "Khmer" },
    { value: "ki", text: "Kikuyu; Gikuyu" },
    { value: "rw", text: "Kinyarwanda" },
    { value: "ky", text: "Kirghiz" },
    { value: "kv", text: "Komi" },
    { value: "kg", text: "Kongo" },
    { value: "ko", text: "Korean" },
    { value: "kj", text: "Kuanyama; Kwanyama" },
    { value: "ku", text: "Kurdish" },
    { value: "lo", text: "Lao" },
    { value: "la", text: "Latin" },
    { value: "lv", text: "Latvian" },
    { value: "li", text: "Limburgish" },
    { value: "ln", text: "Lingala" },
    { value: "lt", text: "Lithuanian" },
    { value: "jbo", text: "Lojban" },
    { value: "lu", text: "Luba-Katanga" },
    { value: "lb", text: "Luxembourgish" },
    { value: "mk", text: "Macedonian" },
    { value: "mg", text: "Malagasy" },
    { value: "ms", text: "Malay" },
    { value: "ml", text: "Malayalam" },
    { value: "mt", text: "Maltese" },
    { value: "gv", text: "Manx" },
    { value: "mi", text: "Maori" },
    { value: "mr", text: "Marathi" },
    { value: "mh", text: "Marshallese" },
    { value: "mo", text: "Moldavian; Moldovan" },
    { value: "mn", text: "Mongolian" },
    { value: "na", text: "Nauru" },
    { value: "nv", text: "Navajo; Navaho" },
    { value: "ng", text: "Ndonga" },
    { value: "ne", text: "Nepali" },
    { value: "nd", text: "North Ndebele" },
    { value: "se", text: "Northern Sami" },
    { value: "no", text: "Norwegian" },
    { value: "nb", text: "Norwegian Bokmål" },
    { value: "nn", text: "Norwegian Nynorsk" },
    { value: "oc", text: "Occitan" },
    { value: "oj", text: "Ojibwa" },
    { value: "or", text: "Oriya" },
    { value: "om", text: "Oromo" },
    { value: "os", text: "Ossetian; Ossetic" },
    { value: "pi", text: "Pali" },
    { value: "pa", text: "Panjabi; Punjabi" },
    { value: "fa", text: "Persian" },
    { value: "pl", text: "Polish" },
    { value: "pt", text: "Portuguese" },
    { value: "ps", text: "Pushto; Pashto" },
    { value: "qu", text: "Quechua" },
    { value: "rom", text: "Romani" },
    { value: "ro", text: "Romanian" },
    { value: "rm", text: "Romansh" },
    { value: "rn", text: "Rundi" },
    { value: "ru", text: "Russian" },
    { value: "ry", text: "Rusyn" },
    { value: "sm", text: "Samoan" },
    { value: "sg", text: "Sango" },
    { value: "sa", text: "Sanskrit" },
    { value: "sat", text: "Santali" },
    { value: "sc", text: "Sardinian" },
    { value: "gd", text: "Scottish Gaelic" },
    { value: "sr", text: "Serbian" },
    { value: "sh", text: "Serbo-Croatian" },
    { value: "sn", text: "Shona" },
    { value: "ii", text: "Sichuan Yi" },
    { value: "scn", text: "Sicilian" },
    { value: "sd", text: "Sindhi" },
    { value: "si", text: "Sinhalese" },
    { value: "sk", text: "Slovak" },
    { value: "sl", text: "Slovenian" },
    { value: "so", text: "Somali" },
    { value: "st", text: "Sotho, Southern" },
    { value: "nr", text: "South Ndebele" },
    { value: "es", text: "Spanish" },
    { value: "su", text: "Sundanese" },
    { value: "sw", text: "Swahili" },
    { value: "ss", text: "Swati" },
    { value: "sv", text: "Swedish" },
    { value: "tl", text: "Tagalog" },
    { value: "ty", text: "Tahitian" },
    { value: "tg", text: "Tajik" },
    { value: "ta", text: "Tamil" },
    { value: "tt", text: "Tatar" },
    { value: "te", text: "Telugu" },
    { value: "th", text: "Thai" },
    { value: "bo", text: "Tibetan" },
    { value: "ti", text: "Tigrinya" },
    { value: "to", text: "Tonga" },
    { value: "ts", text: "Tsonga" },
    { value: "tn", text: "Tswana" },
    { value: "tr", text: "Turkish" },
    { value: "tk", text: "Turkmen" },
    { value: "tw", text: "Twi" },
    { value: "uk", text: "Ukrainian" },
    { value: "ur", text: "Urdu" },
    { value: "ug", text: "Uyghur" },
    { value: "uz", text: "Uzbek" },
    { value: "ve", text: "Venda" },
    { value: "vi", text: "Vietnamese" },
    { value: "vo", text: "Volapük" },
    { value: "wa", text: "Walloon" },
    { value: "cy", text: "Welsh" },
    { value: "fy", text: "Western Frisian" },
    { value: "wo", text: "Wolof" },
    { value: "xh", text: "Xhosa" },
    { value: "yi", text: "Yiddish" },
    { value: "yo", text: "Yoruba" },
    { value: "za", text: "Zhuang; Chuang" },
    { value: "zu", text: "Zulu" },
];
