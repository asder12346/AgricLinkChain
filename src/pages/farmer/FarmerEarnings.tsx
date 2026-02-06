import { useEffect, useMemo, useState } from "react";
import { FarmerLayout } from "@/components/layouts/FarmerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Transaction } from "@/lib/types";
import { DollarSign, TrendingUp, CreditCard, ArrowUpRight, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const FarmerEarnings = () => {
  const { farmer } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!farmer) return;

    const fetchTransactions = async () => {
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("farmer_id", farmer.id)
        .order("created_at", { ascending: false });

      setTransactions((data as Transaction[]) || []);
      setLoading(false);
    };

    fetchTransactions();
  }, [farmer]);

  const totalEarnings = useMemo(
    () => transactions.reduce((sum, item) => sum + (item.farmer_earnings || 0), 0),
    [transactions]
  );

  return (
    <FarmerLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Earnings</h1>
            <p className="text-gray-500 mt-1">Monitor payouts and revenue from your sales.</p>
          </div>
          <Button variant="outline" className="rounded-full border-gray-200">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-lg shadow-gray-100 hover:shadow-xl transition-all duration-300 bg-green-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <DollarSign className="w-32 h-32" />
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-2 text-green-100 mb-2">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <DollarSign className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Total Earnings</span>
              </div>
              <p className="text-4xl font-bold font-serif tracking-tight">${totalEarnings.toLocaleString()}</p>
              <p className="text-sm text-green-100 mt-2 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg shadow-gray-100 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Transactions</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{transactions.length}</p>
              <p className="text-sm text-gray-400 mt-1">Completed payments</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg shadow-gray-100 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Average Payout</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                ${transactions.length ? Math.round(totalEarnings / transactions.length).toLocaleString() : 0}
              </p>
              <p className="text-sm text-gray-400 mt-1">Per transaction</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-lg shadow-gray-100">
          <CardHeader className="border-b border-gray-50 pb-4">
            <CardTitle className="text-xl font-bold text-gray-900">Transaction History</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading payouts...</div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-500">No earnings recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Payment Received</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          Order #{transaction.order_id.slice(0, 8)}
                          <span className="text-gray-300">•</span>
                          <Calendar className="w-3 h-3" />
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-700">+${transaction.farmer_earnings.toLocaleString()}</p>
                      <Badge variant="outline" className="bg-white text-xs font-normal border-gray-200 text-gray-500 capitalize mt-1">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </FarmerLayout>
  );
};

export default FarmerEarnings;
