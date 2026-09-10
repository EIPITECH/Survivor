


const SVG_HEIGHT = 300;

function BarVerticalStats({
    data
}:{
    data: [string, number][],
}) {
    const SVG_WIDTH = Math.max(400, data.length * 190);
    const types = ["Chercheur d'emploi", "Employeur"];
    const x0 = 50;
    const xAxisLength = SVG_WIDTH - x0 * 2;
    const y0 = 50;
    const yAxisLength = SVG_HEIGHT - y0 * 2;
    const xAxisY = y0 + yAxisLength;
    const dataYMax = data.reduce(
        (currMax, [_, dataY]) => Math.max(currMax, dataY),
        -Infinity
    );
    const dataYMin = 0
    const dataYRange = dataYMax - dataYMin
    const numYTicks = 5;
    const barPlotWidth = xAxisLength / data.length;

    return (
        <svg width={SVG_WIDTH} height={SVG_HEIGHT}>
            <line
                x1={x0}
                y1={xAxisY}
                x2={x0 + xAxisLength}
                y2={xAxisY}
                stroke="grey"/>
            <text x={x0 + xAxisLength + 5} y={xAxisY + 4}>
            </text>

            <line
                x1={x0}
                y1={y0}
                x2={y0}
                y2={y0 + yAxisLength}
                stroke='grey'/>
            {Array.from({ length: numYTicks }).map((_, index) => {
                const y = y0 + index * (yAxisLength / numYTicks);
                const yValue = Math.round(dataYMax - index  * (dataYRange / numYTicks));

                return (
                    <g key={index}>
                        <line x1={x0} y1={y} x2={x0 - 5} y2={y} stroke="grey"/>
                        <text x={x0 - 5} y={y + 5} textAnchor="end">
                            {yValue}
                        </text>
                    </g>
                );
            })}
            <text x={x0} y={y0 -8} textAnchor="middle">
                Nombres
            </text>

            {data.map(([type, dataY], index) => {
                const x = x0 + index * barPlotWidth;
                const yRatio = (dataY - dataYMin) / dataYRange;
                const y = y0 + (1 - yRatio) * yAxisLength;
                const height = yRatio * yAxisLength;
                const sidePadding = 35;

                return (
                    <g key={index}>
                        <rect
                            x={x + sidePadding / 2}
                            y={y}
                            width={barPlotWidth - sidePadding}
                            height={height}
                            fill="#FFA500"
                            rx={15}
                            ry={15}
                            className="hover:fill-[#FFA500]/50"/>

                        <text x={x + barPlotWidth / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="middle">
                            {dataY}
                        </text>

                        <text x={x + barPlotWidth / 2} y={xAxisY + 16} textAnchor="middle">
                            {type}
                        </text>
                    </g>
                );
            })}
        </svg>
    )
}

export default BarVerticalStats;