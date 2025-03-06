interface H4Props {
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

export default function h2({ children, color = "kyte-gray", align = "center-all" }: H4Props) {
    return (
        <h4
            className={`text-xl font-medium my-2 leading-relaxed max-w-xl mx-auto ${alignMap[align]}`}
            style={{ color: colorMap[color] }}
        >
            {children}
        </h4>
    );
}