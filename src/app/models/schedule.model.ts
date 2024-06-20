export interface IAirportSchedule {
  airline_iata: string;
  flight_iata: string;
  dep_iata: string;
  dep_terminal: string;
  dep_gate: string;
  dep_time: string;
  arr_iata: string;
  duration: number;
  status: string;
  cs_airline_iata: string;
  cs_flight_iata: string;
  associates?: IAirportSchedule[];
}
