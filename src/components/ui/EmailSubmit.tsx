import { useEffect, useState } from "react";
import { Input } from "./input";
import Button from "./Button.tsx";

interface EmailSubmitProps {
    isHidden?: boolean;
    lang?: string;
    plan?: string;
    recurrence?: string;
    os?: string;
    app?: string;
    flow?: string;
    formAuth?: boolean;
    buttonText?: string;
    variant?: "primary" | "outline";
}

export const EmailSubmit = ({
    isHidden = false,
    lang = "en",
    plan = "",
    recurrence = "",
    os = "",
    app = "",
    flow = "",
    formAuth = true,
    buttonText = "Começar agora",
    variant = "primary",
}: EmailSubmitProps) => {
    const [email, setEmail] = useState<string>("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlEmail = params.get("email");

        if (urlEmail) {
            const decodedEmail = decodeURIComponent(urlEmail);
            setEmail(decodedEmail);
        }
    }, []);

    useEffect(() => {
        // Load the external script
        const script = document.createElement("script");
        script.src = "./src/api/kyteAuth.js";
        script.async = true;
        document.body.appendChild(script);

        // Cleanup
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <form
            id="kyte-form-auth"
            method="get"
            className="flex flex-col gap-4 w-full max-w-[320px]"
            data-kyte-form-auth={formAuth}
            data-kyte-lang={lang}
            data-kyte-plan={plan}
            data-kyte-recurrence={recurrence}
            data-kyte-os={os}
            data-kyte-app={app}
            data-kyte-flow={flow}
        >
            {/* Render email input */}
            {isHidden ? (
                <input type="hidden" name="email" value={email} />
            ) : (
                <Input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nome@email.com.br"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#2DD1AC]"
                    required
                />
            )}

            {/* Submit button */}
            <Button variant={variant} type="submit">
                {buttonText}
            </Button>
        </form>
    );
};

EmailSubmit.displayName = "EmailSubmit";