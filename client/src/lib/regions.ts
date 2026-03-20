import naData from "@/data/companies.json";
import apacData from "@/data/apac_companies.json";
import emeaData from "@/data/emea_companies.json";
import chinaData from "@/data/china_companies.json";

import naDataEn from "@/data/companies_en.json";
import apacDataEn from "@/data/apac_companies_en.json";
import emeaDataEn from "@/data/emea_companies_en.json";
import chinaDataEn from "@/data/china_companies_en.json";

export type SiDistEntry = {
  name: string;
  website: string;
  type: string;
  isActual?: boolean;
};

export type KeyPerson = {
  name: string;
  title: string;
  linkedin: string;
  source: string;
};

export type DecisionMaker = {
  name: string;
  title: string;
  linkedin: string;
  commStrategy: string;
};

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
  keyPerson?: KeyPerson;
  techDecisionMaker?: DecisionMaker;
  procurementDecisionMaker?: DecisionMaker;
  siDist?: SiDistEntry[];
  actualSiPartners?: string;
  volumeSource?: string;
  industry?: string;
  archetype?: string;
};

export type RegionKey = "na" | "apac" | "emea" | "china";
export type Language = "zh" | "en";

export interface RegionConfig {
  key: RegionKey;
  label: string;
  shortLabel: string;
  description: string;
  companies: Company[];
  totalVolume: string;
  color: string;
}

interface RegionMeta {
  key: RegionKey;
  labelZh: string;
  labelEn: string;
  shortLabel: string;
  descriptionZh: string;
  descriptionEn: string;
  companiesZh: Company[];
  companiesEn: Company[];
  totalVolume: string;
  color: string;
}

const regionMeta: Record<RegionKey, RegionMeta> = {
  na: {
    key: "na",
    labelZh: "北美 (NA)",
    labelEn: "North America (NA)",
    shortLabel: "NA",
    descriptionZh: "北美地區 Top 100 伺服器採購商",
    descriptionEn: "North America Top 100 Server Buyers",
    companiesZh: naData.companies as Company[],
    companiesEn: naDataEn.companies as Company[],
    totalVolume: "~6.5M",
    color: "bg-blue-500",
  },
  apac: {
    key: "apac",
    labelZh: "亞太 (APAC)",
    labelEn: "Asia Pacific (APAC)",
    shortLabel: "APAC",
    descriptionZh: "亞太地區 Top 105 伺服器採購商",
    descriptionEn: "Asia Pacific Top 105 Server Buyers",
    companiesZh: apacData.companies as Company[],
    companiesEn: apacDataEn.companies as Company[],
    totalVolume: "~4.2M",
    color: "bg-emerald-500",
  },
  emea: {
    key: "emea",
    labelZh: "歐洲中東非洲 (EMEA)",
    labelEn: "Europe, Middle East & Africa (EMEA)",
    shortLabel: "EMEA",
    descriptionZh: "EMEA 地區 Top 116 伺服器採購商",
    descriptionEn: "EMEA Top 116 Server Buyers",
    companiesZh: emeaData.companies as Company[],
    companiesEn: emeaDataEn.companies as Company[],
    totalVolume: "~2.8M",
    color: "bg-amber-500",
  },
  china: {
    key: "china",
    labelZh: "中國大陸",
    labelEn: "China",
    shortLabel: "China",
    descriptionZh: "中國大陸 Top 100 伺服器採購商（民營企業）",
    descriptionEn: "China Top 100 Server Buyers (Private Enterprises)",
    companiesZh: chinaData.companies as Company[],
    companiesEn: chinaDataEn.companies as Company[],
    totalVolume: "~5.0M",
    color: "bg-red-500",
  },
};

export const regionKeys: RegionKey[] = ["na", "apac", "emea", "china"];

function buildRegionConfig(meta: RegionMeta, lang: Language): RegionConfig {
  return {
    key: meta.key,
    label: lang === "en" ? meta.labelEn : meta.labelZh,
    shortLabel: meta.shortLabel,
    description: lang === "en" ? meta.descriptionEn : meta.descriptionZh,
    companies: lang === "en" ? meta.companiesEn : meta.companiesZh,
    totalVolume: meta.totalVolume,
    color: meta.color,
  };
}

export function getRegion(key: string | undefined, lang: Language = "zh"): RegionConfig {
  const k = (key && key in regionMeta) ? key as RegionKey : "na";
  return buildRegionConfig(regionMeta[k], lang);
}

export function getRegions(lang: Language = "zh"): Record<RegionKey, RegionConfig> {
  const result = {} as Record<RegionKey, RegionConfig>;
  for (const k of regionKeys) {
    result[k] = buildRegionConfig(regionMeta[k], lang);
  }
  return result;
}

export function getAllCompanies(lang: Language = "zh"): Company[] {
  return regionKeys.flatMap((k) =>
    lang === "en" ? regionMeta[k].companiesEn : regionMeta[k].companiesZh
  );
}

// Default export for backward compatibility (Chinese)
const regions: Record<RegionKey, RegionConfig> = getRegions("zh");
export default regions;
