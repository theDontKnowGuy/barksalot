

import { WeatherBlock } from "../../components/WeatherBlock";
import { WeatherLocationProp } from "../../types";
import "./ForecastPage.css";
import image from "../../assets/background.jpg";
import { useState } from "react";

export const ForecastPage = () => {
  const [numberOfDays, setNumberOfDays] = useState < number > (4);

  // const [forecasts, setForecasts] = useGetForecasts("1", new Date(), 4);
  // let [forecasts, setForecasts] = useState<WeatherLocationProp[]>([]);

  //   useEffect(() => {
  //   if (selectedLocation) {
  //     [forecasts, setForecasts] = useGetForecasts(selectedLocation?.id, new Date(), 4);
  //   }
  // }, []);

  const forecasts = [
    {
      realFeel: 30.463523310644874,
      humidity: 14.650347168073047,
      temperature: 32.77089642513675,
      date: "1970-01-01T00:00:00.123Z",
    },
    {
      realFeel: 40.463523310644874,
      humidity: 34.650347168073047,
      temperature: 2.77089642513675,
      date: "1971-01-01T00:00:00.123Z",
    },
  ];

  return (
    <div id="main" style={{ backgroundImage: `url(${image})` }}>
      <div style={{ height: "30px" }}></div>
      <div className="mx-auto d-flex justify-content-around bg-light mb-5 col-10">
        <div>
          <h3>טמפרטורה ממוצעת</h3>
          <h4>div b</h4>
        </div>

        <div>
          <h3>היום הקר ביותר</h3>
          <i className="d-inline h3 bi bi-lightning-fill lightning-icon mt-5 ml-2" aria-hidden="true"></i>
          <h4 className="d-inline">div b</h4>
        </div>

        <div>
          <h3>היום החם ביותר</h3>
          <i className="d-inline h3 bi bi-sun-fill sun-icon mt-5 ml-2" aria-hidden="true"></i>
          <h4 className="d-inline">div b </h4>
        </div>
      </div>

      <div style={{ height: "30px" }}></div>
      <div className="mx-auto d-flex justify-content-around bg-light mb-5 col-10">
        <div>
          <p style={{ fontSize: "20px" }} className="d-inline"> כמה ימים להציג לך קדימה ? </p>
          <h4 className="d-inline">{numberOfDays} ימים</h4>
        </div>

        <div>

          <form>
            <div className="form-group">
              <input onInput={() => setNumberOfDays(4)} type="range" className="custom-range" value="4" min="4" max="7" id="range" />
            </div>
          </form>
        </div>
      </div>

      <div className="d-flex flex-row">
        <div>
          {forecasts.map((forecast: WeatherLocationProp) => (
            <WeatherBlock key={forecast.date} weather={forecast} />
          ))}
        </div>
      </div>
    </div>
  );
};


