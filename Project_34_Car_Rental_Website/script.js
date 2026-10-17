const cars = [
    {
        id: 1,
        name: "Toyota Camry",
        image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=800&auto=format&fit=crop",
        price: 50
    },
    {
        id: 2,
        name: "Honda Accord",
        image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=800&auto=format&fit=crop",
        price: 45
    },
    {
        id: 3,
        name: "BMW 3 Series",
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format&fit=crop",
        price: 90
    },
    {
        id: 4,
        name: "Tesla Model 3",
        image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop",
        price: 110
    },
    {
        id: 5,
        name: "Ford Mustang",
        image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format&fit=crop",
        price: 120
    },
    {
        id: 6,
        name: "Audi A4",
        image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=800&auto=format&fit=crop",
        price: 95
    }
];

const carListElement = document.getElementById("carList");
const carSelect = document.getElementById("carSelect");
const pickupDateEl = document.getElementById("pickupDate");
const returnDateEl = document.getElementById("returnDate");
const totalPriceEl = document.getElementById("totalPrice");
const bookingForm = document.getElementById("bookingForm");

function displayCars() {
    carListElement.innerHTML = "";

    if (cars.length === 0) {
        carListElement.innerHTML = "<p class='loading'>No cars available.</p>";
        return;
    }

    cars.forEach((car) => {
        const carElement = document.createElement("div");
        carElement.classList.add("car");

        carElement.innerHTML = `
            <img src="${car.image}" alt="${car.name}" onerror="this.src='https://via.placeholder.com/400x160?text=Car'">
            <h3>${car.name}</h3>
            <p><span class="price">$${car.price}</span> / day</p>
            <button type="button" data-id="${car.id}">Rent Now</button>
        `;

        carElement.querySelector("button").addEventListener("click", () => {
            rentCar(car.id);
        });

        carListElement.appendChild(carElement);
    });

    carSelect.innerHTML = "";
    cars.forEach((car) => {
        const option = document.createElement("option");
        option.value = car.id;
        option.textContent = `${car.name} — $${car.price}/day`;
        carSelect.appendChild(option);
    });
}

function rentCar(carId) {
    carSelect.value = carId;
    document
        .getElementById("bookingSection")
        .scrollIntoView({ behavior: "smooth" });
    updateTotal();
}

function updateTotal() {
    const carId = Number(carSelect.value);
    const pickup = new Date(pickupDateEl.value);
    const returnD = new Date(returnDateEl.value);

    if (!carId || !pickupDateEl.value || !returnDateEl.value || returnD <= pickup) {
        totalPriceEl.textContent = "Total: —";
        return;
    }

    const car = cars.find((c) => c.id === carId);
    const days = Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24));
    const total = days * car.price;

    totalPriceEl.textContent = `Total: $${total} for ${days} day${days > 1 ? "s" : ""}`;
}

function submitBooking(e) {
    e.preventDefault();

    const carId = Number(carSelect.value);
    const pickup = new Date(pickupDateEl.value);
    const returnD = new Date(returnDateEl.value);

    if (!carId) {
        alert("Please select a car.");
        return;
    }
    if (!pickupDateEl.value || !returnDateEl.value) {
        alert("Please select pickup and return dates.");
        return;
    }
    if (returnD <= pickup) {
        alert("Return date must be after pickup date.");
        return;
    }

    const car = cars.find((c) => c.id === carId);
    const days = Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24));
    const total = days * car.price;

    alert(
        `✅ Booking Confirmed!\n\nCar: ${car.name}\nPickup: ${pickupDateEl.value}\nReturn: ${returnDateEl.value}\nDays: ${days}\nTotal: $${total}`
    );
}

bookingForm.addEventListener("submit", submitBooking);
carSelect.addEventListener("change", updateTotal);
pickupDateEl.addEventListener("change", updateTotal);
returnDateEl.addEventListener("change", updateTotal);

document.addEventListener("DOMContentLoaded", () => {
    const today = new Date().toISOString().split("T")[0];
    pickupDateEl.min = today;
    returnDateEl.min = today;

    displayCars();
});
