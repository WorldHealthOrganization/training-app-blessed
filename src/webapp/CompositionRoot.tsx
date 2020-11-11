import { TrainingModuleDefaultRepository } from "../data/repositories/TrainingModuleDefaultRepository";
import { TrainingModuleRepository } from "../domain/repositories/TrainingModuleRepository";
import { GetModuleUseCase } from "../domain/usecases/GetModuleUseCase";
import { ListModulesUseCase } from "../domain/usecases/ListModulesUseCase";
import { cache } from "../utils/cache";

export class CompositionRoot {
    private readonly trainingModuleRepository: TrainingModuleRepository;

    constructor() {
        this.trainingModuleRepository = new TrainingModuleDefaultRepository();
    }

    @cache()
    public get usecases() {
        return getExecute({
            listModules: new ListModulesUseCase(),
            getModule: new GetModuleUseCase(this.trainingModuleRepository),
        });
    }
}

function getExecute<UseCases extends Record<Key, UseCase>, Key extends keyof UseCases>(
    useCases: UseCases
): { [K in Key]: UseCases[K]["execute"] } {
    const keys = Object.keys(useCases) as Key[];
    const initialOutput = {} as { [K in Key]: UseCases[K]["execute"] };

    return keys.reduce((output, key) => {
        const useCase = useCases[key];
        const execute = useCase.execute.bind(useCase) as UseCases[typeof key]["execute"];
        output[key] = execute;
        return output;
    }, initialOutput);
}

export interface UseCase {
    execute: Function;
}
