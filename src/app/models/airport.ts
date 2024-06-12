export interface Airport {
    id: number;
    name: string;
    iata_code: string;
    city: string;
    lat: number;
    lng: number;
    country_code: string;
    names: {
        [key: string]: string;
    };
}

// TODO:add it later
export interface AirportLocation {

}
export interface Flight {
    id: number;
    date: string;
    destination: string;
    code: string;
    expectedTimeToReach: string;
    carier: string;

}
