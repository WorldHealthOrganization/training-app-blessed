import { UseCase } from "../../webapp/CompositionRoot";

export class ListModulesUseCase implements UseCase {
    public async execute() {
        return [
            { name: "Dashboards", progress: 100 },
            { name: "Data entry", progress: 50 },
            { name: "Event capture", progress: 0 },
            { name: "Chart builder", progress: 0 },
            { name: "Data visualization", progress: 0 },
            { name: "Pivot tables", progress: 0 },
            { name: "Maps", progress: 20 },
            { name: "Bulk Load", progress: 0 },
        ];
    }
}
