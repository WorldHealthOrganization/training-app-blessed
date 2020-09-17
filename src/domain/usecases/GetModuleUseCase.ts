import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModule } from "../entities/TrainingModule";

export class GetModuleUseCase implements UseCase {
    public async execute(): Promise<TrainingModule> {
        return {
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
            steps: [
                {
                    path: "",
                    title: "Step 1",
                    contents: [
                        {
                            type: "markdown",
                            text: "Data entry - Step 1 - Page 1",
                        },
                        {
                            type: "markdown",
                            text: "Data entry - Step 1 - Page 2",
                        },
                    ],
                },
                {
                    path: "",
                    title: "Step 2",
                    contents: [
                        {
                            type: "markdown",
                            text: "Data entry - Step 2 - Page 1",
                        },
                        {
                            type: "markdown",
                            text: "Data entry - Step 2 - Page 2",
                        },
                        {
                            type: "markdown",
                            text: "Data entry - Step 2 - Page 3",
                        },
                    ],
                },
            ],
        };
    }
}
