import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModule } from "../entities/TrainingModule";

export class ListModulesUseCase implements UseCase {
    public async execute(): Promise<Omit<TrainingModule, "steps">[]> {
        return [
            {
                id: "data-entry",
                dhisAppKey: "data-entry",
                name: "Data Entry",
                publicAccess: "--------",
                userAccesses: [],
                userGroupAccesses: [],
                user: {
                    id: "",
                    name: "",
                },
                lastUpdatedBy: {
                    id: "",
                    name: "",
                },
                created: new Date(),
                lastUpdated: new Date(),
                type: "core",
                versionRange: "",
                dhisVersionRange: "",
                dhisLaunchUrl: "/dhis-web-dataentry/index.action",
            },
        ];
    }
}
