import { existsSync, readFileSync, writeFileSync } from "fs";

const defaultConfig: ConfigContainer = {
    ignore_courses: [],
    imap: {
        user: "",
        password: "",
        from_mail: "",
        school_name: "",
        student_name: "",
    },
    discord: {
        token: "",
        channel: "",
    },
    line: {
        token: "",
        group: "",
    },
    lineWebhook: {
        enabled: false,
        port: 5678,
        secret: "",
    }
}

export default class ConfigUtil {
    private static config: ConfigContainer | null = null;

    public static loadConfig(): void {
        if (existsSync("./config.json")) {
            const file = readFileSync("./config.json", "utf8");
            try {
                this.config = JSON.parse(file) as ConfigContainer;
            } catch {
                this.config = defaultConfig;
            }
        } else {
            this.config = defaultConfig;
        }
        this.saveConfig();
    }

    public static getConfig(): ConfigContainer {
        return this.config as ConfigContainer;
    }

    public static saveConfig(): void {
        writeFileSync("./config.json", JSON.stringify(this.getConfig(), null, 4));
    }

    public static checkIfEmpty(data: IMAP | Discord | Line): boolean {
        for (let entry of Object.values(data)) {
            if (entry == "") {
                return false;
            }
        }
        return true;
    }

    public static checkIfIgnoreCourse(title: string) {
        for (let course of this.getConfig().ignore_courses) {
            if (title.includes(`【${course}】`)) {
                return true;
            }
        }
        return false;
    }
}

interface ConfigContainer {
    ignore_courses: Array<string>,
    imap: IMAP;
    discord: Discord;
    line: Line;
    lineWebhook: LineWebhook;
}

interface IMAP {
    user: string;
    password: string;
    from_mail: string,
    school_name: string,
    student_name: string;
}

interface Discord {
    token: string;
    channel: string;
}

interface Line {
    token: string;
    group: string;
}

interface LineWebhook {
    enabled: boolean;
    port: number,
    secret: string;
}