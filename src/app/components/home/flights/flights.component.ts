import { Component } from '@angular/core';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.scss'
})
export class FlightsComponent {

  flightInfo = [{
    depTime: "15:30",
    oldTime: "12:20",
    date: "Thus, 13 June",
    gate: "B1",
    destination: "Stockholm (aralnda)",
    airlines: [{ code: "TK 023", name: "Turkish Airlines" }],
    status: {
      type: 'onTime',
      name: "Scheduled"
    }
  }, {
    depTime: "13:30",
    oldTime: "",
    date: "Thus, 13 June",
    gate: "B5",
    destination: "Kardla",
    airlines: [{ code: "OJ 225", name: "Nyxair" }],
    status: {
      type: 'delayed',
      name: "Delayed"
    }
  }, {
    depTime: "10:30",
    oldTime: "12:20",
    date: "Thus, 13 June",
    gate: "B1",
    destination: "Hamburg",
    airlines: [{ code: "LH 883", name: "Deutsche Lufthansa" }],
    status: {
      type: 'onTime',
      name: "Scheduled"
    }
  }, {
    depTime: "15:30",
    oldTime: "12:20",
    date: "Thus, 13 June",
    gate: "B1",
    destination: "Helsinki",
    airlines: [{ code: "AY 1024", name: "Finnair" }, { code: "BA 6044", name: "British Airways" }],
    status: {
      type: 'departed',
      name: "Departed"
    }
  }, {
    depTime: "05:30",
    oldTime: "12:20",
    date: "Thus, 13 June",
    gate: "B1",
    destination: "Barcelona",
    airlines: [{ code: "SK 1749", name: "Scandinavian Airlines System (SAS)" }],
    status: {
      type: 'cancelled',
      name: "Cancelled"
    }
  }]

}
