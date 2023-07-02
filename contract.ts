import { context, PersistentVector, logging } from 'near-sdk-as';

export class WhitelistContract {
  private whitelist: PersistentVector<string>;

  constructor() {
    this.whitelist = new PersistentVector<string>('w');
  }

  // Method to add an address to the whitelist
  addAddress(address: string): void {
    this.onlyOwner(); 
    this.whitelist.push(address);
    logging.log(`Address ${address} added to the whitelist.`);
  }

  // Method to remove an address from the whitelist
  removeAddress(address: string): void {
    this.onlyOwner();
    for (let i = 0; i < this.whitelist.length; i++) {
      if (this.whitelist[i] == address) {
        this.whitelist.swap_remove(i);
        logging.log(`Address ${address} removed from the whitelist.`);
        return;
      }
    }
    logging.log(`Address ${address} not found in the whitelist.`);
  }

  // Method to check if an address is whitelisted
  isWhitelisted(address: string): boolean {
    for (let i = 0; i < this.whitelist.length; i++) {
      if (this.whitelist[i] == address) {
        return true;
      }
    }
    return false;
  }

  // Modifier to ensure only the contract owner can call a method
  private onlyOwner(): void {
    if (context.predecessor !== context.contractName) {
      throw new Error('Only the contract owner can call this method.');
    }
  }
}

// Create and export an instance of the contract class
export const whitelistContract = new WhitelistContract();
