import { UseCase } from "../../webapp/CompositionRoot";

export class ListModulesUseCase implements UseCase {
    public async execute() {
        return [
            { name: "Dashboards", key: "dashboard", progress: 100 },
            { name: "Data entry", key: "data-entry", progress: 50 },
            { name: "Event capture", key: "event-capture", progress: 0 },
            { name: "Chart builder", key: "chart-builder", progress: 0 },
            { name: "Data visualization", key: "data-visualization", progress: 0 },
            { name: "Pivot tables", key: "pivot-table", progress: 0 },
            { name: "Maps", key: "maps", progress: 20 },
            { name: "Bulk Load", key: "bulk-load", progress: 0 },
        ];
    }
}
