import { Dhis2ConfigRepository } from "../data/repositories/Dhis2ConfigRepository";
import { InstanceDhisRepository } from "../data/repositories/InstanceDhisRepository";
import { LandingPageDefaultRepository } from "../data/repositories/LandingPageDefaultRepository";
import { TrainingModuleDefaultRepository } from "../data/repositories/TrainingModuleDefaultRepository";
import { CheckSettingsPermissionsUseCase } from "../domain/usecases/CheckSettingsPermissionsUseCase";
import { CompleteUserProgressUseCase } from "../domain/usecases/CompleteUserProgressUseCase";
import { DeleteLandingChildUseCase } from "../domain/usecases/DeleteLandingChildUseCase";
import { DeleteModulesUseCase } from "../domain/usecases/DeleteModulesUseCase";
import { ExportLandingPagesUseCase } from "../domain/usecases/ExportLandingPagesUseCase";
import { ExportModulesUseCase } from "../domain/usecases/ExportModulesUseCase";
import { ExportTranslationsUseCase } from "../domain/usecases/ExportTranslationsUseCase";
import { GetModuleUseCase } from "../domain/usecases/GetModuleUseCase";
import { GetSettingsPermissionsUseCase } from "../domain/usecases/GetSettingsPermissionsUseCase";
import { GetShowAllModulesUseCase } from "../domain/usecases/GetShowAllModulesUseCase";
import { ImportLandingPagesUseCase } from "../domain/usecases/ImportLandingPagesUseCase";
import { ImportModulesUseCase } from "../domain/usecases/ImportModulesUseCase";
import { ImportTranslationsUseCase } from "../domain/usecases/ImportTranslationsUseCase";
import { InstallAppUseCase } from "../domain/usecases/InstallAppUseCase";
import { ListInstalledAppsUseCase } from "../domain/usecases/ListInstalledAppsUseCase";
import { ListLandingChildrenUseCase } from "../domain/usecases/ListLandingChildrenUseCase";
import { ListModulesUseCase } from "../domain/usecases/ListModulesUseCase";
import { ResetModuleDefaultValueUseCase } from "../domain/usecases/ResetModuleDefaultValueUseCase";
import { SearchUsersUseCase } from "../domain/usecases/SearchUsersUseCase";
import { SetShowAllModulesUseCase } from "../domain/usecases/SetShowAllModulesUseCase";
import { SwapModuleOrderUseCase } from "../domain/usecases/SwapModuleOrderUseCase";
import { UpdateLandingChildUseCase } from "../domain/usecases/UpdateLandingChildUseCase";
import { UpdateModuleUseCase } from "../domain/usecases/UpdateModuleUseCase";
import { UpdateSettingsPermissionsUseCase } from "../domain/usecases/UpdateSettingsPermissionsUseCase";
import { UpdateUserProgressUseCase } from "../domain/usecases/UpdateUserProgressUseCase";
import { UploadFileUseCase } from "../domain/usecases/UploadFileUseCase";

export function getCompositionRoot(baseUrl: string) {
    const configRepository = new Dhis2ConfigRepository(baseUrl);
    const instanceRepository = new InstanceDhisRepository(configRepository);
    const trainingModuleRepository = new TrainingModuleDefaultRepository(configRepository, instanceRepository);
    const landingPageRepository = new LandingPageDefaultRepository(configRepository, instanceRepository);

    return {
        usecases: {
            modules: getExecute({
                get: new GetModuleUseCase(trainingModuleRepository),
                list: new ListModulesUseCase(trainingModuleRepository),
                update: new UpdateModuleUseCase(trainingModuleRepository),
                delete: new DeleteModulesUseCase(trainingModuleRepository),
                swapOrder: new SwapModuleOrderUseCase(trainingModuleRepository),
                resetDefaultValue: new ResetModuleDefaultValueUseCase(trainingModuleRepository),
                export: new ExportModulesUseCase(trainingModuleRepository),
                import: new ImportModulesUseCase(trainingModuleRepository),
            }),
            landings: getExecute({
                list: new ListLandingChildrenUseCase(landingPageRepository),
                update: new UpdateLandingChildUseCase(landingPageRepository),
                delete: new DeleteLandingChildUseCase(landingPageRepository),
                export: new ExportLandingPagesUseCase(landingPageRepository),
                import: new ImportLandingPagesUseCase(landingPageRepository),
            }),
            translations: getExecute({
                export: new ExportTranslationsUseCase(trainingModuleRepository),
                import: new ImportTranslationsUseCase(trainingModuleRepository),
            }),
            progress: getExecute({
                update: new UpdateUserProgressUseCase(trainingModuleRepository),
                complete: new CompleteUserProgressUseCase(trainingModuleRepository),
            }),
            config: getExecute({
                getSettingsPermissions: new GetSettingsPermissionsUseCase(configRepository),
                updateSettingsPermissions: new UpdateSettingsPermissionsUseCase(configRepository),
                getShowAllModules: new GetShowAllModulesUseCase(configRepository),
                setShowAllModules: new SetShowAllModulesUseCase(configRepository),
            }),
            user: getExecute({
                checkSettingsPermissions: new CheckSettingsPermissionsUseCase(configRepository),
            }),
            instance: getExecute({
                uploadFile: new UploadFileUseCase(instanceRepository),
                installApp: new InstallAppUseCase(instanceRepository, trainingModuleRepository),
                searchUsers: new SearchUsersUseCase(instanceRepository),
                listInstalledApps: new ListInstalledAppsUseCase(instanceRepository),
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
