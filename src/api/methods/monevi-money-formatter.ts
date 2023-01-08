class MoneviMoneyFormatter {

  static toRupiah(number: number): string {
    const rupiah = `Rp${number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    return rupiah;
  }
  
}


export {
  MoneviMoneyFormatter
};