import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModule } from "../entities/TrainingModule";

export class GetModuleUseCase implements UseCase {
    public async execute(): Promise<TrainingModule> {
        return {
            id: "",
            key: "data-entry",
            dhisAppKey: "data-entry",
            name: "Data entry",
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
            details: {
                title: "Welcome to the tutorial on Data entry",
                description:
                    "The data entry application is used to manually enter data that have been recorded for one location on a regular basis, such as weekly, monthly etc. Data is registered for a location, time period and a specific data set.",
                icon:
                    "https://user-images.githubusercontent.com/2181866/93660832-454b1700-fa53-11ea-881c-5fe97edb02a3.png",
            },
            steps: [
                {
                    path: "",
                    title: "Select your location",
                    contents: [
                        {
                            type: "markdown",
                            text:
                                "![Find your location](https://user-images.githubusercontent.com/2181866/94119741-9beb9300-fe4f-11ea-9e0d-e775cc02b52f.gif)\n\nFind your location (organisation unit) on the hierarchy tree menu. Expand and close the branches by clicking on the +/- symbols.",
                        },
                        {
                            type: "markdown",
                            text:
                                "![Click on your organisation unit](https://user-images.githubusercontent.com/2181866/94119744-9c842980-fe4f-11ea-9154-2201552d5f95.gif)\n\nClick on your organisation unit name on the menu to highlight it orange. This will enter the location in the Organisation Unit field of your data entry form.",
                        },
                        {
                            type: "markdown",
                            text:
                                "![Use the search box](https://user-images.githubusercontent.com/2181866/94119745-9c842980-fe4f-11ea-876c-7faae66e37b2.gif)\n\nAnother quick way to find an organisation unit is to use the search box above the tree (the green symbol).\n\nType in the name or first few letters of your location, and select it from the drop-down menu by clicking on it to highlight it orange.\n\nThis will enter the location in the Organisation Unit field of your data entry form.",
                        },
                    ],
                },
                {
                    path: "",
                    title: "Select your data set",
                    contents: [
                        {
                            type: "markdown",
                            text:
                                "![Select your data set](https://user-images.githubusercontent.com/2181866/94119746-9d1cc000-fe4f-11ea-9464-7e84ef544f88.gif)\n\nSelect a data set from the dropdown list of data sets available to your selected location. Note that not all data sets are available for all organisation units. The data set you select will create a form with similar fields to your paper based form.",
                        },
                    ],
                },
                {
                    path: "",
                    title: "Select time period",
                    contents: [
                        {
                            type: "markdown",
                            text:
                                "![Select a period to register data](https://user-images.githubusercontent.com/2181866/94119748-9d1cc000-fe4f-11ea-80a0-37ad16a39301.gif)\n\nSelect a period for which to register data. The available periods are determined by the reporting frequency required for the selected form.",
                        },
                        {
                            type: "markdown",
                            text:
                                "![You can also toggle between years](https://user-images.githubusercontent.com/2181866/94119751-9d1cc000-fe4f-11ea-9e69-ac289d4e4a0c.gif)\n\nYou can also toggle between years, moving a year forward or backward using the buttons next to the period entry field.",
                        },
                    ],
                },
                {
                    path: "",
                    title: "Select other data",
                    contents: [
                        {
                            type: "markdown",
                            text:
                                "![Select other data](https://user-images.githubusercontent.com/2181866/94119752-9db55680-fe4f-11ea-8834-f8a57e887bf7.gif)\n\nBy now you should see the data entry form. If not, there may be additional data dimensions that you need to select from drop-down menus, depending on how your form is structured. This may include the type of reporting institution, project or other features.",
                        },
                    ],
                },
                {
                    path: "",
                    title: "Enter data in the form",
                    contents: [
                        {
                            type: "markdown",
                            text:
                                "![Enter data in the form](https://user-images.githubusercontent.com/2181866/94119753-9e4ded00-fe4f-11ea-90f5-890dada3e0a8.gif)\n\nStart entering data by clicking inside the first cell and either typing in the values or selecting them from the dropdown menus.\n\nThe values are saved immediately and do not require any save/finished button click. A green field indicates that the value has been saved in the system. Grey fields are those that are completed automatically by the DHIS2 system.",
                        },
                    ],
                },
                {
                    path: "",
                    title: "Correct your data",
                    contents: [
                        {
                            type: "markdown",
                            text:
                                "![Correct your data](https://user-images.githubusercontent.com/2181866/94119754-9e4ded00-fe4f-11ea-8854-ee7e333989cd.gif)\n\nIf you type in an invalid value or a value that is outside of a valid range, you will get a pop-up that explains the problem and the field will be coloured yellow (not saved) until you have corrected the value.",
                        },
                    ],
                },
                {
                    path: "",
                    title: "Run a validation check",
                    contents: [
                        {
                            type: "markdown",
                            text:
                                "![Run a validation check](https://user-images.githubusercontent.com/2181866/94119756-9ee68380-fe4f-11ea-99e3-88ad41e47c30.gif)\n\nClick “Run validation” to check that all the data that you have entered meet the rules built-in to the form for ensuring accuracy of the data.",
                        },
                    ],
                },
                {
                    path: "",
                    title: "Save and submit your form",
                    contents: [
                        {
                            type: "markdown",
                            text:
                                "![Save and submit your form](https://user-images.githubusercontent.com/2181866/94119736-9b52fc80-fe4f-11ea-98d0-5348d052462c.gif)\n\nClick “complete” to submit the data that you have entered to DHIS2.",
                        },
                    ],
                },
            ],
        };
    }
}
