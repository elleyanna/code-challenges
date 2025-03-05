import React, { useState, useEffect } from "react";
import "./fareCalculator.scss";

const FareCalculator = () => {
  const [zone, setZone] = useState(1);
  const [type, setType] = useState("weekday");
  const [purchase, setPurchase] = useState("advance_purchase");
  const [trips, setTrips] = useState(1);
  const [totalPrice, setTotalPrice] = useState(null);
  const [fareData, setFareData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data.json");
        if (!response.ok) throw new Error();
        const data = await response.json();
        setFareData(data);
      } catch (error) {
        setError("Failed to fetch fare data");
        console.error("error ", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!fareData) return;

    const selectedZone = fareData.zones.find(
      (item: { zone: number }) => item.zone === Number(zone)
    );
    if (!selectedZone) {
      setTotalPrice(null);
      return;
    }

    const fareOption = selectedZone.fares.find(
      (option: { type: string; purchase: string }) =>
        option.type === type && option.purchase === purchase
    );
    if (!fareOption) {
      setTotalPrice(null);
      return;
    }

    const pricePerTrip = fareOption.price / fareOption.trips;
    const calculatedTotal = pricePerTrip * trips;

    setTotalPrice(calculatedTotal.toFixed(2));
  }, [zone, type, purchase, trips, fareData]);

  const getFareHelperText = () => {
    switch (type) {
      case "anytime":
        return fareData?.info?.anytime;
      case "weekday":
        return fareData?.info?.weekday;
      case "evening_weekend":
        return fareData?.info.evening_weekend;
      default:
        return "";
    }
  };

  return (
    <div className="fare-calculator">
      <div className="heading-section">
        <img src="/septa.png" alt="Septa logo" className="septa-logo" />
        <h1 className="heading-text">Regional Rail Fares</h1>
      </div>
      <form>
        <div className="section">
          <label className="section-header">
            Where are you going?
            <select
              className="dropdown-select"
              value={zone}
              onChange={(e: { target: { value: number } }) =>
                setZone(Number(e.target.value))
              }
            >
              {fareData?.zones.map((item: { zone: string; name: string }) => (
                <option key={item.zone} value={item.zone}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="section">
          <label className="section-header">
            When are you riding?
            <select
              className="dropdown-select"
              value={type}
              onChange={(e: { target: { value: string } }) =>
                setType(e.target.value)
              }
            >
              <option value="weekday">Weekdays</option>
              <option value="evening_weekend">Evening/Weekend</option>
              <option value="anytime">Anytime</option>
            </select>
          </label>
          <p className="fare-data">{getFareHelperText()}</p>
        </div>
        <div className="section fare">
          <fieldset className="radio-buttons">
            <legend className="section-header">
              Where will you purchase the fare?
            </legend>
            <label className="radio-button">
              <input
                type="radio"
                value="advance_purchase"
                checked={purchase === "advance_purchase"}
                onChange={(e: { target: { value: string } }) =>
                  setPurchase(e.target.value)
                }
              />
              Station Kiosk
            </label>
            <label className="radio-button">
              <input
                type="radio"
                value="onboard_purchase"
                checked={purchase === "onboard_purchase"}
                onChange={(e: { target: { value: string } }) =>
                  setPurchase(e.target.value)
                }
              />
              Onboard
            </label>
          </fieldset>
        </div>
        <div className="section trips">
          <label className="section-header">
            How many rides will you need?
            <input
              type="number"
              className="trip-input"
              value={trips}
              onChange={(e: { target: { value: number } }) =>
                setTrips(Number(e.target.value))
              }
              min="1"
            />
          </label>
        </div>
      </form>
      {totalPrice && (
        <div className="total-price">
          <p>Your fare will cost:</p>
          <h2>${totalPrice}</h2>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default FareCalculator;
