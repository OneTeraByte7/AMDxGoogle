// src/components/dashboard/MacroChart.jsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#6C63FF', '#FFD700', '#4ADE80'];
const RADIAN = Math.PI / 180;

function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
    if (percent < 0.05) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
}

export default function MacroChart({ protein = 0, carbs = 0, fat = 0 }) {
    const data = [
        { name: 'Protein', value: Math.round(protein * 4) },  // 4 kcal/g
        { name: 'Carbs', value: Math.round(carbs * 4) },
        { name: 'Fat', value: Math.round(fat * 9) },           // 9 kcal/g
    ].filter((d) => d.value > 0);

    const isEmpty = data.length === 0;

    return (
        <div className="glass-card p-6" role="region" aria-label="Macronutrient breakdown">
            <h3 className="font-semibold text-text-primary mb-4">Macros Today</h3>
            {isEmpty ? (
                <div className="h-48 flex items-center justify-center text-text-secondary text-sm">
                    No meals logged yet
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                            labelLine={false}
                            label={CustomLabel}
                            isAnimationActive
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#F5F5F5' }}
                            formatter={(value) => [`${value} kcal`]}
                        />
                        <Legend
                            formatter={(value, entry) => (
                                <span style={{ color: '#A0A0A0', fontSize: '12px' }}>
                                    {value} ({entry.payload.name === 'Protein' ? protein.toFixed(1) : entry.payload.name === 'Carbs' ? carbs.toFixed(1) : fat.toFixed(1)}g)
                                </span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
