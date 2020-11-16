import { TrainingModuleDefaultRepository } from "../data/repositories/TrainingModuleDefaultRepository";
import { ConfigDataSource } from "../data/sources/config/ConfigDataSource";
import { Dhis2ConfigDataSource } from "../data/sources/config/Dhis2ConfigDataSource";
import { TrainingModuleRepository } from "../domain/repositories/TrainingModuleRepository";
import { CreateModuleUseCase } from "../domain/usecases/CreateModuleUseCase";
import { DeleteModulesUseCase } from "../domain/usecases/DeleteModulesUseCase";
import { EditModuleUseCase } from "../domain/usecases/EditModuleUseCase";
import { GetModuleUseCase } from "../domain/usecases/GetModuleUseCase";
import { ListModulesUseCase } from "../domain/usecases/ListModulesUseCase";
import { cache } from "../utils/cache";

export class CompositionRoot {
    private readonly configDataSource: ConfigDataSource;
    private readonly trainingModuleRepository: TrainingModuleRepository;

    constructor(baseUrl: string) {
        this.configDataSource = new Dhis2ConfigDataSource(baseUrl);
        this.trainingModuleRepository = new TrainingModuleDefaultRepository(this.configDataSource);
    }

    @cache()
    public get usecases() {
        return getExecute({
            listModules: new ListModulesUseCase(this.trainingModuleRepository),
            getModule: new GetModuleUseCase(this.trainingModuleRepository),
            createModule: new CreateModuleUseCase(this.trainingModuleRepository),
            deleteModules: new DeleteModulesUseCase(this.trainingModuleRepository),
            editModule: new EditModuleUseCase(this.trainingModuleRepository)
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
