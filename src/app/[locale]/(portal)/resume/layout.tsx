import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "简历接收 - 明DAO外汇交易员招募",
  description: "提交您的简历，开启外汇交易员职业之路。我们正在寻找有潜力的外汇交易员，请将您的简历发送给我们。",
  keywords: ["简历接收", "外汇交易员招募", "简历提交", "外汇交易员申请", "外汇交易员招聘"],
  openGraph: {
    title: "简历接收 - 明DAO外汇交易员招募",
    description: "提交您的简历，开启外汇交易员职业之路。",
    url: "https://mingdaotrade.cn/resume",
    type: "website",
  },
  alternates: {
    canonical: "https://mingdaotrade.cn/resume",
  },
};

export default function ResumeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
