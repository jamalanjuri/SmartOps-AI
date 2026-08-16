interface DashboardCardProps {
    title: string;
    value: string;
    color?: string;
}

export default function DashboardCard({
    title,
    value,
    color = "text-black",
}: DashboardCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <h3 className="text-gray-500">
                {title}
            </h3>

           <p className={`text-3xl font-bold mt-3 ${color}`}>
                {value}
            </p>
        </div>
    );
}