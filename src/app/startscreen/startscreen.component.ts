import { Component, OnInit, inject } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Firestore, collection, onSnapshot, addDoc, doc, getDoc, docData } from '@angular/fire/firestore';
import { Game } from 'src/models/game';


@Component({
  selector: 'app-startscreen',
  templateUrl: './startscreen.component.html',
  styleUrls: ['./startscreen.component.scss']
})
export class StartscreenComponent implements OnInit {
  private firestore: Firestore = inject(Firestore);
  game!: Game;

  ngOnInit(): void {

  }

  constructor(private router: Router) {

  }

  async newGame() {
    this.game = new Game();

    await addDoc(collection(this.firestore, 'games'), this.game.toJson()).then((gameInfo: any) => {
      this.router.navigateByUrl('/game/' + gameInfo.id)
    });
  }

}
