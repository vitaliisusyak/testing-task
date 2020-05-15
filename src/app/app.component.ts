import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'testing-task';
  randomNumber: number;
  openedPagesCounter: number;


  ngOnInit(): void {
    this.randomNumber = Math.floor(Math.random() * 101);
    this.modifyStorage();
    window.addEventListener('storage', () => this.onStorageEvent());
    window.addEventListener('beforeunload', () => this.onCloseTab());
  }

  getInfoFromLocalStorage() {
    const storage = localStorage.getItem('pages');
    return JSON.parse(storage);
  }

  setInfoToLocalStorage(key, info) {
    return localStorage.setItem(key, JSON.stringify(info));
  }

  onCloseTab() {
    const storage = this.getInfoFromLocalStorage();
    const filteredStorage = storage.filter(openedPage => openedPage.randomNumber !== this.randomNumber);
    this.openedPagesCounter = filteredStorage.length;
    this.setInfoToLocalStorage('pages', filteredStorage);
  }

  onStorageEvent() {
    const storage = this.getInfoFromLocalStorage();
    this.openedPagesCounter = storage.length;
    const isOddNumber = storage.find(openedPage => {
      return openedPage.randomNumber === this.randomNumber;
    });
    if (isOddNumber === undefined) {
      window.close();
    }
  }

  closeAllTabs() {
    const storage = this.getInfoFromLocalStorage();
    const currentPage = storage.find(openedPage => {
      if (openedPage.randomNumber === this.randomNumber) {
        return openedPage.id;
      }
    });
    const filteredStorage = storage.filter(randomNumber => {
      return randomNumber.id === currentPage.id || randomNumber.randomNumber % 2 !== 0;
    });
    this.openedPagesCounter = filteredStorage.length;
    this.setInfoToLocalStorage('pages', filteredStorage);
  }

  modifyStorage() {
    const storage = this.getInfoFromLocalStorage();
    if (storage) {
      storage.push({
        randomNumber: this.randomNumber,
        id: storage.length + 1
      });
      this.openedPagesCounter = storage.length;
      this.setInfoToLocalStorage('pages', storage);
    } else {
      const initialPage = [
        {
          randomNumber: this.randomNumber,
          id: 1
        }
      ];
      this.openedPagesCounter = 1;
      this.setInfoToLocalStorage('pages', initialPage);
    }
  }

  ngOnDestroy() {
    window.removeEventListener('storage', () => this.onStorageEvent());
    window.removeEventListener('beforeunload', () => this.onCloseTab());
  }
}
