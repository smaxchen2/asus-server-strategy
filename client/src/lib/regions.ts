import naData from "@/data/companies.json";
import apacData from "@/data/apac_companies.json";
import emeaData from "@/data/emea_companies.json";
import chinaData from "@/data/china_companies.json";

export type Company = {
  rank: number;
  company: string;
  region: string;
  volume: string;
  platform: string;
  application: string;
  currentSuppliers: string;
  odmOem: string;
  asusModel: string;
  channel: string;
  difficulty: number;
  challenges: string;
  entryPoint: string;
};

export type RegionKey = "na" | "apac" | "emea" | "china";

export interface RegionConfig {
  key: RegionKey;
  label: string;
  shortLabel: string;
  description: string;
  companies: Company[];
  totalVolume: string;
  color: string;
}

const regions: Record<RegionKey, RegionConfig> = {
  na: {
    key: "na",
    label: "北美 (NA)",
    shortLabel: "NA",
    description: "北美地區 Top 100 伺服器採購商",
    companies: naData.companies as Company[],
    totalVolume: "~6.5M",
    color: "bg-blue-500",
  },
  apac: {
    key: "apac",
    label: "亞太 (APAC)",
    shortLabel: "APAC",
    description: "亞太地區 Top 50 伺服器採購商",
    companies: apacData.companies as Company[],
    totalVolume: "~4.2M",
    color: "bg-emerald-500",
  },
  emea: {
    key: "emea",
    label: "歐洲中東非洲 (EMEA)",
    shortLabel: "EMEA",
    description: "EMEA 地區 Top 50 伺服器採購商",
    companies: emeaData.companies as Company[],
    totalVolume: "~2.8M",
    color: "bg-amber-500",
  },
  china: {
    key: "china",
    label: "中國大陸",
    shortLabel: "China",
    description: "中國大陸 Top 50 伺服器採購商（民營企業）",
    companies: chinaData.companies as Company[],
    totalVolume: "~5.0M",
    color: "bg-red-500",
  },
};

export const regionKeys: RegionKey[] = ["na", "apac", "emea", "china"];

export function getRegion(key: string | undefined): RegionConfig {
  if (key && key in regions) return regions[key as RegionKey];
  return regions.na;
}

export function getAllCompanies(): Company[] {
  return regionKeys.flatMap((k) => regions[k].companies);
}

export default regions;
