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
                    title: "Get location",
                    contents: [
                        {
                            type: "markdown",
                            text:
                                "And this is a paragraph\n\nAnd a **bold** text\n\n<p align='right'>This is right aligned</p>\n\n![alt text](http://qnimate.com/wp-content/uploads/2014/03/images2.jpg)",
                        },
                        {
                            type: "markdown",
                            text: "Another page",
                        },
                    ],
                },
                {
                    path: "",
                    title: "Step 2",
                    contents: [
                        {
                            type: "markdown",
                            text: "Page 1",
                        },
                        {
                            type: "markdown",
                            text: "Another page",
                        },
                    ],
                },
            ],
        };
    }
}
