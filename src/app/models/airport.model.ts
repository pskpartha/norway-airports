export interface IAirport {
  name: string;
  iata_code: string | null;
  icao_code?: string;
  lat: number;
  lng: number;
  country_code?: string;
  names?: {
    [key: string]: string;
  };
}
