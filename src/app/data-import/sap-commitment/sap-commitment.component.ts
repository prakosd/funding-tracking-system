import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sap-commitment',
  templateUrl: './sap-commitment.component.html',
  styleUrls: ['./sap-commitment.component.css']
})

export class SapCommitmentComponent implements OnInit {
  @Input() fiscalYear: number;

  constructor() {

  }

  ngOnInit() {

  }
}
