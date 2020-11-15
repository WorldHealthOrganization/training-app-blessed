import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModule } from "../entities/TrainingModule";
import { TrainingModuleRepository } from "../repositories/TrainingModuleRepository";

export class ListModulesUseCase implements UseCase {
    constructor(private trainingModuleRepository: TrainingModuleRepository) {}

    public async execute(): Promise<TrainingModule[]> {
        return this.trainingModuleRepository.list();
    }
}

export const oldModules = [
    { name: "Dashboards", key: "dashboard", progress: 100, disabled: true },
    { name: "Data entry", key: "data-entry", progress: 50 },
    { name: "Event capture", key: "event-capture", progress: 0, disabled: true },
    { name: "Chart builder", key: "chart-builder", progress: 0, disabled: true },
    { name: "Data visualization", key: "data-visualization", progress: 0, disabled: true },
    { name: "Pivot tables", key: "pivot-table", progress: 0, disabled: true },
    { name: "Maps", key: "maps", progress: 20, disabled: true },
    { name: "Bulk load", key: "bulk-load", progress: 0, disabled: true },
];
