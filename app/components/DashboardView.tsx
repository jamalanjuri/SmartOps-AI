import DashboardCard from "../../components/DashboardCard";

export default function DashboardView() {
  return (
    <>
      <h2 className="text-4xl font-bold">Dashboard</h2>

      <p className="text-gray-500 mt-2">
        Welcome to SmartOps AI
      </p>

      <div className="grid grid-cols-4 gap-6 mt-10">
        <DashboardCard
          title="Today's Sales"
          value="KSh 0"
        />

        <DashboardCard
          title="Inventory Value"
          value="KSh 0"
        />

        <DashboardCard
          title="Low Stock"
          value="0 Items"
        />

        <DashboardCard
          title="AI Status"
          value="Ready"
          color="text-green-600"
        />
      </div>
    </>
  );
}