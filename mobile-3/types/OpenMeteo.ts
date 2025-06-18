export type OpenMeteoSearchResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  admin1_code: number;
  admin1: string;
  timezone: string;
  population: number;
  country_id: number;
  country: string;
}