class MoneviEnumConverter {

    static convertUserAccountRole(roleName: string): string {
        if (roleName.toUpperCase() === "BENDAHARA") {
            return "TREASURER";
        }
        else if (roleName.toUpperCase() === "KETUA") {
            return "CHAIRMAN";
        }
        else if (roleName.toUpperCase() === "SUPERVISOR") {
            return "SUPERVISOR";
        }
        return "";
    }

    static convertTransactionType(transactionType: string): string | null {
        if (transactionType === "Non Rutin") {
            return "NON_DAILY";
        }
        else if (transactionType === "Rutin") {
            return "DAILY";
        }
        return null;
    }

    static convertGeneralLedgerAccountType(generalLedgerAccountType: string): string | null{
        if (generalLedgerAccountType === "Kas") {
            return "CASH";
        }
        else if (generalLedgerAccountType === "Bank") {
            return "BANK";
        }
        return null;
    }

    static convertEntryPosition(entryPosition: string): string | null{
        if (entryPosition === "Debit") {
            return "DEBIT";
        }
        else if (entryPosition === "Kredit") {
            return "CREDIT";
        }
        return null;
    }

}

export { 
    MoneviEnumConverter
};