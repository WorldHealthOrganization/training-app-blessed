import { Dhis2ConfigRepository } from "../data/repositories/Dhis2ConfigRepository";
import { InstanceDhisRepository } from "../data/repositories/InstanceDhisRepository";
import { TrainingModuleDefaultRepository } from "../data/repositories/TrainingModuleDefaultRepository";
import { CheckSettingsPermissionsUseCase } from "../domain/usecases/CheckSettingsPermissionsUseCase";
import { CompleteUserProgressUseCase } from "../domain/usecases/CompleteUserProgressUseCase";
import { DeleteModulesUseCase } from "../domain/usecases/DeleteModulesUseCase";
import { ExistsPoEditorTokenUseCase } from "../domain/usecases/ExistsPoEditorTokenUseCase";
import { FetchTranslationsUseCase } from "../domain/usecases/FetchTranslationsUseCase";
import { GetSettingsPermissionsUseCase } from "../domain/usecases/GetSettingsPermissionsUseCase";
import { InitializeTranslationsUseCase } from "../domain/usecases/InitializeTranslationsUseCase";
import { InstallAppUseCase } from "../domain/usecases/InstallAppUseCase";
import { ListModulesUseCase } from "../domain/usecases/ListModulesUseCase";
import { SavePoEditorTokenUseCase } from "../domain/usecases/SavePoEditorTokenUseCase";
import { SwapModuleOrderUseCase } from "../domain/usecases/SwapModuleOrderUseCase";
import { UpdateModuleUseCase } from "../domain/usecases/UpdateModuleUseCase";
import { UpdateSettingsPermissionsUseCase } from "../domain/usecases/UpdateSettingsPermissionsUseCase";
import { UpdateUserProgressUseCase } from "../domain/usecases/UpdateUserProgressUseCase";
import { UploadFileUseCase } from "../domain/usecases/UploadFileUseCase";
import { SearchUsersUseCase } from "../domain/usecases/SearchUsersUseCase";
import { ResetModuleToFactorySettingsUseCase } from "../domain/usecases/ResetModuleToFactorySettingsUseCase";

export function getCompositionRoot(baseUrl: string) {
    const configRepository = new Dhis2ConfigRepository(baseUrl);
    const instanceRepository = new InstanceDhisRepository(configRepository);
    const trainingModuleRepository = new TrainingModuleDefaultRepository(configRepository, instanceRepository);

    return {
        usecases: {
            modules: getExecute({
                list: new ListModulesUseCase(trainingModuleRepository),
                update: new UpdateModuleUseCase(trainingModuleRepository),
                delete: new DeleteModulesUseCase(trainingModuleRepository),
                swapOrder: new SwapModuleOrderUseCase(trainingModuleRepository),
                resetToFactorySettings: new ResetModuleToFactorySettingsUseCase(trainingModuleRepository),
            }),
            translations: getExecute({
                fetch: new FetchTranslationsUseCase(trainingModuleRepository),
                publishTerms: new InitializeTranslationsUseCase(trainingModuleRepository),
            }),
            progress: getExecute({
                update: new UpdateUserProgressUseCase(trainingModuleRepository),
                complete: new CompleteUserProgressUseCase(trainingModuleRepository),
            }),
            config: getExecute({
                getSettingsPermissions: new GetSettingsPermissionsUseCase(configRepository),
                updateSettingsPermissions: new UpdateSettingsPermissionsUseCase(configRepository),
                savePoEditorToken: new SavePoEditorTokenUseCase(configRepository),
                existsPoEditorToken: new ExistsPoEditorTokenUseCase(configRepository),
            }),
            user: getExecute({
                checkSettingsPermissions: new CheckSettingsPermissionsUseCase(configRepository),
            }),
            instance: getExecute({
                uploadFile: new UploadFileUseCase(instanceRepository),
                installApp: new InstallAppUseCase(instanceRepository, trainingModuleRepository),
                searchUsers: new SearchUsersUseCase(instanceRepository),
            }),
        },
    };
}

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;

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
