import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface WithdrawalHistoryCardProps {
  amount: number;
  date: string;
  status: string;
}

const WithdrawalHistoryCard = ({ amount, date, status }: WithdrawalHistoryCardProps) => {
  const statusColors = {
    pending: "bg-yellow-500",
    completed: "bg-green-500",
    failed: "bg-red-500"
  };

  return (
    <div className="relative flex">
      <div className={cn(
        "absolute left-0 w-1 h-full rounded-l-lg",
        statusColors[status as keyof typeof statusColors] || "bg-gray-300"
      )} />
      <Card className="w-full p-4 pl-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{formatCurrency(amount)}</p>
            <p className="text-sm text-gray-500">{date}</p>
          </div>
          <span className={cn(
            "text-sm capitalize",
            status === 'pending' ? 'text-yellow-600' :
            status === 'completed' ? 'text-green-600' :
            'text-red-600'
          )}>
            {status}
          </span>
        </div>
      </Card>
    </div>
  );
};

export default WithdrawalHistoryCard;