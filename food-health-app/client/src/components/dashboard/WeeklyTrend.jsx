// src/components/dashboard/WeeklyTrend.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format, parseISO } from 'date-fns';

export default function WeeklyTrend({ data = [], dailyTarget = 2000 }) {
    const formatted = data.map((d) => ({
        ...d,
        day: format(parseISO(d.date), 'EEE'),
    }));

    return (
        <div className="glass-card p-6" role="region" aria-label="Weekly calorie trend">
            <h3 className="font-semibold text-text-primary mb-4">7-Day Calorie Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={formatted} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" tick={{ fill: '#A0A0A0', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#A0A0A0', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                        contentStyle={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#F5F5F5' }}
                        formatter={(value) => [`${value} kcal`, 'Calories']}
                    />
                    <ReferenceLine y={dailyTarget} stroke="#FFD700" strokeDasharray="4 4" label={{ value: 'Target', fill: '#FFD700', fontSize: 10 }} />
                    <Line
                        type="monotone"
                        dataKey="calories"
                        stroke="#6C63FF"
                        strokeWidth={3}
                        dot={{ fill: '#6C63FF', r: 4 }}
                        activeDot={{ r: 6, fill: '#8B85FF' }}
                        isAnimationActive
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
