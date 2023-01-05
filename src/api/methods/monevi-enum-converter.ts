class MoneviEnumConverter {

    static convertUserAccountRole(bahasaIndonesiaRoleName: string): string | undefined {
        if (bahasaIndonesiaRoleName === "BENDAHARA") {
            return "TREASURER";
        }
        else if (bahasaIndonesiaRoleName === "KETUA") {
            return "CHAIRMAN";
        }
        else if (bahasaIndonesiaRoleName === "SUPERVISOR") {
            return "SUPERVISOR";
        }
        return undefined
    }
}

export { 
    MoneviEnumConverter
};