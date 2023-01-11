class MoneviEnumConverter {

    static convertUserAccountRole(bahasaIndonesiaRoleName: string): string | null {
        if (bahasaIndonesiaRoleName === "BENDAHARA") {
            return "TREASURER";
        }
        else if (bahasaIndonesiaRoleName === "KETUA") {
            return "CHAIRMAN";
        }
        else if (bahasaIndonesiaRoleName === "SUPERVISOR") {
            return "SUPERVISOR";
        }
        return null;
    }
}

export { 
    MoneviEnumConverter
};