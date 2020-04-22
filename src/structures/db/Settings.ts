import { Entity, PrimaryColumn, Column } from 'typeorm';

export interface Settings {
    general: {
        prefix: string;
        preferEmbeds: boolean;
    },
    channels: {
        main: string;
        memberLog: string;
        modLog: string;
        welcome: {
            default: 'Welcome to {servername}, {mention}!';
            custom: boolean;
            value: string;
        },
        leave: {
            default: '{mention} has left the server.';
            custom: boolean;
            value: string;
        }
    },
    modules: {
        leveling: {
            active: boolean;
            ppmRange: Array<number>;
            maxPPH: number;
            levels: Array<{
                points: number;
                role: string;
                default: 'Congrats {tag}, you\'re level {level}!';
                custom: boolean;
                value: string;
            }>;
        },
        music: {
            active: boolean;
            sources: Set<'yt' | 'sc' | 'uf'>;
        },
        tags: {
            active: boolean;
            allowedChannels: Array<string>,
            disallowed: Array<string>
        },
        fileUploading: {
            active: boolean;
            useDMs: boolean;
            allowReactions: boolean;
            autoReact: boolean;
        },
        randomImage: {
            active: boolean;
            allowedChannels: Array<string>
        }
    },
    moderation: {
        tokenFiltering: boolean;
        usePerms: boolean;
        alertUnauth: boolean;
        mods: string[];
        profanity: {
            active: boolean;
            strict: 1 | 2 | 3;
        };
        blacklist: string[];
        perCommandBlacklist: {
            [command: string]: string[];
        }
    }
}

export const defaults: Settings = {
    general: {
        prefix: ';',
        preferEmbeds: true
    },
    channels: {
        main: '',
        memberLog: '',
        modLog: '',
        welcome: {
            default: 'Welcome to {servername}, {mention}!',
            custom: false,
            value: '',
        },
        leave: {
            default: '{mention} has left the server.',
            custom: false,
            value: ''
        }
    },
    modules: {
        leveling: {
            active: false,
            ppmRange: [0, 100],
            maxPPH: 15,
            levels: [
                {
                    points: 500,
                    role: '',
                    default: 'Congrats {tag}, you\'re level {level}!',
                    custom: false,
                    value: ''
                }
            ]
        },
        music: {
            active: true,
            sources: new Set(['yt', 'sc', 'uf'])
        },
        tags: {
            active: true,
            allowedChannels: [],
            disallowed: []
        },
        fileUploading: {
            active: true,
            useDMs: false,
            allowReactions: true,
            autoReact: false
        },
        randomImage: {
            active: false,
            allowedChannels: []
        }
    },
    moderation: {
        tokenFiltering: true,
        usePerms: true,
        alertUnauth: true,
        mods: [],
        profanity: {
            active: true,
            strict: 2
        },
        blacklist: [],
        perCommandBlacklist: {}
    }
};

@Entity()
export class SettingsEntity {
    @PrimaryColumn()
    id!: string;

    @Column({ name: 'data', type: 'json' })
    data!: Settings;
}