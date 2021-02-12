export interface InstanceRepository {
    uploadFile(file: ArrayBuffer): Promise<string>;
    installApp(appId: string): Promise<boolean>;
    isAppInstalledByUrl(launchUrl: string): Promise<boolean>;
}
