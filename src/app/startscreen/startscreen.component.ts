import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-startscreen',
  templateUrl: './startscreen.component.html',
  styleUrls: ['./startscreen.component.scss']
})
export class StartscreenComponent implements OnInit {
  
  ngOnInit(): void {
    
  }

  constructor(private router: Router) {

  }

  newGame() {
    this.router.navigateByUrl('/game')
  }
}
