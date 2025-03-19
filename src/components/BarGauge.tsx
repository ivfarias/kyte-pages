interface BarGaugeProps {
    idealPrice: number;
    marketLowestPrice: number;
    marketMediumPrice: number;
    marketHighestPrice: number;
}

function BarGauge({ idealPrice, marketLowestPrice, marketMediumPrice, marketHighestPrice }: BarGaugeProps) {
    const calculatePercentage = () => {
        if (idealPrice <= marketLowestPrice) return 0;
        if (idealPrice >= marketHighestPrice) return 100;

        const totalRange = marketHighestPrice - marketLowestPrice;
        const position = idealPrice - marketLowestPrice;
        return (position / totalRange) * 100;
    };

    const getPriceCategory = () => {
        if (idealPrice <= marketMediumPrice * 0.8) return { text: "Barato", color: "#FF4E4E" };
        if (idealPrice >= marketMediumPrice * 1.2) return { text: "Caro", color: "#F5A623" };
        return { text: "Ideal", color: "#2FAE94" };
    };

    const getSegmentColor = (index: number) => {
        const position = (index + 1) * 5;
        const isAfterPrice = (index * 5) > calculatePercentage();

        let color;
        if (position <= 33) color = '#FF4E4E';
        else if (position <= 66) color = '#2FAE94';
        else color = '#F5A623';

        return {
            color,
            opacity: isAfterPrice ? 0.4 : 1
        };
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6">
            <div className="flex items-center gap-4 mb-2">
                <div className="text-xl font-medium text-textColor">
                    R$ {idealPrice.toFixed(2)}
                </div>
                <div className="ml-auto">
                    <span
                        className="px-4 py-1 rounded-full text-sm"
                        style={{
                            backgroundColor: `${getPriceCategory().color}20`,
                            color: getPriceCategory().color
                        }}
                    >
                        {getPriceCategory().text}
                    </span>
                </div>
            </div>

            <div className="relative h-8 mt-4">
                <div className="absolute inset-0 flex items-center justify-between">
                    {Array.from({ length: 20 }).map((_, index) => {
                        const segmentStyle = getSegmentColor(index);
                        return (
                            <div
                                key={index}
                                className="w-2 h-12"
                                style={{
                                    background: segmentStyle.color,
                                    opacity: segmentStyle.opacity,
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-between mt-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF4E4E]"></div>
                    <span className="text-textColor">Barato</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#2FAE94]"></div>
                    <span className="text-textColor">Ideal</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#F5A623]"></div>
                    <span className="text-textColor">Caro</span>
                </div>
            </div>
        </div>
    );
}

export default BarGauge;