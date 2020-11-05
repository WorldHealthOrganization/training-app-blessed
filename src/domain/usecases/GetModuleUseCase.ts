import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModule } from "../entities/TrainingModule";
import module1 from "../../data/assets/modules/data-entry-module.json";

export class GetModuleUseCase implements UseCase {
    public async execute(): Promise<TrainingModule> {
        console.log(module1);
        return (module1 as unknown) as TrainingModule;
    }
}
