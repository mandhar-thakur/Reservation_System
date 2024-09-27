import { useState, useEffect } from "react";
import { ethers } from "ethers";
import reservation_abi from "../artifacts/contracts/ReservationSystem.sol/ReservationSystem.json";
import { IoMdRefresh } from "react-icons/io";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [reservationContract, setReservationContract] = useState(undefined);
  const [reservations, setReservations] = useState([]);
  const [newReservationName, setNewReservationName] = useState("");
  const [newReservationDate, setNewReservationDate] = useState("");
  const [updateReservationId, setUpdateReservationId] = useState(0);
  const [updateReservationName, setUpdateReservationName] = useState("");
  const [updateReservationDate, setUpdateReservationDate] = useState(0);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Update to your reservation contract address
  const reservationABI = reservation_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account[0]); // Assuming the first account is used
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // Once wallet is set, we can get a reference to our deployed contract
    getReservationContract();
  };

  const getReservationContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const reservationContractInstance = new ethers.Contract(contractAddress, reservationABI, signer);

    setReservationContract(reservationContractInstance);
  };

  const makeReservation = async () => {
    if (reservationContract) {
      const tx = await reservationContract.makeReservation(newReservationName, Math.floor(new Date(newReservationDate).getTime() / 1000));
      await tx.wait();
      getReservations(); // Refresh reservations
    }
  };

  const updateReservation = async () => {
    if (reservationContract) {
      const tx = await reservationContract.updateReservation(updateReservationId, updateReservationName, Math.floor(new Date(updateReservationDate).getTime() / 1000));
      await tx.wait();
      getReservations(); // Refresh reservations
    }
  };

  const cancelReservation = async (reservationId) => {
    if (reservationContract) {
      const tx = await reservationContract.cancelReservation(reservationId);
      await tx.wait();
      getReservations(); // Refresh reservations
    }
  };

  const getReservations = async () => {
    if (reservationContract) {
      const count = await reservationContract.nextReservationId(); // Get the count of reservations
      const allReservations = [];
      for (let i = 0; i < count; i++) {
        const reservation = await reservationContract.reservations(i);
        if (reservation.isActive) {
          allReservations.push(reservation);
        }
      }
      setReservations(allReservations);
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p style={style.warning}>Please install Metamask in order to use this Reservation System.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button style={style.button} onClick={connectAccount}>Connect Metamask Wallet</button>;
    }

    return (
      <div style={style.reservationContainer}>
        <h2 style={style.title}>Your Reservations <button style={style.icon} onClick={getReservations}><IoMdRefresh /></button></h2> 
        <div style={style.scrollableTable}>
          <table style={style.table}>
            <thead>
              <tr>
                <th style={style.tableHeader}>ID</th>
                <th style={style.tableHeader}>Name</th>
                <th style={style.tableHeader}>Date</th>
                <th style={style.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res.reservationId.toString()} style={style.tableRow}>
                  <td>{res.reservationId.toString()}</td>
                  <td>{res.reserverName}</td>
                  <td>{new Date(res.reservationDate * 1000).toLocaleString()}</td>
                  <td>
                    <button style={style.button} onClick={() => cancelReservation(res.reservationId)}>Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 style={style.subTitle}>Make a New Reservation</h3>
        <input
          type="text"
          placeholder="Your Name"
          style={style.input}
          value={newReservationName}
          onChange={(e) => setNewReservationName(e.target.value)}
        />
        <input
          type="datetime-local"
          style={style.input}
          value={newReservationDate}
          onChange={(e) => setNewReservationDate(e.target.value)}
        />
        <button style={style.button} onClick={makeReservation}>Make Reservation</button>

        <h3 style={style.subTitle}>Update a Reservation</h3>
        <input
          type="number"
          placeholder="Reservation ID"
          style={style.input}
          value={updateReservationId}
          onChange={(e) => setUpdateReservationId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Your Name"
          style={style.input}
          value={updateReservationName}
          onChange={(e) => setUpdateReservationName(e.target.value)}
        />
        <input
          type="datetime-local"
          style={style.input}
          value={updateReservationDate}
          onChange={(e) => setUpdateReservationDate(e.target.value)}
        />
        <button style={style.button} onClick={updateReservation}>Update Reservation</button>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main style={style.container}>
      <header>
        <h1 style={style.header}>Welcome to the Reservation System!</h1>
      </header>
      <div style={style.content}>
      {initUser()}
      </div>
    </main>
  );
}

// Styles
const style = {
  container: {
    textAlign: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#1c1c1c",
    color: "#f1f1f1",
    minHeight: "92vh",
    overflow: "hidden",
  },
  content: {
    overflow: "hidden",
  },
  header: {
    color: "#ffcc00",
  },
  title: {
    color: "#ffcc00",
    marginBottom: "10px",
  },
  subTitle: {
    marginTop: "20px",
    color: "#ffcc00",
  },
  reservationContainer: {
    marginTop: "20px",
    backgroundColor: "#333",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },
  scrollableTable: {
    maxHeight: "200px",  // Limit the height to 300px
    overflowY: "auto",   // Enable vertical scrolling
    overflowX: "auto",   // Enable horizontal scrolling if needed (for wide content)
  },
  tableHeader: {
    backgroundColor: "#444",
    color: "#ffcc00",
    padding: "10px",
    textAlign: "center",
    borderBottom: "2px solid #ffcc00",
  },
  tableRow: {
    backgroundColor: "#555",
    color: "#f1f1f1",
    transition: "background-color 0.3s ease",
  },
  tableRowHover: {
    backgroundColor: "#666",
  },
  button: {
    backgroundColor: "#ffcc00",
    color: "#1c1c1c",
    padding: "15px",
    height: "43px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#e6b800",
  },
  input: {
    padding: "10px",
    margin: "10px 10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#fff",
    color: "#1c1c1c",
    fontSize: "16px",
  },
  warning: {
    color: "#ffcc00",
    marginTop: "20px",
  },
  icon: {
    height: "20px",
    marginLeft: "10px",
  }
};

