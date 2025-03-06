interface ButtonProps {
    children: React.ReactNode;
    variant: "primary" | "outline";
    href?: string;
    type?: "button" | "submit" | "reset";
}

export default function Button({ children, variant = "primary", href, type }: ButtonProps) {
    const styles = {
        primary: "bg-[#2DD1AC] text-white hover:bg-[#25b795]",
        outline: "bg-white text-[#2DD1AC] border-2 border-[#2DD1AC] hover:bg-[#f8f8f8]"
    };

    const Component = href ? 'a' : 'button';
    
    return (
        <Component
            href={href}
            type={type}
            className={`${styles[variant]} inline-block text-center px-6 py-3 rounded-lg font-medium transition-colors duration-200 my-4 max-w-[320px] min-w-[300px] w-full`}
        >
            {children}
        </Component>
    );
}