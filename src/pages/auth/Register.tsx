import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { maskCPF, maskPhone } from "@/lib/utils";

const Register = () => {
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref");
  const [referrerId, setReferrerId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    cpf: "",
    email: "",
    phone: "",
    birthDate: "",
    password: "",
    referralCode: referralCode || "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const validateReferralCode = async () => {
      if (!formData.referralCode) return;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("referral_code", formData.referralCode)
        .single();
      
      if (error || !data) {
        toast({
          variant: "destructive",
          title: "Código de indicação inválido",
          description: "O código informado não existe.",
        });
        return;
      }
      
      setReferrerId(data.id);
      toast({
        title: "Código de indicação válido!",
        description: "Você receberá R$ 5,00 ao se cadastrar.",
      });
    };
    
    validateReferralCode();
  }, [formData.referralCode, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === "cpf") {
      processedValue = value.replace(/\D/g, "").slice(0, 11);
    } else if (name === "phone") {
      processedValue = value.replace(/\D/g, "").slice(0, 11);
    } else if (name === "birthDate") {
      processedValue = value.replace(/\D/g, "");
      if (processedValue.length > 8) {
        processedValue = processedValue.slice(0, 8);
      }
      // Convert from DD/MM/YYYY to YYYY-MM-DD for storage
      if (processedValue.length >= 8) {
        const day = processedValue.slice(0, 2);
        const month = processedValue.slice(2, 4);
        const year = processedValue.slice(4, 8);
        processedValue = `${year}-${month}-${day}`;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  // Format the birth date for display (YYYY-MM-DD to DD/MM/YYYY)
  const formatBirthDateForDisplay = (value: string) => {
    if (!value) return "";
    if (value.includes("-")) {
      // If it's in YYYY-MM-DD format, convert to DD/MM/YYYY
      const [year, month, day] = value.split("-");
      return `${day}/${month}/${year}`;
    }
    // If it's just numbers, format as user types
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            cpf: formData.cpf,
            phone: formData.phone,
            birth_date: formData.birthDate,
            email: formData.email,
            referred_by: referrerId,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Conta criada com sucesso!",
          description: "Você já pode fazer login.",
        });
        navigate("/auth/login");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 px-6 py-6">
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Criar nova conta
          </h2>
          
          {referralCode && referrerId && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm text-center">
              Você foi indicado e receberá R$ 5,00 ao se cadastrar!
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <Label htmlFor="fullName">Nome completo</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="mt-2"
                placeholder="Digite seu nome completo"
              />
            </div>

            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-2"
                placeholder="Digite seu e-mail"
              />
            </div>

            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                name="cpf"
                type="text"
                required
                maxLength={11}
                value={maskCPF(formData.cpf)}
                onChange={handleChange}
                className="mt-2"
                placeholder="000.000.000-00"
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                type="text"
                required
                maxLength={11}
                value={maskPhone(formData.phone)}
                onChange={handleChange}
                className="mt-2"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div>
              <Label htmlFor="birthDate">Data de nascimento</Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="text"
                required
                value={formatBirthDateForDisplay(formData.birthDate)}
                onChange={handleChange}
                className="mt-2"
                placeholder="DD/MM/AAAA"
              />
            </div>

            <div>
              <Label htmlFor="referralCode">Código de indicação (opcional)</Label>
              <Input
                id="referralCode"
                name="referralCode"
                type="text"
                value={formData.referralCode}
                onChange={handleChange}
                className="mt-2"
                placeholder="Digite o código de indicação"
              />
            </div>

            <div>
              <Label htmlFor="password">Senha (6 números)</Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  pattern="[0-9]{6}"
                  title="A senha deve conter 6 números"
                  maxLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  className="pr-10"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>

            <p className="text-center text-sm text-gray-500">
              Já tem uma conta?{" "}
              <Link
                to="/auth/login"
                className="font-medium text-primary hover:text-primary/80"
              >
                Fazer login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
