import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'testing-task';
  randomNumber: number;
  openedPagesCounter = 1;

  ngOnInit(): void {
    this.randomNumber = Math.floor(Math.random() * 101);
    this.modifyStorage();
    this.onStorageEvent();
    this.onCloseTab();
  }

  onCloseTab() {
    window.onbeforeunload = () => {
      const storage = localStorage.getItem('pages');
      let [counter, randomNumbers] = JSON.parse(storage);
      const updatedArray = randomNumbers.filter(randomNumber => randomNumber !== this.randomNumber);
      counter = updatedArray.length;
      localStorage.setItem('pages', JSON.stringify([counter, updatedArray]));
    };
  }

  onStorageEvent() {
    window.onstorage = () => {
      const storage = localStorage.getItem('pages');
      const [counter, randomNumbers] = JSON.parse(storage);
      this.openedPagesCounter = counter;
      const isOddNumber = randomNumbers.find(randomNumber => randomNumber === this.randomNumber);
      if (isOddNumber === undefined) {
        window.close();
      }
    };
  }

  closeAllTabs() {
    const storage = localStorage.getItem('pages');
    let [counter, randomNumbers] = JSON.parse(storage);

    const filteredRandomNumbers = randomNumbers.filter(randomNumber => randomNumber % 2 !== 0);
    counter = filteredRandomNumbers.length;
    localStorage.setItem('pages', JSON.stringify([counter, filteredRandomNumbers]));
  }

  modifyStorage() {
    const storage = localStorage.getItem('pages');

    if (storage) {
      let [counter, randomNumbers] = JSON.parse(storage);
      counter++;
      this.openedPagesCounter = counter;
      randomNumbers.push(this.randomNumber);
      localStorage.setItem('pages', JSON.stringify([counter, randomNumbers]));
    } else {
      const initialPage = [
        this.openedPagesCounter,
        [
          this.randomNumber
        ]
      ];
      localStorage.setItem('pages', JSON.stringify(initialPage));
    }
  }
}
