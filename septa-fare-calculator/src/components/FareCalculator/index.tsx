import React, { useState, useEffect } from "react";
import { FareData } from "../../types/fare";

const FareCalculator = () => {
  const [zone, setZone] = useState(1);
  const [type, setType] = useState("weekday");
  const [purchase, setPurchase] = useState("advance_purchase");
  const [trips, setTrips] = useState(1);
  const [totalPrice, setTotalPrice] = useState<string | null>(null);
  const [fareData, setFareData] = useState<FareData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data.json");
        if (!response.ok) throw new Error();
        const data = await response.json();
        setFareData(data);
        console.log("fare data: ", fareData);
      } catch (error) {
        setError(error);
        console.log("error ", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const selectedZone = fareData?.zones.find(
      (item: { zone: number }) => item.zone === Number(zone)
    );
    if (!selectedZone) return;

    const fareOption = selectedZone.fares.find(
      (option: { type: string; purchase: string }) =>
        option.type === type && option.purchase === purchase
    );
    if (!fareOption) return;

    const pricePerTrip = fareOption.price / fareOption.trips;
    const calculatedTotal = pricePerTrip * trips;

    setTotalPrice(calculatedTotal.toFixed(2));
  };

  return (
    <div>
      <h2>SEPTA Fare Calculator</h2>
      {type === "anytime" && <p>{fareData?.info.anytime}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Zone:
          <select
            value={zone}
            onChange={(e) => setZone(Number(e.target.value))}
          >
            {fareData?.zones.map((item) => (
              <option key={item.zone} value={item.zone}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Type:
          <select
            value={type}
            onChange={(e: { target: { value: string } }) =>
              setType(e.target.value)
            }
          >
            <option value="weekday">Weekday</option>
            <option value="evening_weekend">Evening/Weekend</option>
            <option value="anytime">Anytime</option>
          </select>
        </label>
        <fieldset>
          <legend>Purchase Method:</legend>
          <label>
            <input
              type="radio"
              value="advance_purchase"
              checked={purchase === "advance_purchase"}
              onChange={(e: { target: { value: string } }) =>
                setPurchase(e.target.value)
              }
            />
            Advance Purchase
          </label>
          <label>
            <input
              type="radio"
              value="onboard_purchase"
              checked={purchase === "onboard_purchase"}
              onChange={(e: { target: { value: string } }) =>
                setPurchase(e.target.value)
              }
            />
            Onboard Purchase
          </label>
        </fieldset>
        <label>
          Trips:
          <input
            type="number"
            value={trips}
            onChange={(e) => setTrips(Number(e.target.value))}
            min="1"
          />
        </label>
        <button type="submit">Calculate Fare</button>
      </form>

      {totalPrice && <div>Total Price: ${totalPrice}</div>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default FareCalculator;
