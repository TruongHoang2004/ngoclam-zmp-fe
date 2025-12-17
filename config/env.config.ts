

declare global {
    interface Window {
        __ENV__: Record<string, string>;
    }
}

const getEnv = (key: string, defaultValue: string = ''): string => {
    if (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__[key]) {
        return window.__ENV__[key];
    }
    return process.env[key] || defaultValue;
};

const config = {
    backend: {
        apiBaseUrl: getEnv('NEXT_PUBLIC_API_BASE_URL'),
    },
}

export default config;