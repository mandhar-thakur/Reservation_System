// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ReservationSystem {
    struct Reservation {
        uint256 reservationId;  // Unique ID for the reservation
        string reserverName;     // Name of the person making the reservation
        uint256 reservationDate; // Unix timestamp for the reservation date
        bool isActive;           // Status of the reservation
    }

    
    uint256 public nextReservationId;
    mapping(uint256 => Reservation) public reservations;

    //Event
    event ReservationMade(uint256 indexed reservationId, string reserverName, uint256 reservationDate);
    event ReservationCanceled(uint256 indexed reservationId);
    event ReservationUpdated(uint256 indexed reservationId, string newReserverName, uint256 newReservationDate);

    // Function to make a reservation
    function makeReservation(string memory reserverName, uint256 reservationDate) public {
        require(reservationDate > block.timestamp, "Cannot reserve for past dates");
        require(!isDateReserved(reservationDate), "Date already reserved");

        // Create a new reservation
        reservations[nextReservationId] = Reservation({
            reservationId: nextReservationId,
            reserverName: reserverName,
            reservationDate: reservationDate,
            isActive: true
        });

        emit ReservationMade(nextReservationId, reserverName, reservationDate);
        nextReservationId++;
    }

    // Function to check if a date is reserved
    function isDateReserved(uint256 reservationDate) public view returns (bool) {
        for (uint256 i = 0; i < nextReservationId; i++) {
            if (reservations[i].reservationDate == reservationDate && reservations[i].isActive) {
                return true;
            }
        }
        return false;
    }

    // Function to cancel a reservation
    function cancelReservation(uint256 reservationId) public {
        require(reservations[reservationId].isActive, "No active reservation with this ID");
        reservations[reservationId].isActive = false;
        emit ReservationCanceled(reservationId);
    }

    // Function to update a reservation
    function updateReservation(uint256 reservationId, string memory newReserverName, uint256 newReservationDate) public {
        require(reservations[reservationId].isActive, "No active reservation with this ID");
        require(newReservationDate > block.timestamp, "Cannot update to a past date");
        require(!isDateReserved(newReservationDate), "New date already reserved");

        // Update the reservation details
        reservations[reservationId].reserverName = newReserverName;
        reservations[reservationId].reservationDate = newReservationDate;

        emit ReservationUpdated(reservationId, newReserverName, newReservationDate);
    }
}
