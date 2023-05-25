import {Component, Input, OnInit} from '@angular/core';
import {Buyer, SpendingData} from "../../../../../../entities/gql-retun-types";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-expense-tree',
  templateUrl: './expense-tree.component.html',
  styleUrls: ['./expense-tree.component.scss']
})
export class ExpenseTreeComponent implements OnInit {

  @Input() data: SpendingData[] | undefined;
  groupedData: Group[] = [];
  totalValue: number = 0;

  constructor(public sanitizer: DomSanitizer,) {
  }

  ngOnInit() {
    this.totalValue = Math.floor(this.data?.reduce((sum, spending) => sum + spending.value, 0)!);
    this.groupedData = this.groupBy(this.data);
  }

  groupBy(data: SpendingData[] | undefined): Group[] {
    let result: Group[] = [];
    if (data) {
      let groupMap: { [key: string]: Group } = {};
      data.forEach((spending) => {
        let groupName = spending.shoppingListItem?.name || spending.name;
        if (!groupMap[groupName!]) {
          groupMap[groupName!] = {
            name: groupName!,
            buyer: spending.buyer,
            value: 0,
            items: [],
            showDetails: false
          };
          result.push(groupMap[groupName!]);
        }
        groupMap[groupName!].value += spending.value;
        groupMap[groupName!].items.push(spending);
      });
    }
    return result;
  }
}

interface Group {
  showDetails: boolean;
  name: string;
  buyer: Buyer;
  value: number;
  items: SpendingData[];
}
