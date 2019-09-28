import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectedPositionStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'app-sap-commitment',
  templateUrl: './sap-commitment.component.html',
  styleUrls: ['./sap-commitment.component.css']
})

export class SapCommitmentComponent implements OnInit {
  @Input() fiscalYear: number;

  constructor(private router: Router) {

  }

  ngOnInit() {

  }
}
