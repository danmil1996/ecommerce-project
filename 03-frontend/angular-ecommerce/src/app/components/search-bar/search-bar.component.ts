import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: []
})
export class SearchBarComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  doSearch(keyword: string) {
    this.router.navigateByUrl(`/search/${keyword}`);
  } // doSearch

}
