export interface Airport {
    id: number;
    name: string;
    iata_code: string;
    city: string;
    lat: number;
    long: number;
    country_code: string;
    names: {
        [key: string]: string;
    };
}


export interface Flight {
    id: number;
    date: string;
    destination: string;
    code: string;
    expectedTimeToReach: string;
    carier: string;

}
