export class FuelTank {
    constructor(wetMass, dryMass) {
        this.wetMass = wetMass;
        this.dryMass = dryMass;
        this.fuel = wetMass - dryMass;
    }
}
