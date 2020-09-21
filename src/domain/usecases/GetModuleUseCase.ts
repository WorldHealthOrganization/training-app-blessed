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
                                "![https://user-images.githubusercontent.com/2181866/93662240-058a2c80-fa5f-11ea-832f-6c18ae922e80.png](https://user-images.githubusercontent.com/2181866/93662240-058a2c80-fa5f-11ea-832f-6c18ae922e80.png)\n\nA quick way to find a location (organisation unit) is to use the search box above the tree (the green symbol).\n\nType in the name or first few letters of your location, and select it from the drop-down menu by clicking on it to highlight it orange.\n\nThis will enter the location in the Organisation Unit field of your data entry form.",
                        },
                        {
                            type: "markdown",
                            text:
                                "![location2](https://user-images.githubusercontent.com/2181866/93707577-35553500-fb30-11ea-99be-b835bc5da7bf.png)\n\nAnother way to find your location (organisation unit) is to search the hierarchy tree menu.\n\nExpand and close the branches by clicking on the +/- symbols. Click on your organisation unit name to highlight it orange and this will enter the location in the Organisation Unit field of your data entry form. ",
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
                                "![dataset](https://user-images.githubusercontent.com/2181866/93707575-34bc9e80-fb30-11ea-9994-0e0175a191b5.png)\n\nSelect a data set from the dropdown list of data sets available to your selected location. Note that not all data sets are available for all organisation units. The data set you select will create a form with similar fields to your paper based form. ",
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
                                "![time1](https://user-images.githubusercontent.com/2181866/93707580-35edcb80-fb30-11ea-832b-704d90d0f1a4.png)\n\nSelect a period for which to register data. The available periods are determined by the reporting frequency required for the selected form.",
                        },
                        {
                            type: "markdown",
                            text:
                                "![time2](https://user-images.githubusercontent.com/2181866/93707581-36866200-fb30-11ea-9f4d-8909e5c690fb.png)\n\nYou can also jump a year back or forward by using the arrows next to the period.",
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
                                "![dataset](https://user-images.githubusercontent.com/2181866/93707575-34bc9e80-fb30-11ea-9994-0e0175a191b5.png)\n\nBy now you should see the data entry form. If not, there may be additional data dimensions that you need to select from drop-down menus, depending on how your form is structured. This may include the type of reporting institution, project or other features.",
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
                                "![data](https://user-images.githubusercontent.com/2181866/93707574-34240800-fb30-11ea-973c-d0f6622af076.png)\n\nStart entering data by clicking inside the first cell and either typing in the values or selecting them from the dropdown menus.\n\nThe values are saved immediately and do not require any save/finished button click. A green field indicates that the value has been saved in the system. Grey fields are those that are completed automatically by the DHIS2 system.",
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
                                "![correct](https://user-images.githubusercontent.com/2181866/93707583-36866200-fb30-11ea-957e-7bd91f5e04da.png)\n\nIf you type in an invalid value or a value that is outside of a valid range, you will get a pop-up that explains the problem and the field will be coloured yellow (not saved) until you have corrected the value.",
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
                                "![validation](https://user-images.githubusercontent.com/2181866/93707582-36866200-fb30-11ea-8736-2ae535147343.png)\n\nClick “Run validation” to check that all the data that you have entered meet the rules built-in to the form for ensuring accuracy of the data.",
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
                                "![submit](https://user-images.githubusercontent.com/2181866/93707579-35edcb80-fb30-11ea-8451-1d3d2cab6bf6.png)\n\nClick “complete” to submit the data that you have entered to DHIS2.",
                        },
                    ],
                },
            ],
        };
    }
}
