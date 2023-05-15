import { Component, ContentChildren, AfterContentInit, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css']
})
export class TabsContainerComponent implements AfterContentInit {

  @ContentChildren(TabComponent) tabs?: QueryList<TabComponent> = new QueryList()

  ngAfterContentInit(): void {
    const activeTabs = this.tabs?.filter(
      tab => tab.active
    )
    // check if active tab array is empty 
    if (!activeTabs || activeTabs.length === 0) {
      // if array is empty, set active tab
      this.selectTab(this.tabs!.first)
    }
  }

  selectTab(tab: TabComponent){
    // set active properties in other tabs to false to prevent more than 1 active tabs
    this.tabs?.forEach(tab => {
      tab.active = false
    })

    tab.active = true

    return false
  }
}
