import { Component, OnInit } from '@angular/core';

interface Gem {
  damage: number;
  criticalHit: number;
  criticalDamage: number;
}

enum Classes {
  DINOTAMER = "Dino Tamer",
  REVENANT = "Revenant",
  NEONNINJA = "Neon Ninja"
}

interface Channel {
  class: Classes;
  fireOne: Gem;
  fireTwo: Gem;
  airOne: Gem;
  airTwo: Gem;
  waterOne: Gem;
  waterTwo: Gem;
}

@Component({
  selector: 'app-gems',
  templateUrl: './gems.component.html',
  styleUrls: ['./gems.component.css']
})
export class GemsComponent implements OnInit {

  public classes = Object.values(Classes);
  player: Channel;

  constructor() { }

  ngOnInit(): void {
  }

}
