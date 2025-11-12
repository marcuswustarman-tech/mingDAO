import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "加入我们 - 外汇交易员培训详情",
  description: "了解 明DAO 外汇交易员培训的完整流程：30个工作日培训、规则学习、盈利考核、小额实盘、大额矩阵。通过考核后获得资金支持，分润比例60%-90%。每个人只有一次机会，留下极少数，劝返大多数。",
  keywords: ["外汇交易员招募", "加入外汇交易培训", "外汇交易考核", "FX培训计划", "实盘交易", "资金支持", "交易分润"],
  openGraph: {
    title: "加入 明DAO - 外汇交易员培训详情",
    description: "30个工作日培训，通过考核后获得资金支持，分润比例60%-90%。了解完整的外汇交易员培养流程。",
    url: "https://fxkiller.com/splan/join-us",
    type: "website",
  },
  alternates: {
    canonical: "https://fxkiller.com/splan/join-us",
  },
};

export default function JoinUsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
