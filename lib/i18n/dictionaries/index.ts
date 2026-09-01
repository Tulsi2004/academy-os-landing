import type { LocaleCode } from "../locales";
import type { Dictionary } from "./en";
import { en } from "./en";
import { hi } from "./hi";
import { mr } from "./mr";
import { ta } from "./ta";
import { es } from "./es";
import { ptBR } from "./pt-BR";
import { de } from "./de";
import { ja } from "./ja";
import { frCA } from "./fr-CA";
import { zhCN } from "./zh-CN";
import { ko } from "./ko";

export const dictionaries: Record<LocaleCode, Dictionary> = {
  en,
  hi,
  mr,
  ta,
  es,
  "pt-BR": ptBR,
  de,
  ja,
  "fr-CA": frCA,
  "zh-CN": zhCN,
  ko,
};
