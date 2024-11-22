import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const PremiumCard = () => {
  return (
    <Card className="p-6 bg-gradient-to-r from-gray-900 to-black text-white">
      <div className="flex items-start gap-4 mb-4">
        <Star className="w-6 h-6" />
        <div>
          <h3 className="text-lg font-medium">Premium</h3>
          <p className="text-sm opacity-90">Desbloqueie recursos exclusivos por apenas R$ 9,99/mês</p>
        </div>
      </div>
      <ul className="text-sm space-y-2 mb-4 opacity-90">
        <li>• Envie mais notas fiscais</li>
        <li>• Sem valor mínimo para resgate</li>
      </ul>
      <Button variant="secondary" className="w-full">
        Assinar Premium
      </Button>
    </Card>
  );
};

export default PremiumCard;