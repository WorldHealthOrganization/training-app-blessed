import { swapById } from "../../utils/array";
import { PartialTrainingModule } from "../entities/TrainingModule";
import { TranslatableText } from "../entities/TranslatableText";

export const updateTranslation = (
    module: PartialTrainingModule,
    key: string,
    value: string,
    language?: string
): PartialTrainingModule => {
    const translate = (text: TranslatableText): TranslatableText => {
        if (key !== text.key) return text;

        return !language
            ? { ...text, referenceValue: value }
            : { ...text, translations: { ...text.translations, [language]: value } };
    };

    return {
        ...module,
        name: translate(module.name),
        contents: {
            ...module.contents,
            welcome: translate(module.contents.welcome),
            steps: module.contents.steps.map(step => ({
                ...step,
                title: translate(step.title),
                pages: step.pages.map(page => ({ ...page, ...translate(page) })),
            })),
        },
    };
};

export const enforceKeyName = (model: PartialTrainingModule): PartialTrainingModule => {
    return {
        ...model,
        contents: {
            ...model.contents,
            steps: model.contents.steps.map((step, stepIdx) => ({
                ...step,
                id: `${model.id}-step-${stepIdx + 1}`,
                title: { ...step.title, key: `${model.id}-step-${stepIdx + 1}-title` },
                pages: step.pages.map((page, pageIdx) => ({
                    ...page,
                    id: `${model.id}-page-${stepIdx + 1}-${pageIdx + 1}`,
                    key: `${model.id}-step-${stepIdx + 1}-${pageIdx + 1}`,
                })),
            })),
        },
    };
};

export const updateOrder = (model: PartialTrainingModule, id1: string, id2: string): PartialTrainingModule => {
    return enforceKeyName({
        ...model,
        contents: {
            ...model.contents,
            steps: swapById(
                model.contents.steps.map(step => ({
                    ...step,
                    pages: swapById(step.pages, id1, id2),
                })),
                id1,
                id2
            ),
        },
    });
};

export const addStep = (model: PartialTrainingModule, title: string): PartialTrainingModule => {
    return enforceKeyName({
        ...model,
        contents: {
            ...model.contents,
            steps: [
                ...model.contents.steps,
                {
                    id: `${model.id}-step-${model.contents.steps.length + 1}`,
                    title: {
                        key: `${model.id}-step-${model.contents.steps.length + 1}-title`,
                        referenceValue: title,
                        translations: {},
                    },
                    subtitle: undefined,
                    pages: [],
                },
            ],
        },
    });
};

export const addPage = (model: PartialTrainingModule, stepKey: string, value: string): PartialTrainingModule => {
    return enforceKeyName({
        ...model,
        contents: {
            ...model.contents,
            steps: model.contents.steps.map((step, stepIdx) => {
                if (step.id !== stepKey) return step;

                return {
                    ...step,
                    pages: [
                        ...step.pages,
                        {
                            id: `${model.id}-page-${stepIdx}-${step.pages.length + 1}`,
                            key: `${model.id}-step-${stepIdx + 1}-${step.pages.length + 1}`,
                            referenceValue: value,
                            translations: {},
                        },
                    ],
                };
            }),
        },
    });
};

export const removeStep = (module: PartialTrainingModule, stepKey: string): PartialTrainingModule => {
    return {
        ...module,
        contents: {
            ...module.contents,
            steps: module.contents.steps.filter(step => step.id !== stepKey),
        },
    };
};

export const removePage = (module: PartialTrainingModule, stepKey: string, pageKey: string): PartialTrainingModule => {
    return {
        ...module,
        contents: {
            ...module.contents,
            steps: module.contents.steps.map(step => {
                if (step.id !== stepKey) return step;

                return {
                    ...step,
                    pages: step.pages.filter(page => page.id !== pageKey),
                };
            }),
        },
    };
};
