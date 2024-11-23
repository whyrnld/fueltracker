import { QrCode, KeyRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const Scanner = () => {
  const [showScanner, setShowScanner] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (showScanner) {
      const scanner = new Html5QrcodeScanner("reader", {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      }, false); // Added the missing 'verbose' parameter

      scanner.render(success, error);

      function success(result: string) {
        scanner.clear();
        setShowScanner(false);
        toast({
          title: "QR Code lido com sucesso!",
          description: "O cupom fiscal foi registrado.",
        });
      }

      function error(err: any) {
        console.warn(err);
      }

      return () => {
        scanner.clear();
      };
    }
  }, [showScanner, toast]);

  return (
    <div className="flex flex-col gap-6 pb-20">
      <section className="bg-gradient-to-r from-primary to-secondary p-6 -mx-6 -mt-6">
        <h1 className="text-white text-lg font-medium">Scanner QR Code</h1>
      </section>

      {!showScanner ? (
        <div className="space-y-4">
          <Card className="p-6 text-center space-y-4">
            <QrCode className="w-16 h-16 text-primary mx-auto" />
            <p className="text-gray-600">Escolha uma das opções abaixo</p>
            <div className="space-y-3">
              <Button 
                className="w-full" 
                onClick={() => setShowScanner(true)}
              >
                Ler QR Code
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {/* Implement manual key input */}}
              >
                <KeyRound className="w-4 h-4 mr-2" />
                Digitar chave
              </Button>
            </div>
          </Card>

          <Card className="p-4 space-y-2">
            <h3 className="font-medium">Regras</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Limite de 3 cupons por semana</li>
              <li>• R$ 0,10 de cashback por cupom</li>
              <li>• Processamento em até 15 dias</li>
              <li>• Saque mínimo: R$ 20,00</li>
            </ul>
          </Card>
        </div>
      ) : (
        <div id="reader" className="w-full"></div>
      )}
    </div>
  );
};

export default Scanner;