import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'testing-task';
  randomNumber: number;
  openedPagesCounter: number;


  ngOnInit(): void {
    this.randomNumber = Math.floor(Math.random() * 101);
    this.modifyStorage();
    window.addEventListener('storage', () => this.onStorageEvent());
    window.addEventListener('beforeunload', () => this.onCloseTab());
  }

  onCloseTab() {
    const storage = localStorage.getItem('pages');
    const randomNumbers = JSON.parse(storage);
    const updatedArray = randomNumbers.filter(randomNumber => randomNumber.randomNumber !== this.randomNumber);
    this.openedPagesCounter = updatedArray.length;
    localStorage.setItem('pages', JSON.stringify(updatedArray));
  }

  onStorageEvent() {
    const storage = localStorage.getItem('pages');
    const randomNumbers = JSON.parse(storage);
    this.openedPagesCounter = randomNumbers.length;
    const isOddNumber = randomNumbers.find(randomNumber => {
      return randomNumber.randomNumber === this.randomNumber;
    });
    if (isOddNumber === undefined) {
      window.close();
      window.self.close();
    }
  }

  closeAllTabs() {
    const storage = localStorage.getItem('pages');
    const randomNumbers = JSON.parse(storage);

    const currentPage = randomNumbers.find(randomNumber => {
      if (randomNumber.randomNumber === this.randomNumber) {
        return randomNumber.id;
      }
    });
    const filteredRandomNumbers = randomNumbers.filter(randomNumber => {
      return randomNumber.id === currentPage.id || randomNumber.randomNumber % 2 !== 0;
    });
    this.openedPagesCounter = filteredRandomNumbers.length;
    localStorage.setItem('pages', JSON.stringify(filteredRandomNumbers));
  }

  modifyStorage() {
    const storage = localStorage.getItem('pages');

    if (storage) {
      const randomNumbers = JSON.parse(storage);
      randomNumbers.push({
        randomNumber: this.randomNumber,
        id: randomNumbers.length + 1
      });
      this.openedPagesCounter = randomNumbers.length;
      localStorage.setItem('pages', JSON.stringify(randomNumbers));
    } else {
      const initialPage = [
        {
          randomNumber: this.randomNumber,
          id: 1
        }
      ];
      this.openedPagesCounter = 1;
      localStorage.setItem('pages', JSON.stringify(initialPage));
    }
  }
}
