import { useEffect, useState } from "react";

interface RedirectButtonProps {
    buttonText?: string;
    redirectUrl?: string;
    os: string;
    flow: string;
    app: string;
    lang: string;
    recurrence: string;
    plan: string;
    variant?: 'primary' | 'secondary';
}

const RedirectButton = ({
    buttonText = "Começar agora",
    redirectUrl = "https://kyteapp.com/loading",
    os,
    flow,
    app,
    lang,
    recurrence,
    plan,
    variant = 'primary',
}: RedirectButtonProps) => {
    const [email, setEmail] = useState<string>("");

    useEffect(() => {

        const params = new URLSearchParams(window.location.search);
        const urlEmail = params.get("email");

        const storedData = localStorage.getItem("kyteFormData");
        const storedEmail = storedData ? JSON.parse(storedData).email : null;

        if (urlEmail) {
            setEmail(decodeURIComponent(urlEmail));
        } else if (storedEmail) {
            setEmail(storedEmail);
        } else {
        }
    }, []);

    const handleRedirect = () => {
        if (!email) {
            alert("Por favor, insira um e-mail válido.");
            return;
        }

        const encodedEmail = encodeURIComponent(email);
        const finalURL = `${redirectUrl}?email=${encodedEmail}&os=${os}&flow=${flow}&app=${app}&lang=${lang}&recurrence=${recurrence}&plan=${plan}`;

        console.log("🔗 Redirecting to:", finalURL);

        window.location.href = finalURL;
    };

    return (
        <div className="flex flex-col my-6 w-full max-w-[320px]">
            <button
                className={`px-6 py-3 rounded-lg font-semibold cursor-pointer ${variant === 'primary'
                    ? 'bg-green03 text-white'
                    : 'bg-white text-green03 border border-green03'
                    }`}
                onClick={handleRedirect}
            >
                {buttonText}
            </button>
        </div>
    );
};

export default RedirectButton;