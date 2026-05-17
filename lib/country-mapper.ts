/**
 * country-mapper: Utility to convert full country names to ISO 3166-1 alpha-2 codes.
 * This is used to fetch the correct flag icon from 'country-flag-icons'.
 */

const COUNTRY_TO_ISO: Record<string, string> = {
  // --- EUROPE ---
  "albania": "AL",
  "armenia": "AM",
  "austria": "AT",
  "azerbaijan": "AZ",
  "belgium": "BE",
  "bosnia & herzegovina": "BA",
  "bosnia and herzegovina": "BA",
  "bulgaria": "BG",
  "croatia": "HR",
  "cyprus": "CY",
  "czech republic": "CZ",
  "czechia": "CZ",
  "denmark": "DK",
  "england": "GB_ENG",
  "estonia": "EE",
  "faroe islands": "FO",
  "finland": "FI",
  "france": "FR",
  "georgia": "GE",
  "germany": "DE",
  "greece": "GR",
  "hungary": "HU",
  "iceland": "IS",
  "ireland": "IE",
  "republic of ireland": "IE",
  "israel": "IL",
  "italy": "IT",
  "kosovo": "XK",
  "latvia": "LV",
  "lithuania": "LT",
  "luxembourg": "LU",
  "malta": "MT",
  "moldova": "MD",
  "montenegro": "ME",
  "netherlands": "NL",
  "holland": "NL",
  "north macedonia": "MK",
  "northern ireland": "GB_NIR",
  "norway": "NO",
  "poland": "PL",
  "portugal": "PT",
  "romania": "RO",
  "russia": "RU",
  "scotland": "GB_SCT",
  "serbia": "RS",
  "slovakia": "SK",
  "slovenia": "SI",
  "spain": "ES",
  "sweden": "SE",
  "switzerland": "CH",
  "turkey": "TR",
  "türkiye": "TR",
  "ukraine": "UA",
  "wales": "GB_WLS",

  // --- SOUTH AMERICA ---
  "argentina": "AR",
  "brazil": "BR",
  "chile": "CL",
  "colombia": "CO",
  "ecuador": "EC",
  "paraguay": "PY",
  "peru": "PE",
  "suriname": "SR",
  "uruguay": "UY",
  "venezuela": "VE",

  // --- NORTH & CENTRAL AMERICA ---
  "canada": "CA",
  "costa rica": "CR",
  "dominican republic": "DO",
  "el salvador": "SV",
  "french guiana": "GF",
  "guadeloupe": "GP",
  "guatemala": "GT",
  "haiti": "HT",
  "honduras": "HN",
  "jamaica": "JM",
  "martinique": "MQ",
  "mexico": "MX",
  "panama": "PA",
  "saint kitts and nevis": "KN",
  "trinidad and tobago": "TT",
  "usa": "US",
  "united states": "US",

  // --- AFRICA ---
  "algeria": "DZ",
  "angola": "AO",
  "benin": "BJ",
  "burkina faso": "BF",
  "burundi": "BI",
  "cameroon": "CM",
  "cape verde": "CV",
  "central african republic": "CF",
  "comoros": "KM",
  "congo republic": "CG",
  "congo": "CG",
  "dr congo": "CD",
  "cote d'ivoire": "CI",
  "côte d'ivoire": "CI",
  "ivory coast": "CI",
  "egypt": "EG",
  "equatorial guinea": "GQ",
  "gabon": "GA",
  "gambia": "GM",
  "ghana": "GH",
  "guinea": "GN",
  "guinea-bissau": "GW",
  "kenya": "KE",
  "libya": "LY",
  "malawi": "MW",
  "mali": "ML",
  "mauritania": "MR",
  "morocco": "MA",
  "mozambique": "MZ",
  "niger": "NE",
  "nigeria": "NG",
  "senegal": "SN",
  "sierra leone": "SL",
  "south africa": "ZA",
  "tanzania": "TZ",
  "togo": "TG",
  "tunisia": "TN",
  "uganda": "UG",
  "zambia": "ZM",
  "zimbabwe": "ZW",

  // --- ASIA & OCEANIA ---
  "australia": "AU",
  "china": "CN",
  "indonesia": "ID",
  "iran": "IR",
  "japan": "JP",
  "jordan": "JO",
  "lebanon": "LB",
  "new zealand": "NZ",
  "qatar": "QA",
  "saudi arabia": "SA",
  "south korea": "KR",
  "syria": "SY",
  "thailand": "TH",
  "uzbekistan": "UZ",
};

/**
 * getCountryCode: Returns the ISO code for a given country name.
 * @param countryName - The name of the country (e.g., "Spain").
 * @returns The 2-letter ISO code or undefined if not found.
 */
export function getCountryCode(countryName: string): string | undefined {
  if (!countryName) return undefined;

  const normalized = countryName.trim().toLowerCase();

  // Direct match
  if (COUNTRY_TO_ISO[normalized]) return COUNTRY_TO_ISO[normalized];

  // Special cases for UK nations if needed
  if (normalized === "united kingdom") return "GB";

  return undefined;
}
