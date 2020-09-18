import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModule } from "../entities/TrainingModule";

export class GetModuleUseCase implements UseCase {
    public async execute(): Promise<TrainingModule> {
        return {
            id: "",
            key: "data-entry",
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
                    title: "Select your location",
                    contents: [
                        {
                            type: "markdown",
                            text:
                                "A quick way to find a location (organisation unit) is to use the search box above the tree (the green symbol).\n\n![https://github.com/EyeSeeTea/training-app/blob/feature/basic-ui/mockup/elements/screen.png?raw=true](https://github.com/EyeSeeTea/training-app/blob/feature/basic-ui/mockup/elements/screen.png?raw=true)\n\nType in the name or first few letters of your location, and select it from the drop-down menu by clicking on it to highlight it orange.\n\nThis will enter the location in the Organisation Unit field of your data entry form.",
                        },
                        {
                            type: "markdown",
                            text:
                                "Another way to find your location (organisation unit) is to search the hierarchy tree menu.\n\n![https://github.com/EyeSeeTea/training-app/blob/feature/basic-ui/mockup/elements/screen.png?raw=true](https://github.com/EyeSeeTea/training-app/blob/feature/basic-ui/mockup/elements/screen.png?raw=true)\n\nExpand and close the branches by clicking on the +/- symbols. Click on your organisation unit name to highlight it orange and this will enter the location in the Organisation Unit field of your data entry form. ",
                        },
                    ],
                },
                {
                    path: "",
                    title: "Select your data set",
                    contents: [
                        {
                            type: "markdown",
                            text: "Data entry - Step - Page 1",
                        },
                        {
                            type: "markdown",
                            text: "Data entry - Step - Page 2",
                        },
                        {
                            type: "markdown",
                            text: "Data entry - Step - Page 3",
                        },
                    ],
                },
                {
                    path: "",
                    title: "Select time period",
                    contents: [
                        {
                            type: "markdown",
                            text: "Data entry - Step - Page 1",
                        },
                        {
                            type: "markdown",
                            text: "Data entry - Step - Page 2",
                        },
                        {
                            type: "markdown",
                            text: "Data entry - Step - Page 3",
                        },
                    ],
                },
                {
                    path: "",
                    title: "Select other data",
                    contents: [
                        {
                            type: "markdown",
                            text: "Data entry - Step - Page 1",
                        },
                        {
                            type: "markdown",
                            text: "Data entry - Step - Page 2",
                        },
                        {
                            type: "markdown",
                            text: "Data entry - Step - Page 3",
                        },
                    ],
                },
                {
                    path: "",
                    title: "Enter data in the form",
                    contents: [
                        {
                            type: "markdown",
                            text: "Data entry - Step - Page 1",
                        },
                        {
                            type: "markdown",
                            text: "Data entry - Step - Page 2",
                        },
                        {
                            type: "markdown",
                            text: "Data entry - Step - Page 3",
                        },
                    ],
                },
                {
                    path: "",
                    title: "Correct your data",
                    contents: [
                        {
                            type: "markdown",
                            text: "Data entry - Step - Page 1",
                        },
                        {
                            type: "markdown",
                            text: "Data entry - Step - Page 2",
                        },
                        {
                            type: "markdown",
                            text: "Data entry - Step - Page 3",
                        },
                    ],
                },
                {
                    path: "",
                    title: "Run a validation check",
                    contents: [
                        {
                            type: "markdown",
                            text: "Data entry - Step - Page 1",
                        },
                        {
                            type: "markdown",
                            text: "Data entry - Step - Page 2",
                        },
                        {
                            type: "markdown",
                            text: "Data entry - Step - Page 3",
                        },
                    ],
                },
                {
                    path: "",
                    title: "Save and submit your form",
                    contents: [
                        {
                            type: "markdown",
                            text: "Data entry - Step - Page 1",
                        },
                        {
                            type: "markdown",
                            text: "Data entry - Step - Page 2",
                        },
                        {
                            type: "markdown",
                            text: "Data entry - Step - Page 3",
                        },
                    ],
                },
            ],
        };
    }
}
