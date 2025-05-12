interface GaugeProps {
    idealPrice: number;
    marketLowestPrice: number;
    marketMediumPrice: number;
    marketHighestPrice: number;
    language?: 'en' | 'pt' | 'es';
}

function Gauge({ idealPrice, marketLowestPrice, marketMediumPrice, marketHighestPrice, language = 'pt' }: GaugeProps) {
    console.log('Gauge Props:', { idealPrice, marketLowestPrice, marketMediumPrice, marketHighestPrice, language });

    // Translations for gauge labels
    const translations = {
        en: {
            cheap: 'Cheap',
            ideal: 'Ideal',
            expensive: 'Expensive'
        },
        pt: {
            cheap: 'Barato',
            ideal: 'Ideal',
            expensive: 'Caro'
        },
        es: {
            cheap: 'Barato',
            ideal: 'Ideal',
            expensive: 'Caro'
        }
    };

    // Get the correct labels based on language
    const labels = translations[language] || translations.pt;

    // Ensure all values are valid numbers
    const validIdealPrice = isNaN(idealPrice) ? 0 : idealPrice;
    const validLowestPrice = isNaN(marketLowestPrice) ? 0 : marketLowestPrice;
    const validMediumPrice = isNaN(marketMediumPrice) ? 0 : marketMediumPrice;
    const validHighestPrice = isNaN(marketHighestPrice) ? 0 : marketHighestPrice;

    // Calculate needle position (0 to 180 degrees)
    const calculateNeedlePosition = () => {
        // Use validated values for calculation
        const idealLowPrice = validMediumPrice * 0.8;  // 20% below medium price
        const idealHighPrice = validMediumPrice * 1.2; // 20% above medium price

        if (validMediumPrice <= 0) {
            return 90;
        }

        if (validIdealPrice < idealLowPrice) {
            if (validIdealPrice <= validLowestPrice) {
                return 0;
            }

            const range = idealLowPrice - validLowestPrice;
            // Prevent division by zero
            if (range <= 0) return 0;

            const position = Math.max(
                0,
                ((validIdealPrice - validLowestPrice) / range) * 45
            );
            return position;
        }

        if (validIdealPrice >= idealLowPrice && validIdealPrice <= idealHighPrice) {
            const range = idealHighPrice - idealLowPrice;
            if (range <= 0) return 90; // Middle of ideal range

            const position = ((validIdealPrice - idealLowPrice) / range) * 90 + 45;
            return position;
        }

        if (validIdealPrice > idealHighPrice && validIdealPrice <= validHighestPrice) {
            const range = validHighestPrice - idealHighPrice;
            if (range <= 0) return 135;

            const position = ((validIdealPrice - idealHighPrice) / range) * 45 + 135;
            return position;
        }

        return 180;
    };

    const needleRotation = calculateNeedlePosition();
    console.log('Final Needle Rotation:', needleRotation);

    return (
        <div className="py-12">
            <div className="w-[340px] h-[360px] md:w-[414px] md:h-[420px] mx-auto bg-[#f7f7f8] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.12)] flex items-center justify-center pb-12">
                <div className="w-full h-full">
                    <div className="relative h-full">
                        <svg
                            viewBox="0 0 480 280"
                            className="w-full h-full"
                            preserveAspectRatio="xMidYMid meet"
                        >
                            {/* Too Cheap section - Red */}
                            <path
                                d="M48 240 A 192 192 0 0 1 176 76"
                                fill="none"
                                stroke="#FF4E4E"
                                strokeWidth="48"
                            />
                            {/* Ideal section - Green */}
                            <path
                                d="M176 76 A 192 192 0 0 1 304 76"
                                fill="none"
                                stroke="#2FAE94"
                                strokeWidth="48"
                            />
                            {/* Too Expensive section - Orange */}
                            <path
                                d="M304 76 A 192 192 0 0 1 432 240"
                                fill="none"
                                stroke="#F5A623"
                                strokeWidth="48"
                            />

                            {/* Needle */}
                            <g transform={`rotate(${needleRotation - 90}, 240, 240)`}>
                                <line
                                    x1="240"
                                    y1="240"
                                    x2="240"
                                    y2="100"
                                    stroke="#363F4D"
                                    strokeWidth="4"
                                />
                                <circle cx="240" cy="240" r="12" fill="#363F4D" />
                            </g>
                        </svg>

                        {/* Labels section remains the same */}
                        <div className="absolute bottom-12 left-0 right-0">
                            <div className="flex justify-between px-8 md:px-12 relative">
                                <div className="flex items-center gap-2 absolute left-4">
                                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#FF4E4E' }}></div>
                                    <span className="text-base font-medium">{labels.cheap}</span>
                                </div>
                                <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
                                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#2FAE94' }}></div>
                                    <span className="text-base font-medium">{labels.ideal}</span>
                                </div>
                                <div className="flex items-center gap-2 absolute right-4">
                                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#F5A623' }}></div>
                                    <span className="text-base font-medium">{labels.expensive}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Gauge;
