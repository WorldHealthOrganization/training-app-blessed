import { TrainingModule, TrainingModuleContents, TrainingModuleType } from "../../domain/entities/TrainingModule";
import { TrainingModuleRepository } from "../../domain/repositories/TrainingModuleRepository";
import { Dictionary } from "../../types/utils";
import { BuiltinModules } from "../assets/modules/BuiltinModules";
import { JSONTrainingModule } from "../entities/JSONTrainingModule";

export class TrainingModuleDefaultRepository implements TrainingModuleRepository {
    private builtinModules: Dictionary<JSONTrainingModule>;

    constructor() {
        this.builtinModules = BuiltinModules;
    }

    public async getModule(moduleKey: string): Promise<TrainingModule> {
        const { type, contents, ...builtinModule } = this.builtinModules[moduleKey];
        const validType = ["app", "core", "widget"].includes(type) ? type : "app";

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
            type: validType as TrainingModuleType,
            contents: translatedContents,
        };
    }
}
