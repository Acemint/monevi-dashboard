class MoneviDateFormatter {
  
  static formatDate(input: any, splitter: string = '/', monthNumberToString: boolean = false) {
    let inputDate: Date;
    if (input instanceof Date) {
      inputDate = input;
    }
    else {
      inputDate = new Date(input);
    }

    var date, month, year;

    if (inputDate.getDate() < 10) {
      date = '0' + inputDate.getDate().toString();
    }
    else {
      date = inputDate.getDate().toString();
    }
    if (inputDate.getMonth() < 10) {
      month = '0' + (inputDate.getMonth() + 1).toString();
    }
    else {
      month = (inputDate.getMonth() + 1).toString();
    }
    if (monthNumberToString == true) {
      month = MoneviDateFormatter.monthMapping(month);
    }
    year = inputDate.getFullYear().toString();
    let moneviDate = date + splitter + month + splitter + year;
    return moneviDate;
  }

  static monthMapping(month: string) {
    if (month == '01') {
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

  static epochToDate(milliseconds: number) {
    var date = new Date(0); 
    date.setUTCMilliseconds(milliseconds);

    var outputDate = MoneviDateFormatter.formatDate(date, ' ', true);
    return outputDate;
  }

}

export {
  MoneviDateFormatter
};