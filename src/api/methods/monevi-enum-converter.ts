class MoneviEnumConverter {
  static convertUserAccountRole(roleName: string): string {
    if (roleName.toUpperCase() === 'BENDAHARA') {
      return 'TREASURER';
    } else if (roleName.toUpperCase() === 'KETUA') {
      return 'CHAIRMAN';
    } else if (roleName.toUpperCase() === 'SUPERVISOR') {
      return 'SUPERVISOR';
    }
    return '';
  }

  static convertTransactionType(transactionType: string): string {
    if (transactionType === 'Non Rutin') {
      return 'NON_DAILY';
    } else if (transactionType === 'Rutin') {
      return 'DAILY';
    }
    return '';
  }

  static convertGeneralLedgerAccountType(generalLedgerAccountType: string): string {
    if (generalLedgerAccountType === 'Kas') {
      return 'CASH';
    } else if (generalLedgerAccountType === 'Bank') {
      return 'BANK';
    }
    return '';
  }

  static convertEntryPosition(entryPosition: string): string {
    if (entryPosition === 'Debit') {
      return 'DEBIT';
    } else if (entryPosition === 'Kredit') {
      return 'CREDIT';
    }
    return '';
  }
}

export { MoneviEnumConverter };
