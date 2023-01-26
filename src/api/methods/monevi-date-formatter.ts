class MoneviDateFormatter {
  
  static formatDate(input: any, splitter: string = '/', asText: boolean = false): string {
    let inputDate: Date = MoneviDateFormatter.anyInputToDate(input);
    var date, month, year;

    if (inputDate.getDate() < 10) {
      date = '0' + inputDate.getDate().toString();
    }
    else {
      date = inputDate.getDate().toString();
    }
    if (inputDate.getMonth() < 9) {
      month = '0' + (inputDate.getMonth() + 1).toString();
    }
    else {
      month = (inputDate.getMonth() + 1).toString();
    }
    if (asText == true) {
      month = MoneviDateFormatter.monthMapping(month); 
    }
    year = inputDate.getFullYear().toString();
    return date + splitter + month + splitter + year;
  }

  static formatDateDMYToMonthAndYear(input: any): string {
    let inputDate: Date = MoneviDateFormatter.fromDMYtoMYDDate(input);
    var month, year;

    if (inputDate.getMonth() < 10) {
      month = '0' + (inputDate.getMonth() + 1).toString();
    }
    else {
      month = (inputDate.getMonth() + 1).toString();
    }
    month = MoneviDateFormatter.monthMapping(month);
    year = inputDate.getFullYear().toString();
    return month + " " + year;
  }
  
  static formatMonthAndYearToDateDMY(input: string | any): string {
    var month = MoneviDateFormatter.stringMonthMapping(input.split(" ")[0]);
    var year = input.split(" ")[1];
    
    return MoneviDateFormatter.formatDate(month + "/" + "01" + "/" + year);
  }

  static getMonthsFromDatesBetween(inputStartDate: any, inputEndDate: any): string[] {
    let startDate: Date, endDate: Date, startMonth: number, startYear: number, endMonth: number, endYear: number, result = new Array<string>();
    if (inputStartDate instanceof Date && inputEndDate instanceof Date) {
      startDate = inputStartDate;
      endDate = inputEndDate;
    }
    else if (typeof(inputStartDate) === "number" && typeof(inputEndDate) === "number") {
      startDate = new Date(0); 
      startDate.setUTCMilliseconds(inputStartDate);

      endDate = new Date(0);
      endDate.setUTCMilliseconds(inputEndDate);
    }
    else {
      startDate = new Date(inputStartDate);
      endDate = new Date(inputEndDate);
    }

    startMonth = startDate.getMonth() + 1;
    startYear = startDate.getFullYear();
    endMonth = endDate.getMonth() + 1;
    endYear = endDate.getFullYear();

    let iteratorMonth = startMonth;
    let iteratorYear = startYear;
    while(true) {
      
      let month: string, year: string;
      
      if ( iteratorMonth < 10 ) {
        month = '0' + iteratorMonth.toString();
      }
      else {
        month = iteratorMonth.toString();
      }
      year = iteratorYear.toString();
      result.push( "01" + "/" + month + "/" + year );
      
      if (iteratorMonth == endMonth && iteratorYear == endYear) {
        return result;
      }

      if (iteratorMonth == 12) {
        iteratorYear += 1;
        iteratorMonth = 1;
      } 
      else {
        iteratorMonth += 1;
      }
    }
  }

  static getFirstDateAndLastDateOfADate(input: string): Array<string> {
    var inputDate: Date = MoneviDateFormatter.fromDMYtoMYDDate(input);
  
    let now = MoneviDateFormatter.formatDate( new Date( inputDate.getFullYear(), inputDate.getMonth(), 1) );
    let max = MoneviDateFormatter.formatDate( new Date( inputDate.getFullYear(), inputDate.getMonth() + 1, 0) );
    return new Array<string>(now, max);
  }

  static minusMonth(input: string): string {
    var inputDate: Date = MoneviDateFormatter.fromDMYtoMYDDate(input);

    let previousMonth = MoneviDateFormatter.formatDate( new Date( inputDate.getFullYear(), inputDate.getMonth(), 0), "/", false );
    return previousMonth;
  }

  static fromDMYtoMYDDate(displayDate: string): Date {
    var datearray = displayDate.split("/");
    try {
      var date =  new Date(datearray[1] + '/' + datearray[0] + '/' + datearray[2]);
      return date;
    }
    catch {
      return new Date(Date.now());
    }
  }

  private static anyInputToDate(input: any): Date {
    // SUPPORTED VALUES: DATE, NUMBER (IN MS), STRING 
    let inputDate: Date;
    if (input instanceof Date) {
      inputDate = input;
    }
    else if (typeof(input) === "number") {
      inputDate = new Date(0); 
      inputDate.setUTCMilliseconds(input);
    }
    else if (typeof(input) === "string") {
      // 2023-01-14 becomes Sat Jan 14 2023 07:00:00 GMT+0700 (Western Indonesia Time)
      inputDate = new Date(input);
    }
    else {
      throw new Error("Unsupported Format");
    }
    return inputDate;
  }
  
  private static monthMapping(month: string): string {
    if (month === '01') {
      return 'Januari';
    }
    else if (month === '02') {
      return 'Februari';
    }
    else if (month === '03') {
      return 'Maret';
    }
    else if (month === '04') {
      return 'April';
    }
    else if (month === '05') {
      return 'Mei';
    }
    else if (month === '06') {
      return 'Juni';
    }
    else if (month === '07') {
      return 'Juli';
    }
    else if (month === '08') {
      return 'Agustus';
    }
    else if (month === '09') {
      return 'September';
    }
    else if (month === '10') {
      return 'Oktober';
    }
    else if (month === '11') {
      return 'November';
    }
    else if (month === '12') {
      return 'Desember';
    }
    return "";
  }

  private static stringMonthMapping(month: string): string {
    if (month === 'Januari') {
      return '01';
    }
    else if (month === 'Februari') {
      return '02';
    }
    else if (month === 'Maret') {
      return '03';
    }
    else if (month === 'April') {
      return '04';
    }
    else if (month === 'Mei') {
      return '05';
    }
    else if (month === 'Juni') {
      return '06';
    }
    else if (month === 'Juli') {
      return '07';
    }
    else if (month === 'Agustus') {
      return '08';
    }
    else if (month === 'September') {
      return '09';
    }
    else if (month === 'Oktober') {
      return '10';
    }
    else if (month === 'November') {
      return '11';
    }
    else if (month === 'Desember') {
      return '12';
    }
    return "";
  }
}

export {
  MoneviDateFormatter
};