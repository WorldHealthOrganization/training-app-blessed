import { Dhis2ConfigRepository } from "../data/repositories/Dhis2ConfigRepository";
import { TrainingModuleDefaultRepository } from "../data/repositories/TrainingModuleDefaultRepository";
import { ConfigRepository } from "../domain/repositories/ConfigRepository";
import { TrainingModuleRepository } from "../domain/repositories/TrainingModuleRepository";
import { CompleteUserProgressUseCase } from "../domain/usecases/CompleteUserProgressUseCase";
import { CreateModuleUseCase } from "../domain/usecases/CreateModuleUseCase";
import { DeleteModulesUseCase } from "../domain/usecases/DeleteModulesUseCase";
import { EditModuleUseCase } from "../domain/usecases/EditModuleUseCase";
import { ExistsPoEditorTokenUseCase } from "../domain/usecases/ExistsPoEditorTokenUseCase";
import { ListModulesUseCase } from "../domain/usecases/ListModulesUseCase";
import { SavePoEditorTokenUseCase } from "../domain/usecases/SavePoEditorTokenUseCase";
import { SwapModuleOrderUseCase } from "../domain/usecases/SwapModuleOrderUseCase";
import { SyncTranslationsUseCase } from "../domain/usecases/SyncTranslationsUseCase";
import { UpdateUserProgressUseCase } from "../domain/usecases/UpdateUserProgressUseCase";
import { cache } from "../utils/cache";

export class CompositionRoot {
    private readonly configRepository: ConfigRepository;
    private readonly trainingModuleRepository: TrainingModuleRepository;

    constructor(baseUrl: string) {
        this.configRepository = new Dhis2ConfigRepository(baseUrl);
        this.trainingModuleRepository = new TrainingModuleDefaultRepository(this.configRepository);
    }

    @cache()
    public get usecases() {
        return {
            modules: getExecute({
                list: new ListModulesUseCase(this.trainingModuleRepository),
                create: new CreateModuleUseCase(this.trainingModuleRepository),
                delete: new DeleteModulesUseCase(this.trainingModuleRepository),
                edit: new EditModuleUseCase(this.trainingModuleRepository),
                swapOrder: new SwapModuleOrderUseCase(this.trainingModuleRepository),
                syncTranslations: new SyncTranslationsUseCase(this.trainingModuleRepository),
            }),
            progress: getExecute({
                update: new UpdateUserProgressUseCase(this.trainingModuleRepository),
                complete: new CompleteUserProgressUseCase(this.trainingModuleRepository),
            }),
            config: getExecute({
                savePoEditorToken: new SavePoEditorTokenUseCase(this.configRepository),
                existsPoEditorToken: new ExistsPoEditorTokenUseCase(this.configRepository),
            }),
        };
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
