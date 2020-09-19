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
            details: {
                title: "Welcome to the tutorial on Data Entry",
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
                                "A quick way to find a location (organisation unit) is to use the search box above the tree (the green symbol).\n\n![https://user-images.githubusercontent.com/2181866/93662240-058a2c80-fa5f-11ea-832f-6c18ae922e80.png](https://user-images.githubusercontent.com/2181866/93662240-058a2c80-fa5f-11ea-832f-6c18ae922e80.png)\n\nType in the name or first few letters of your location, and select it from the drop-down menu by clicking on it to highlight it orange.\n\nThis will enter the location in the Organisation Unit field of your data entry form.",
                        },
                        {
                            type: "markdown",
                            text:
                                "Another way to find your location (organisation unit) is to search the hierarchy tree menu.\n\nExpand and close the branches by clicking on the +/- symbols. Click on your organisation unit name to highlight it orange and this will enter the location in the Organisation Unit field of your data entry form. ",
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
                                "Select a data set from the dropdown list of data sets available to your selected location. Note that not all data sets are available for all organisation units. The data set you select will create a form with similar fields to your paper based form. ",
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
                                "Select a period for which to register data. The available periods are determined by the reporting frequency required for the selected form.",
                        },
                        {
                            type: "markdown",
                            text:
                                "You can also jump a year back or forward by using the arrows next to the period.",
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
                                "By now you should see the data entry form. If not, there may be additional data dimensions that you need to select from drop-down menus, depending on how your form is structured. This may include the type of reporting institution, project or other features.",
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
                                "Start entering data by clicking inside the first cell and either typing in the values or selecting them from the dropdown menus.\n\nThe values are saved immediately and do not require any save/finished button click. A green field indicates that the value has been saved in the system. Grey fields are those that are completed automatically by the DHIS2 system.",
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
                                "If you type in an invalid value or a value that is outside of a valid range, you will get a pop-up that explains the problem and the field will be coloured yellow (not saved) until you have corrected the value.",
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
                                "Click “Run validation” to check that all the data that you have entered meet the rules built-in to the form for ensuring accuracy of the data.",
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
                                "Click “complete” to submit the data that you have entered to DHIS2.",
                        },
                    ],
                },
            ],
        };
    }
}
