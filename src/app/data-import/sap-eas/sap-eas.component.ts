import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sap-eas',
  templateUrl: './sap-eas.component.html',
  styleUrls: ['./sap-eas.component.css']
})

export class SapEasComponent implements OnInit {
  @Input() fiscalYear: number;

  constructor() {

  }

  ngOnInit() {

  }
}
