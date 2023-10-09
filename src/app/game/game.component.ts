import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collection, onSnapshot, addDoc, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';





@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  
  game!: Game;
  gameId: any;
  
  private firestore: Firestore = inject(Firestore);
  unsubGames;

  constructor(public dialog: MatDialog, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.newGame();

    this.route.params.subscribe((params) => {
      this.gameId = params['id']; 
      this.subGames(this.gameId);
      
    })
  }

  async saveGame() {
    await updateDoc(doc(collection(this.firestore, 'games'), this.gameId), this.game.toJson());
  }


  subGames(id) {
    onSnapshot(collection(this.firestore, 'games'), (game) => {
      game.forEach(element => {
        if (element.id == id) {
          this.getDocument(id)
          console.log(id);

        }
      })
    })
  }

  async getDocument(id: string) {
    let singleDoc: any = (await getDoc(doc(collection(this.firestore, 'games'), id))).data();

    this.game.currentPlayer = singleDoc.currentPlayer;
    this.game.playedCards = singleDoc.playedCards;
    this.game.players = singleDoc.players;
    this.game.stack = singleDoc.stack;
    this.game.currentCard = singleDoc.currentCard;
    this.game.pickCardAnimation = singleDoc.pickCardAnimation;
  }

  async addDocument() {
    await addDoc(collection(this.firestore, 'games'), this.game.toJson());
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop(); // Last value from the Array will be taken and deleted from the Array
      this.game.pickCardAnimation = true;
      

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

      this.saveGame();

      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000)
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }
}

