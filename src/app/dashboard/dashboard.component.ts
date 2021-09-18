import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Channel {
  id: number;
  name: String;
  messages: Array<String>;
  image: String;
  child: Channel[];
  parent: Array<number>;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  allData: Channel[] = [];
  finalData: Channel[] = [];
  urls: any[][] = [
    ["Magic Find", 0, "648899146463445022", "assets/images/Ganda_portrait.png", []],
    ["Chaos Chest", 1, "648899483954053120", "assets/images/Chaos_Chest.png", []],
    ["Cosmic Gem Box", 2, "648900404276494366", "assets/images/Cosmic_Gem_Box.png", []],
    ["Fire Gem Box", 3, "648900621629390848", "assets/images/Fire_Gem_Box.png", []],
    ["Air Gem Box", 4, "648901005249085500", "assets/images/Air_Gem_Box.png", []],
    ["Water Gem Box", 5, "648901148757196801", "assets/images/Water_Gem_Box.png", []],
    ["Medieval Highlands", 6, "616216658352144385", "assets/images/Mycenius_portrait.png", [4, 5]],
    ["Cursed Vale", 7, "616215485347790868", "assets/images/Archlich_Kizappian_portrait.png", [4, 5]],
    ["Dragonfire Peaks", 8, "616217177275760640", "assets/images/Katonnis_portrait.png", [3]],
    ["Fae Forest", 9, "616215189343174666", "assets/images/Lady_Seldarine_portrait.png", [5]],
    ["Treasures Isles", 10, "616216953308315649", "assets/images/Dracantes_portrait.png", [5]]
  ]
  choices: Number[] = [];
  optimizedChoices: String[] = [];

  constructor(private httpClient: HttpClient,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.scrapeDiscord();
    setTimeout(() => {
      this.orderQuests();
    }, 1000)
  }

  scrapeDiscord() {
    for (let i = 0; i < this.urls.length; i++) {
      const url = `https://discord.com/api/v9/channels/${this.urls[i][2]}/messages?limit=50`;
      this.httpClient.get<any>(url).subscribe(data => {
        let res: string[] = [];
        for (let element in data) {
          let elem: any = data[element];
          if (elem.content.startsWith("/joinworld")) {
            res.push(elem.content);
          }
        }
        this.allData.push({ 'id': this.urls[i][1], 'name': this.urls[i][0], 'messages': res, 'image': this.urls[i][3], 'child': [], 'parent': this.urls[i][4] });
        this.allData.sort(function (a, b) {
          return a.id - b.id;
        });
      }, error => {
        console.log(error);
      });
    }
  }

  orderQuests() {
    for (let i = 0; i < this.allData.length; i++) {
      if (this.allData[i].parent.length == 0) {
        this.finalData[i] = this.allData[i];
      } else {
        for (let j = 0; j < this.allData[i].parent.length; j++) {
          if (this.allData[i].messages.length > 0) {
            this.finalData[this.allData[i].parent[j]].child.push(this.allData[i]);
          }
        }
      }
    }
    this.finalData = this.finalData.filter(item => (item.messages.length > 0));
  }

  changeStatus(event, id) {
    const index = this.choices.indexOf(id, 0);
    if (index > -1) {
      this.choices.splice(index, 1);
      this.changeDivBackgroundColor(id, false);
    } else {
      this.choices.push(id);
      this.changeDivBackgroundColor(id, true);
    }
    this.chooseItems();
    event.stopPropagation();
  }

  chooseItems(maxLength: number = this.choices.length, finalRes = []) {
    let elements: String[] = [];
    for (let elem in this.allData) {
      if (this.choices.indexOf(this.allData[elem].id, 0) > -1 && !this.allData[elem].messages.some(r => finalRes.includes(r))) {
        for (let url in this.allData[elem].messages) {
          elements.push(this.allData[elem].messages[url])
        }
      }
    }

    let counts = {};
    elements.forEach(function (x: any) { counts[x] = (counts[x] || 0) + 1; });

    let highestValue: number = 0;
    let keyHighestValue: String = "";
    for (let count in counts) {
      if (
        (count.includes("Meow Corp") && counts[count] >= highestValue) ||
        (count.includes("The Toon Town") && counts[count] >= highestValue) ||
        counts[count] > highestValue) {
        highestValue = counts[count];
        keyHighestValue = count;
      }
    }
    finalRes.push(keyHighestValue);
    if (highestValue < maxLength) {
      this.chooseItems(maxLength - highestValue, finalRes)
    } else {
      this.optimizedChoices = finalRes;
    }
  }

  changeDivBackgroundColor(elementId, choice) {
    let classes = document.getElementsByClassName(elementId);
    for (var i = 0; i < classes.length; i++) {
      if (choice) {
        (<HTMLElement>document.getElementsByClassName(elementId)[i]).style.backgroundColor = "rgb(144,238,144)";
      } else {
        (<HTMLElement>document.getElementsByClassName(elementId)[i]).style.backgroundColor = 'white';
      }
    }
  }

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    val = val.split("(", 1)[0];
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.openSnackBar(`${val} est copié dans le presse-papier.`)
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Fermer', { duration: 3000 });
  }
}
