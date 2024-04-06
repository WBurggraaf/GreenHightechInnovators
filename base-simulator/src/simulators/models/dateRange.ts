export class DateRange {
    firstDate: Date= new Date();
    lastDate: Date= new Date();

    // Method to calculate the duration between first and last dates
    getDurationInDays(): number {
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const startDate = this.firstDate.getTime();
        const endDate = this.lastDate.getTime();
        const diffDays = Math.round(Math.abs((endDate - startDate) / oneDay));
        return diffDays;
    }
}