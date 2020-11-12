import {
    TrainingModule,
    TrainingModuleContents,
    TrainingModuleType,
} from "../../domain/entities/TrainingModule";
import { TrainingModuleRepository } from "../../domain/repositories/TrainingModuleRepository";
import { Dictionary } from "../../types/utils";
import { BuiltinModules } from "../assets/modules/BuiltinModules";
import { JSONTrainingModule } from "../entities/JSONTrainingModule";

const isValidType = (type: string): type is TrainingModuleType => {
    return ["app", "core", "widget"].includes(type);
};

export class TrainingModuleDefaultRepository implements TrainingModuleRepository {
    private builtinModules: Dictionary<JSONTrainingModule>;

    constructor() {
        this.builtinModules = BuiltinModules;
    }

    public async getModule(moduleKey: string): Promise<TrainingModule> {
        // Read data store and get module
        // If does not exist 1) get BuiltinModule and initialize in dataStore

        return this.getBuiltinModule(moduleKey);
    }

    private getBuiltinModule(moduleKey: string): TrainingModule {
        const { type, contents, ...builtinModule } = this.builtinModules[moduleKey];
        const validType = isValidType(type) ? type : "app";

        const translatedContents: TrainingModuleContents = {
            welcome: {
                title: contents.welcome.title.referenceValue,
                description: contents.welcome.description.referenceValue,
                icon: contents.welcome.icon.referenceValue,
            },
            steps: contents.steps.map(({ title, subtitle, pages }) => ({
                title: title.referenceValue,
                subtitle: subtitle?.referenceValue,
                pages: pages.map(({ referenceValue }) => referenceValue),
            })),
        };

        return {
            ...builtinModule,
            publicAccess: "--------",
            userAccesses: [],
            userGroupAccesses: [],
            user: { id: "", name: "" },
            created: new Date(),
            lastUpdated: new Date(),
            lastUpdatedBy: { id: "", name: "" },
            type: validType,
            contents: translatedContents,
        };
    }
}
