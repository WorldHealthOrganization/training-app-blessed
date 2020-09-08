const isDevelopment = process.env.NODE_ENV === "development";
const isTest = process.env.JEST_WORKER_ID !== undefined;

export const log = (...message: unknown[]) => {
    if (isDevelopment && !isTest) console.log("[Training]", ...message);
};
