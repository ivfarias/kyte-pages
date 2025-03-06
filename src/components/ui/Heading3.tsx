interface H3Props {
    children: React.ReactNode;
    color?: "white" | "kyte-green" | "kyte-gray";
    align?: "center-all" | "center-desktop" | "center-mobile" |
    "left-all" | "left-desktop" | "left-mobile" |
    "right-all" | "right-desktop" | "right-mobile";
    id?: string;
    className?: string;
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

export default function h3({ children, color = "kyte-gray", align = "center-all", id, className }: H3Props) {
    return (
        <h3
            id={id}
            className={`text-2xl font-medium my-8 leading-relaxed max-w-xl mx-auto ${alignMap[align]} ${className || ''}`}
            style={{ color: colorMap[color] }}
        >
            {children}
        </h3>
    );
}