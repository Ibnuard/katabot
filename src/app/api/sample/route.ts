import { NextResponse } from "next/server";

export async function GET(req: Request) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  const data = {
    periode: "Mei - Juli 2025",
    ringkasan: {
      total_pemasukan: 30000000,
      total_pengeluaran: 18500000,
      saldo_akhir: 11500000,
    },
    detail: [
      {
        bulan: "Mei 2025",
        pemasukan: 10000000,
        pengeluaran: 6000000,
        saldo: 4000000,
      },
      {
        bulan: "Juni 2025",
        pemasukan: 9000000,
        pengeluaran: 6500000,
        saldo: 2500000,
      },
      {
        bulan: "Juli 2025",
        pemasukan: 11000000,
        pengeluaran: 6000000,
        saldo: 5000000,
      },
    ],
  };

  return NextResponse.json(data);
}
