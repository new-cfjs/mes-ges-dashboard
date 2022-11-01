import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GesCalculatorQuery} from '../../models/ges-calculator-query.model';

@Component({
  selector: 'app-resultats-ges',
  templateUrl: './resultats-ges.component.html',
  styleUrls: ['./resultats-ges.component.scss']
})
export class ResultatsGESComponent implements OnInit {
  private gesCalculatorQuery!: GesCalculatorQuery;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.gesCalculatorQuery = params as GesCalculatorQuery;

      console.log(this.gesCalculatorQuery);
    });
  }

}
