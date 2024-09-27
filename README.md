# Reservation System

Reservation System is a decentralized application that allows users to interact with their Ethereum accounts, manage bookings and cancellations, view account history. This application provides an easy-to-use interface for managing digital/onine booking and viewing transaction details.

## Description

Reservation System is designed to simulate a traditional booking experience using Ethereum smart contracts. Users can connect their MetaMask wallet to view their account information, book or cancel reservations,track and update their booking history. This application leverages Ethereum's blockchain to ensure secure and transparent transactions.

## Getting Started

### Prerequisites

- **Node.js**: Ensure Node.js is installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).
- **MetaMask**: Install and configure MetaMask. You can get it from [metamask.io](https://metamask.io/).

### Installing

1. **Clone the repository:**

   ```git clone https://github.com/mandhar-thakur/Reservation_System.git```

2. **Navigate to the project directory:**

   ```cd **Reservation_System**```

3. **Install dependencies:**

   ```npm install```

### Running the Project

1. **Open a terminal and start the Hardhat local Ethereum node:**
   
   ```npx hardhat node```

2. **Open a second terminal and deploy the smart contract to the local network:**
   
   ```npx hardhat run --network localhost scripts/deploy.js```

3. **Open a third terminal and start the front-end development server:**
   
   ```npm run dev```

4. **Visit the application in your browser:**
   
   ```ready - started server on 0.0.0.0:3000, url: http://localhost:3000```

**Connect your MetaMask wallet to the application.**

## Features
- View all reservations
- book cancel and update reservations
- View booking history

## Help
If you encounter any issues or need assistance, make sure:
- MetaMask is properly installed and configured.
- Your Ethereum wallet has sufficient funds for transactions and gas fees.
- You are connected to the correct network.

For further help, refer to MetaMask's [official documentation](https://metamask.io/learn/).
