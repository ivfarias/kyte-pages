interface H1Props {
    children: React.ReactNode;
    color?: "white" | "kyte-green" | "kyte-gray";
    align?: "center-all" | "center-desktop" | "center-mobile" |
    "left-all" | "left-desktop" | "left-mobile" |
    "right-all" | "right-desktop" | "right-mobile";
}

const colorMap = {
    "white": "#FFFFFF",
    "kyte-green": "#2DD1AC",
    "kyte-gray": "#363F4D"
};

const alignMap = {
    "center-all": "text-center",
    "center-desktop": "text-left md:text-center",
    "center-mobile": "text-center md:text-left",
    "left-all": "text-left",
    "left-desktop": "text-center md:text-left",
    "left-mobile": "text-left md:text-center",
    "right-all": "text-right",
    "right-desktop": "text-center md:text-right",
    "right-mobile": "text-right md:text-center"
};

export default function H1({ children, color = "kyte-gray", align = "center-all" }: H1Props) {
    return (
        <h1
            className={`text-4xl leading-[1.2] md:leading-[1.2] md:text-6xl font-medium mt-8 mb-6 max-w-xl mx-auto ${alignMap[align]}`}
            style={{ color: colorMap[color] }}
        >
            {children}
        </h1>
    );
}