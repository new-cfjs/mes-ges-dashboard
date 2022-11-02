import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distanceFormat'
})
export class DistanceFormatPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): number {
    return Math.round(value / 1000 * 10) / 10;
  }
}
