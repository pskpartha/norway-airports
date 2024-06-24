export interface IAirportSchedule {
  airline_iata: string;
  airline_icao?: string;
  flight_iata: string;
  flight_icao?: string;
  dep_iata: string;
  dep_terminal?: string;
  dep_gate?: string;
  dep_time: string;
  dep_time_utc: string;
  dep_actual: string;
  dep_actual_utc: string;
  arr_iata: string;
  duration: number;
  status: string;
  cs_airline_iata: string;
  cs_flight_iata: string;
  associates?: IAirportSchedule[];
}
