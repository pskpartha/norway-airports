import { IAirportSchedule } from './schedule.model';

export interface IFlightInfo extends IAirportSchedule {
  dep_name: string;
  dep_city: string;
  dep_country: string;
  arr_name: string;
  arr_terminal: string;
  arr_gate: string;
  arr_estimated: string;
  arr_city: string;
  arr_country: string;
  airline_name: string;
  flag: string;
}
