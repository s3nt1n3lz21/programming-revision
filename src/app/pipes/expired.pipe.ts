import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'expired' })
export class ExpiredPipe implements PipeTransform {
    transform(date: string): boolean {
        return new Date(date) < new Date();
    }
}