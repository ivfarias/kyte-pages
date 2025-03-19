import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw"; // Enables inline HTML
import remarkGfm from "remark-gfm"; // Enables GitHub-style Markdown (tables, strikethrough, etc.)

interface MarkdownContentProps {
    content: string;
    className?: string;
}

const MarkdownContent = ({ content, className = "" }: MarkdownContentProps) => {
    const [processedContent, setProcessedContent] = useState(content);

    useEffect(() => {
        try {
            const data = JSON.parse(localStorage.getItem("idealPriceCalculatorData") || "{}");
            let newContent = content;

            newContent = newContent.replace(/\{\s*([a-zA-Z0-9_.]+)(?:\.toFixed\((\d+)\))?\s*\}/g, (match, path, decimals) => {
                const parts = path.split(".");
                let value: any = data;
                for (const part of parts) {
                    if (value === undefined || value === null) return match;
                    value = value[part];
                }
                if (value === undefined || value === null) return match;
                if (typeof value === "string") value = value.trim();
                if (decimals !== undefined && typeof value === "number") {
                    return value.toFixed(parseInt(decimals));
                }
                return value.toString();
            });

            setProcessedContent(newContent);
        } catch (error) {
            console.error("Error processing markdown content:", error);
            setProcessedContent(content);
        }
    }, [content]);

    return (
        <div className={`prose prose-xl ${className}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {processedContent}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownContent;