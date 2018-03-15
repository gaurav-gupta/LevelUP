import * as _ from 'lodash';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'dataFilter'
})
export class DataFilterPipe implements PipeTransform {
  transform(array: any[], query: string): any {
    if (query) {
      return _.filter(array, row => (row.first_name.indexOf(query) > -1) ||
      (row.last_name.indexOf(query) > -1) ||
      (row.email.indexOf(query) > -1));
    }
    return array;
  }
}