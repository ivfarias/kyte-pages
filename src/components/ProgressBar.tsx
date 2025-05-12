import { Progress } from "@material-tailwind/react/components/Progress";
import React from "react";

interface ProgressLabelOutsideProps {
    /** Main title text (can contain HTML) */
    title: string;
    /** Optional description text that appears below the title */
    description?: string;
    /** Progress percentage (0-100) */
    percentage: number;
    /** Color class name for the title text (without the 'text-' prefix) */
    titleColor?: string;
    /** Color class name for the description text (without the 'text-' prefix) */
    descriptionColor?: string;
    /** Color for the progress bar from Material Tailwind palette */
    barColor?: "blue" | "orange" | "red" | "teal" | "blue-gray" | "green" | "purple" | "indigo" | "pink" | "amber" | "gray";
    /** Optional custom styles for the progress bar */
    customBarStyles?: React.CSSProperties;
    /** Color class name for the background (without the 'bg-' prefix) */
    backgroundColor?: string;
}

export function ProgressLabelOutside({
    title = "Progress",
    description,
    percentage = 0,
    titleColor = "white",
    descriptionColor = "gray-400",
    barColor = "teal",
    customBarStyles,
    backgroundColor = "gray09"
}: ProgressLabelOutsideProps) {
    const validPercentage = Math.max(0, Math.min(100, percentage));

    // Safe HTML rendering
    const createMarkup = (htmlContent: string) => {
        return { __html: htmlContent };
    };

    // Get background color styles - use inline style instead of Tailwind class
    const getBackgroundColorStyle = () => {
        const colorMap: { [key: string]: string } = {
            'gray08': '#E8E9EA',
            'gray09': '#EFF1F3',
            'gray10': "#F7F7F8",
            'green07': '#DDF7F2',
            'green08': '#E3F6F1',
            // Add any other background colors you might use
        };

        return { backgroundColor: colorMap[backgroundColor] || '#EFF1F3' };  // Default to gray09
    };

    // Get text color styles
    const getTextColorStyle = (color: string) => {
        const colorMap: { [key: string]: string } = {
            'gray02': '#363F4D',
            'green04': '#2DD1AC',
            // Add any other text colors you might use
        };

        return { color: colorMap[color] || '#363F4D' };  // Default to gray02
    };

    return (
        <div className="w-full py-3 px-4 rounded-md" style={getBackgroundColorStyle()}>
            <div className="mb-3 flex flex-col items-start justify-start">
                <div className="flex items-center justify-between w-full">
                    <div
                        className="text-sm font-medium"
                        style={getTextColorStyle(titleColor)}
                        dangerouslySetInnerHTML={createMarkup(title)}
                    />
                    <div className="text-sm" style={getTextColorStyle(titleColor)}>
                        {validPercentage}%
                    </div>
                </div>

                {description && (
                    <div className="text-xs mt-1" style={getTextColorStyle(descriptionColor)}>
                        {description}
                    </div>
                )}
            </div>
            <Progress
                value={validPercentage}
                color={barColor}
                barProps={{
                    style: customBarStyles
                }}
                placeholder=""
                onPointerEnterCapture={() => { }}
                onPointerLeaveCapture={() => { }}
            />
        </div>
    );
}