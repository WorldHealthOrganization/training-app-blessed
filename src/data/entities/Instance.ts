export interface Instance {
    url: string;
    username?: string;
    password?: string;
}

export class Instance implements Instance {
    public get auth(): { username: string; password: string } | undefined {
        return this.username && this.password
            ? { username: this.username, password: this.password }
            : undefined;
    }
}
