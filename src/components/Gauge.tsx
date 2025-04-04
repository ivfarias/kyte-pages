interface GaugeProps {
    idealPrice: number;
    marketLowestPrice: number;
    marketMediumPrice: number;
    marketHighestPrice: number;
}

function Gauge({ idealPrice, marketLowestPrice, marketMediumPrice, marketHighestPrice }: GaugeProps) {
    console.log('Gauge Props:', { idealPrice, marketLowestPrice, marketMediumPrice, marketHighestPrice });

    // Calculate needle position (0 to 180 degrees)
    const calculateNeedlePosition = () => {
        const idealLowPrice = marketMediumPrice * 0.8;  // 20% below medium price
        const idealHighPrice = marketMediumPrice * 1.2; // 20% above medium price

        // If price is below the ideal low range (too cheap)
        if (idealPrice < idealLowPrice) {
            // Calculate position in the "too cheap" section (0-45 degrees)
            // Use marketLowestPrice as the minimum boundary
            const range = idealLowPrice - marketLowestPrice;
            // Prevent division by zero
            if (range <= 0) return 0;

            const position = Math.max(
                0,
                ((idealPrice - marketLowestPrice) / range) * 45
            );
            return position;
        }

        // If price is in the ideal range
        if (idealPrice >= idealLowPrice && idealPrice <= idealHighPrice) {
            // Calculate position in the "ideal" section (45-135 degrees)
            const range = idealHighPrice - idealLowPrice;
            // Prevent division by zero
            if (range <= 0) return 90; // Middle of ideal range

            const position = ((idealPrice - idealLowPrice) / range) * 90 + 45;
            return position;
        }

        // If price is above ideal but below or equal to highest
        if (idealPrice > idealHighPrice && idealPrice <= marketHighestPrice) {
            // Calculate position in the "too expensive" section (135-180 degrees)
            const range = marketHighestPrice - idealHighPrice;
            // Prevent division by zero
            if (range <= 0) return 135;

            const position = ((idealPrice - idealHighPrice) / range) * 45 + 135;
            return position;
        }

        // If price is above the highest market price
        return 180; // Maximum position (far right)
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
                                    <span className="text-base font-medium">Barato</span>
                                </div>
                                <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
                                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#2FAE94' }}></div>
                                    <span className="text-base font-medium">Ideal</span>
                                </div>
                                <div className="flex items-center gap-2 absolute right-4">
                                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#F5A623' }}></div>
                                    <span className="text-base font-medium">Caro</span>
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
