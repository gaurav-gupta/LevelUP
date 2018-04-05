import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'approvedPipe',
})
export class ApprovedPipe implements PipeTransform  {
    transform(objects: any[]): any[] {
        if (objects) {
            return objects.filter(object => {
                if (object.status) {
                    return object.status === 'Approved';
                }
            });
        }
    }
}
