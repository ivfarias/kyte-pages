interface TextProps {
    children: React.ReactNode;
    color?: "white" | "kyte-green" | "kyte-gray" | "secondary-gray";
    size?: "extra-small" | "small" | "medium" | "large" | "extra-large";
    align?: "center-all" | "center-desktop" | "center-mobile" |
    "left-all" | "left-desktop" | "left-mobile" |
    "right-all" | "right-desktop" | "right-mobile";
    id?: string;
    className?: string;
}

const colorMap = {
    "white": "#FFFFFF",
    "kyte-green": "#2DD1AC",
    "kyte-gray": "#363F4D",
    "secondary-gray": "#808C9E"
};

const sizeMap = {
    "extra-small": "text-xs",
    "small": "text-sm",
    "medium": "text-base",
    "large": "text-lg",
    "extra-large": "text-xl"
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

export default function Text({
    children,
    color = "kyte-gray",
    size = "medium",
    align = "left-all",
    id,
    className
}: TextProps) {
    return (
        <p
            id={id}
            className={`font-graphik ${sizeMap[size]} ${alignMap[align]} ${className || ''}`}
            style={{ color: colorMap[color] }}
        >
            {children}
        </p>
    );
}