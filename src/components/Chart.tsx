import Chart from "react-apexcharts";
import { useEffect, useState } from "react";

type PricePoint = {
    label: string;
    value: number;
    color: string;
};

interface PriceChartProps {
    lang?: "pt" | "es" | "en";
}

export default function PriceChart({ lang = "pt" }: PriceChartProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth < 640);
        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);
        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    const translations = {
        pt: {
            labels: ["Vender mais rápido", "Vender do seu jeito", "Maximizar lucros", "Selecionar seus clientes"],
            xAxisCategories: ["", "Cenários de Vendas", ""],
            seriesName: "Preço",
            yAxisTitle: "Preço",
            currencySymbol: "R$",
        },
        es: {
            labels: ["Vender más rápido", "Vender a tu manera", "Maximizar ganancias", "Elegir a tus clientes"],
            xAxisCategories: ["", "Escenarios de Venta", ""],
            seriesName: "Precio",
            yAxisTitle: "Precio",
            currencySymbol: "$",
        },
        en: {
            labels: ["Sell faster", "Sell your way", "Maximize profits", "Select your customers"],
            xAxisCategories: ["Fast sale", "Ideal price", "Select customers"],
            seriesName: "Price",
            yAxisTitle: "Price",
            currencySymbol: "$",
        },
    };

    const t = translations[lang];

    const params = new URLSearchParams(window.location.search);
    const idealPrice = parseFloat(params.get("idealPrice") || "0");
    const marketLowestPrice = parseFloat(params.get("marketLowestPrice") || "0");
    const marketMediumPrice = parseFloat(params.get("marketMediumPrice") || "0");
    const marketHighestPrice = parseFloat(params.get("marketHighestPrice") || "0");

    const priceData: PricePoint[] = [
        { label: t.labels[0], value: marketLowestPrice, color: "#F3A626" },
        { label: t.labels[1], value: idealPrice, color: "#2DD1AC" },
        { label: t.labels[2], value: marketMediumPrice, color: "#68BCB2" },
        { label: t.labels[3], value: marketHighestPrice, color: "#547AB8" },
    ].sort((a, b) => a.value - b.value);

    const chartConfig = {
        type: "line",
        height: "auto",
        width: "100%",
        series: [{
            name: t.seriesName,
            data: priceData.map(point => point.value),
        }],
        options: {
            chart: {
                toolbar: { show: false },
                background: "transparent",
                redrawOnWindowResize: true,
                redrawOnParentResize: true,
                animations: { enabled: true },
            },
            fill: {
                type: "solid",
                colors: priceData.map(point => point.color),
            },
            colors: ["#2DD1AC"],
            stroke: {
                width: 3,
                curve: "smooth",
            },
            markers: {
                size: 6,
                colors: priceData.map(point => point.color),
                strokeWidth: 0,
                hover: { size: 8, sizeOffset: 3 },
            },
            animations: {
                enabled: true,
                easing: "easeinout",
                speed: 800,
                animateGradually: { enabled: true, delay: 150 },
                dynamicAnimation: { enabled: true, speed: 350 },
            },
            grid: { show: true },
            dataLabels: { enabled: false },
            legend: { show: false },
            xaxis: {
                categories: t.xAxisCategories,
                labels: {
                    style: {
                        colors: "#363F4D",
                        fontSize: "text-md",
                        fontFamily: "inherit",
                        fontWeight: 500,
                    },
                    align: "center",
                },
                offsetY: 20,
                offsetX: isMobile ? 0 : 75,
                position: "bottom",
                axisBorder: { show: true },
                axisTicks: { show: false },
            },
            yaxis: {
                title: {
                    text: t.yAxisTitle,
                    rotate: -90,
                    offsetX: -1,
                    margin: { top: 20, bottom: 25 },
                    style: {
                        colors: "#363F4D",
                        fontSize: "text-md",
                        fontFamily: "inherit",
                        fontWeight: 500,
                    },
                },
                labels: {
                    style: {
                        colors: "#363F4D",
                        fontSize: "12px",
                        fontFamily: "inherit",
                        fontWeight: 400,
                    },
                    formatter: (value: number) => `${t.currencySymbol} ${value.toFixed(2)}`,
                },
            },
            tooltip: {
                theme: "dark",
                custom: ({ series, seriesIndex, dataPointIndex }: { series: number[][]; seriesIndex: number; dataPointIndex: number }) => {
                    const point = priceData[dataPointIndex];
                    return `<div style='background: ${point.color}99; padding: 8px; border-radius: 6px 6px 6px 0; color: white;'>
            <strong>${point.label}</strong><br />
            ${t.currencySymbol} ${series[seriesIndex][dataPointIndex].toFixed(2)}
          </div>`;
                },
            },
        },
    };

    return (
        <div className="w-full bg-white p-1 rounded-lg">
            <div className="w-full sm:max-w-[640px] mx-auto border border-[#CAD6DA] rounded-xl p-6">
                <Chart {...chartConfig as any} type="line" />
            </div>
        </div>
    );
}