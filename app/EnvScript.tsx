import Script from 'next/script';
import { useEffect } from "react";

declare global {
    interface Window {
        __ENV__: Record<string, string>;
    }
}

interface EnvScriptProps {
    env: Record<string, string | undefined>;
}

export default function EnvScript({ env }: EnvScriptProps) {
    const envJson = JSON.stringify(env);

    return (
        <Script
            id="env-vars"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
                __html: `window.__ENV__ = ${envJson};`,
            }}
        />
    );
}
